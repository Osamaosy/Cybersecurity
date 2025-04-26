import React, { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { CourseContent as CourseContentType } from '../types';

interface CourseContentProps {
  content: CourseContentType[];
  onSelectVideo: (videoUrl: string) => void;
  completedLessons?: string[];
  onCompletedLessonsChange?: (lessonId: string) => void;
}

export default function CourseContent({ 
  content, 
  onSelectVideo, 
  completedLessons = [],
  onCompletedLessonsChange 
}: CourseContentProps) {
  const [activeVideo, setActiveVideo] = useState(content[0]?.id);

  const handleVideoSelect = (videoId: string, videoUrl: string) => {
    setActiveVideo(videoId);
    onSelectVideo(videoUrl);
  };

  const toggleVideoComplete = (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onCompletedLessonsChange) {
      onCompletedLessonsChange(videoId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Course Content</h3>
        <div className="space-y-2">
          {content.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoSelect(video.id, video.videoUrl)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                activeVideo === video.id
                  ? 'bg-primary-50 border border-primary-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Play size={16} className="mr-2 text-primary-600" />
                  <span className="font-medium">{video.title}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 ml-4">{video.duration}</span>
                  <button
                    onClick={(e) => toggleVideoComplete(video.id, e)}
                    className={`${
                      completedLessons.includes(video.id)
                        ? 'text-green-500'
                        : 'text-gray-300 hover:text-gray-400'
                    } transition`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{video.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
