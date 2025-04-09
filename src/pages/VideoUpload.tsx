
import { useState, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileVideo, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataStore } from "@/lib/data-store";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoStats, setVideoStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userSettings } = useDataStore();

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
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      // Convert video file to base64
      const base64 = await fileToBase64(file);
      
      // API URL
      const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY";

      // Prepare the payload
      const payload = {
        contents: [{
          parts: [{
            inlineData: {
              mimeType: file.type,
              data: base64.split(",")[1] // Remove the "data:video/mp4;base64," part
            }
          }]
        }]
      };
      
      // Send the request to the Gemini API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Simulating a structured response for displaying stats
      // In a real implementation, you would parse the actual API response format
      const processedStats = {
        analysis: data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available",
        plays: [{
          type: "Save",
          confidence: 0.92,
          timestamp: "00:15"
        }, {
          type: "Goal conceded",
          confidence: 0.89,
          timestamp: "01:23"
        }]
      };
      
      setVideoStats(processedStats);
      setUploadProgress(100);
      
      toast({
        title: "Upload complete",
        description: "Video analysis has been completed."
      });
      
      // Reset progress after showing 100% briefly
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
                      <span>Uploading and analyzing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : (
                  <Button 
                    onClick={uploadVideo}
                    disabled={!file}
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
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold">Analysis Results</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{videoStats.analysis}</p>
                  </CardContent>
                </Card>
                
                {videoStats.plays && videoStats.plays.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Moments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {videoStats.plays.map((play: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                              <p className="font-medium">{play.type}</p>
                              <p className="text-sm text-muted-foreground">
                                Time: {play.timestamp}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                Confidence: {(play.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
