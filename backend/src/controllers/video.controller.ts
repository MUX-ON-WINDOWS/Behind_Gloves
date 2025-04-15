import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { unlink } from 'fs/promises';
import axios from 'axios';

// Initialize Supabase client
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Supabase credentials are not configured');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
};

// In-memory store for analysis results (replace with database in production)
const analysisResults = new Map<string, {
  status: 'processing' | 'completed';
  data?: {
    saves: number;
    goals: number;
    events: Array<{
      type: 'save' | 'goal';
      timestamp: string;
      description: string;
    }>;
  };
}>();

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    console.log("Received file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? `Buffer of ${req.file.buffer.length} bytes` : 'No buffer'
    });

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload to Supabase Storage
    const supabase = getSupabaseClient();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, req.file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: req.file.mimetype
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    console.log("Uploaded video to Supabase Storage:", uploadData);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    console.log("Generated public URL:", publicUrl);

    // Start analysis in the background
    analyzeVideo(fileName, publicUrl);
    
    return res.status(200).json({ 
      videoId: fileName,
      publicUrl
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return res.status(500).json({ error: 'Failed to upload video' });
  }
};

export const getAnalysisResults = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    
    if (!analysisResults.has(videoId)) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const result = analysisResults.get(videoId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting analysis results:', error);
    return res.status(500).json({ error: 'Failed to get analysis results' });
  }
};

// Helper function to format timestamp
function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to convert timestamp to seconds
function timestampToSeconds(timestamp: string): number {
  const [minutes, seconds] = timestamp.split(':').map(Number);
  return minutes * 60 + seconds;
}

async function analyzeVideo(videoId: string, videoUrl: string) {
  try {
    // Set initial status
    analysisResults.set(videoId, { status: 'processing' });
    console.log("Starting analysis");
    console.log(videoId);

    // Fetch the video content from the URL
    const videoResponse = await axios.get(videoUrl, {
      responseType: 'arraybuffer'
    });
    
    // Convert the video buffer to base64
    const videoBase64 = Buffer.from(videoResponse.data).toString('base64');

    // Prepare the Gemini API request with the video data
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      {
        contents: [{
          parts: [{
            text: `You are a hockey video analyst. Analyze this hockey goalie video and identify all saves and goals. For each event, provide:
            1. The type (save or goal)
            2. The timestamp in MM:SS format
            3. A brief description of what happened
            
            IMPORTANT: Respond ONLY with a JSON object in this exact format:
            {
              "saves": number,
              "goals": number,
              "events": [
                {
                  "type": "save" or "goal",
                  "timestamp": "MM:SS",
                  "description": "description"
                }
              ]
            }
            
            Do not include any other text or explanation.`
          }, {
            inlineData: {
              mimeType: "video/mp4",
              data: videoBase64
            }
          }]
        }]
      },
      {
        headers: {
          'x-goog-api-key': 'AIzaSyDF6Voc8Qoi_XTMbuUfKJzt0LnLBNXwDlI',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Raw Gemini Response:", geminiResponse.data);

    // Extract the text response
    const responseText = geminiResponse.data.candidates[0].content.parts[0].text;
    console.log("Response Text:", responseText);

    // Try to find JSON in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response. Full response:", responseText);
      throw new Error('No JSON found in response');
    }

    // Parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
      console.log("Parsed Analysis:", analysis);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("JSON string:", jsonMatch[0]);
      throw new Error('Failed to parse JSON response');
    }

    // Validate the analysis structure
    if (typeof analysis !== 'object') {
      console.error("Analysis is not an object:", analysis);
      throw new Error('Invalid analysis structure: not an object');
    }

    if (typeof analysis.saves !== 'number') {
      console.error("Invalid saves count:", analysis.saves);
      analysis.saves = 0;
    }

    if (typeof analysis.goals !== 'number') {
      console.error("Invalid goals count:", analysis.goals);
      analysis.goals = 0;
    }

    if (!Array.isArray(analysis.events)) {
      console.error("Events is not an array:", analysis.events);
      analysis.events = [];
    }

    // Validate each event
    if (analysis.events) {
      analysis.events = analysis.events.filter((event: any) => {
        const isValid = 
          typeof event === 'object' &&
          (event.type === 'save' || event.type === 'goal') &&
          typeof event.timestamp === 'string' &&
          typeof event.description === 'string';
        
        if (!isValid) {
          console.error("Invalid event structure:", event);
        }
        return isValid;
      });

      // Sort events by timestamp
      if (analysis.events.length > 0) {
        analysis.events.sort((a: any, b: any) => {
          const timeA = timestampToSeconds(a.timestamp);
          const timeB = timestampToSeconds(b.timestamp);
          return timeA - timeB;
        });
      }
    }

    // Update the results
    analysisResults.set(videoId, {
      status: 'completed',
      data: analysis
    });
    
  } catch (error: any) {
    console.error('Error analyzing video:', error);
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("Config:", error.config);

    // Set a default analysis result in case of error
    analysisResults.set(videoId, {
      status: 'completed',
      data: {
        saves: 0,
        goals: 0,
        events: []
      }
    });
  }
}

function getRandomSaveDescription(): string {
  const descriptions = [
    'Quick reaction save from close range',
    'Diving save to the top corner',
    'Strong hands to push the shot away',
    'Great positioning to make the block',
    'One-on-one save against the striker',
    'Fingertip save over the crossbar',
    'Brave save at the striker\'s feet',
    'Punched clear from a dangerous cross'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomGoalDescription(): string {
  const descriptions = [
    'Powerful shot to the top corner',
    'Header from a corner kick',
    'Low drive into the bottom corner',
    'Penalty kick conversion',
    'Breakaway finish',
    'Long-range effort',
    'Deflected shot wrong-foots the keeper',
    'Tap-in from close range'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
} 