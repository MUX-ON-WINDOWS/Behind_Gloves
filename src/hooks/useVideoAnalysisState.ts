
import { useState, useEffect } from 'react';
import { VideoAnalysis } from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';

export const useVideoAnalysisState = () => {
  const [videoAnalyses, setVideoAnalyses] = useState<VideoAnalysis[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEO_ANALYSES);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIDEO_ANALYSES, JSON.stringify(videoAnalyses));
  }, [videoAnalyses]);

  const addVideoAnalysis = (video: Omit<VideoAnalysis, "id">) => {
    const newVideo: VideoAnalysis = {
      ...video,
      id: `video-${Date.now()}`
    };
    setVideoAnalyses(prev => [...prev, newVideo]);
  };

  const deleteVideoAnalysis = (id: string) => {
    setVideoAnalyses(prev => prev.filter(video => video.id !== id));
  };

  return {
    videoAnalyses,
    setVideoAnalyses,
    addVideoAnalysis,
    deleteVideoAnalysis
  };
};
