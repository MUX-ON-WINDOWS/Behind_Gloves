
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VideoAnalysis } from '@/types/store-types';
import { fetchVideoAnalyses, addVideoAnalysis as addVideo, deleteVideoAnalysis as deleteVideo } from '@/services/database';

export const useVideoAnalysisState = () => {
  const [videoAnalyses, setVideoAnalyses] = useState<VideoAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load video analyses from Supabase on component mount
  useEffect(() => {
    const loadVideoAnalyses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const videos = await fetchVideoAnalyses();
        setVideoAnalyses(videos);
      } catch (err) {
        console.error("Failed to load video analyses:", err);
        setError("Failed to load video analyses");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not load video analyses from database",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideoAnalyses();
  }, [toast]);

  const addVideoAnalysis = async (video: Omit<VideoAnalysis, "id">) => {
    try {
      const newId = await addVideo(video);
      if (newId) {
        toast({
          title: "Video analysis added",
          description: "Your video analysis has been saved",
        });
        // Refresh the videos list from the database to ensure consistency
        const updatedVideos = await fetchVideoAnalyses();
        setVideoAnalyses(updatedVideos);
      }
    } catch (err) {
      console.error("Failed to add video analysis:", err);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save video analysis to database",
      });
    }
  };

  const deleteVideoAnalysis = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideoAnalyses(prev => prev.filter(video => video.id !== id));
      toast({
        title: "Video deleted",
        description: "Video analysis has been removed",
      });
    } catch (err) {
      console.error("Failed to delete video analysis:", err);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to remove video analysis from database",
      });
    }
  };

  return {
    videoAnalyses,
    setVideoAnalyses,
    addVideoAnalysis,
    deleteVideoAnalysis,
    isLoading,
    error
  };
};
