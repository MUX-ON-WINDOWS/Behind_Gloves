import { useState, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileVideo, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataStore } from "@/lib/data-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoStats, setVideoStats] = useState<{
    analysis: string;
    saves: { timestamp: string; description: string }[];
    goals: { timestamp: string; description: string }[];
    summary: string;
    title?: string;
    description?: string;
    videoUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addVideoAnalysis } = useDataStore();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if file is a video
      if (!droppedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
    }
  }, [toast]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a video
      if (!selectedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const uploadVideo = async () => {
    if (!file) return;
    
    if (!videoTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your video analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      
      // Upload video to backend
      const uploadResponse = await fetch('http://localhost:3001/api/videos/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video');
      }
      
      const { videoId } = await uploadResponse.json();

      console.log("Video ID: " + videoId);
      
      // Poll for analysis results
      const pollInterval = setInterval(async () => {
        const resultsResponse = await fetch(`http://localhost:3001/api/videos/results/${videoId}`);
        
        if (resultsResponse.ok) {
          const results = await resultsResponse.json();
          
          if (results.status === 'completed' && results.data) {
            clearInterval(pollInterval);
            
            const processedStats = {
              analysis: "Video analysis complete",
              saves: results.data.saves,
              goals: results.data.goals,
              events: results.data.events,
              summary: `Found ${results.data.saves} saves and ${results.data.goals} goals`,
              title: videoTitle,
              description: videoDescription,
              videoUrl: `http://localhost:3001/uploads/${videoId}.mp4`
            };
            
            setVideoStats(processedStats);
            setUploadProgress(100);
            
            // Send the data to the data store for the Data Overview page
            addVideoAnalysis({
              date: new Date().toISOString(),
              title: videoTitle,
              description: videoDescription,
              saves: results.data.saves,
              goals: results.data.goals,
              videoStats: processedStats
            });
            
            toast({
              title: "Analysis complete",
              description: `Found ${results.data.saves} saves and ${results.data.goals} goals.`
            });
            
            console.log(results.data + " - " + results.data.events);

            // Reset progress after showing 100% briefly
            setTimeout(() => {
              setIsUploading(false);
            }, 1000);
          } else if (results.status === 'processing') {
            setUploadProgress(prev => Math.min(prev + 5, 95));
          }
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setVideoStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="container max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Video Analysis</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload Match Video</CardTitle>
            <CardDescription>
              Upload a video of your match performance for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="space-y-4 mb-4">
              <div>
                <Label htmlFor="video-title">Video Title</Label>
                <Input 
                  id="video-title" 
                  placeholder="Enter a descriptive title for this video"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="video-description">Description (Optional)</Label>
                <Textarea 
                  id="video-description" 
                  placeholder="Add details about this match or what you want to analyze"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={openFileDialog}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mt-2">
                    Drag & drop your video or click to browse
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a video file to analyze your goalkeeper performance
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-md">
                  <FileVideo className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={removeFile}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing video...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : (
                  <Button 
                    onClick={uploadVideo}
                    disabled={!file || !videoTitle.trim()}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Analyze Video
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
            
            {videoStats && (
              <div className="mt-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{videoStats.title || "Performance Summary"}</CardTitle>
                    {videoStats.description && (
                      <CardDescription>{videoStats.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-center bg-muted/30 p-4 rounded-md">
                      <p className="text-lg font-medium">{videoStats.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-green-500/10 p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-10 w-10 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Saves</p>
                            <p className="text-2xl font-bold">{videoStats.saves.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-500/10 p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="h-10 w-10 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Goals Conceded</p>
                            <p className="text-2xl font-bold">{videoStats.goals.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {videoStats.saves.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Save Analysis</CardTitle>
                      <CardDescription>
                        Detailed breakdown of all saves made during the match
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {videoStats.saves.map((save, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-green-500/5 border border-green-500/20 rounded-md">
                            <div className="bg-green-500/10 text-green-500 font-mono px-3 py-1 rounded-md min-w-[60px] text-center">
                              {save.timestamp}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Save {index + 1}</p>
                              <p className="text-sm text-muted-foreground">{save.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {videoStats.goals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Goals Conceded</CardTitle>
                      <CardDescription>
                        Analysis of goals conceded during the match
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {videoStats.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-red-500/5 border border-red-500/20 rounded-md">
                            <div className="bg-red-500/10 text-red-500 font-mono px-3 py-1 rounded-md min-w-[60px] text-center">
                              {goal.timestamp}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Goal {index + 1}</p>
                              <p className="text-sm text-muted-foreground">{goal.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Full Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md text-sm">
                      {videoStats.analysis}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
