
import { useState, useEffect } from 'react';
import { VideoAnalysis } from '@/types/store-types';
import { fetchVideoAnalyses, addVideoAnalysis as addVideo, deleteVideoAnalysis as deleteVideo } from '@/services/database';

export const useVideoAnalysisState = () => {
  const [videoAnalyses, setVideoAnalyses] = useState<VideoAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load video analyses from Supabase on component mount
  useEffect(() => {
    const loadVideoAnalyses = async () => {
      setIsLoading(true);
      const videos = await fetchVideoAnalyses();
      setVideoAnalyses(videos);
      setIsLoading(false);
    };
    
    loadVideoAnalyses();
  }, []);

  const addVideoAnalysis = async (video: Omit<VideoAnalysis, "id">) => {
    const newId = await addVideo(video);
    if (newId) {
      // Refresh the videos list from the database to ensure consistency
      const updatedVideos = await fetchVideoAnalyses();
      setVideoAnalyses(updatedVideos);
    }
  };

  const deleteVideoAnalysis = async (id: string) => {
    await deleteVideo(id);
    setVideoAnalyses(prev => prev.filter(video => video.id !== id));
  };

  return {
    videoAnalyses,
    setVideoAnalyses,
    addVideoAnalysis,
    deleteVideoAnalysis,
    isLoading
  };
};
