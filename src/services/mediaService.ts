import { httpBase } from '../utils/httpBase';
import { JOBS } from '../constants/apiEndpoints';
import { Dispatch } from 'react';
import { Action } from '../types/dispatcherTypes';

interface PresignedUrlResponse {
  presigned_url: string;
}

export const mediaService = {
  // Get presigned URL for a media object
  getPresignedUrl: (
    objectName: string,
    expiry: number = 3600,
    dispatch?: Dispatch<Action>
  ): Promise<PresignedUrlResponse> => {
    return httpBase.get(
      JOBS.MEDIA_PRESIGNED_URL,
      {
        params: {
          object_name: objectName,
          expiry
        }
      },
      dispatch
    );
  }
};


// Helper function to check if a string is an image URL
export const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lowerCaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};

// Helper function to check if a string is a video URL
export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv'];
  const lowerCaseUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};

// Helper function to check if a string is an audio URL
export const isAudioUrl = (url: string): boolean => {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac'];
  const lowerCaseUrl = url.toLowerCase();
  return audioExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};
