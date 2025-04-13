import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import axios from 'axios';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { videoUrl, title, description } = await req.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Download the video
    const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(response.data);
    
    // Create a temporary file
    const tempDir = os.tmpdir();
    const videoId = uuidv4();
    const videoPath = path.join(tempDir, `${videoId}.mp4`);
    fs.writeFileSync(videoPath, videoBuffer);

    // Extract frames from video
    const frames = await extractFrames(videoPath, 6);
    
    // Clean up the temporary video file
    fs.unlinkSync(videoPath);

    // Prepare the prompt for LLaVA
    const prompt = "Analyze this goalkeeper performance video. Identify and describe all saves and goals conceded. For each event, provide the timestamp and a detailed description of what happened.";
    
    // Process frames with LLaVA
    const analysis = await analyzeFrames(frames, prompt);

    // Extract saves and goals from the analysis
    const { saves, goals, summary } = extractEvents(analysis);

    // Return the analysis results
    return NextResponse.json({
      analysis,
      saves,
      goals,
      summary,
      title,
      description
    });

  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}

async function extractFrames(videoPath: string, numFrames: number): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    const frames: Buffer[] = [];
    const tempDir = os.tmpdir();
    const frameFiles: string[] = [];
    
    ffmpeg(videoPath)
      .on('end', async () => {
        try {
          // Read all frame files
          for (const file of frameFiles) {
            const frameBuffer = await fs.promises.readFile(file);
            frames.push(frameBuffer);
            // Clean up the frame file
            await fs.promises.unlink(file);
          }
          resolve(frames);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .screenshots({
        count: numFrames,
        folder: tempDir,
        filename: 'frame-%i.jpg',
        size: '320x240'
      })
      .on('filenames', (filenames) => {
        frameFiles.push(...filenames.map(f => path.join(tempDir, f)));
      });
  });
}

async function analyzeFrames(frames: Buffer[], prompt: string): Promise<string> {
  try {
    // Process each frame with LLaVA
    const results = await Promise.all(
      frames.map(async (frame) => {
        // Convert frame to base64
        const base64Frame = frame.toString('base64');
        
        const result = await hf.imageToText({
          data: frame,
          model: "llava-hf/llava-interleave-qwen-0.5b-hf",
          parameters: {
            prompt: prompt,
            max_new_tokens: 200
          }
        });
        return result;
      })
    );

    // Combine the results
    return results.join('\n\n');
  } catch (error) {
    console.error('Error analyzing frames:', error);
    throw error;
  }
}

function extractEvents(analysis: string): { saves: any[], goals: any[], summary: string } {
  const saves: any[] = [];
  const goals: any[] = [];
  
  // Regular expressions to match timestamps and descriptions
  const saveRegex = /Save at (\d{1,2}:\d{2}):\s*(.*?)(?=\n|$)/gi;
  const goalRegex = /Goal at (\d{1,2}:\d{2}):\s*(.*?)(?=\n|$)/gi;
  
  let match;
  
  // Extract saves
  while ((match = saveRegex.exec(analysis)) !== null) {
    saves.push({
      timestamp: match[1],
      description: match[2].trim()
    });
  }
  
  // Extract goals
  while ((match = goalRegex.exec(analysis)) !== null) {
    goals.push({
      timestamp: match[1],
      description: match[2].trim()
    });
  }
  
  // Generate summary
  const summary = `The goalkeeper made ${saves.length} saves and conceded ${goals.length} goals. ` +
    `The analysis provides detailed descriptions of each event, including positioning, technique, and outcome.`;
  
  return { saves, goals, summary };
} 