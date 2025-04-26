/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { X, Video, Clock, FileText } from 'lucide-react';
import { CourseContent } from '../types';

interface AddLessonModalProps {
  onClose: () => void;
  onAddLesson: (lesson: CourseContent) => void;
  courseId: string;
  existingLessons: CourseContent[];
}

export default function AddLessonModal({ onClose, onAddLesson, courseId, existingLessons }: AddLessonModalProps) {
  const [lesson, setLesson] = useState<Omit<CourseContent, 'id'>>({
    title: '',
    duration: '45 minutes',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidationMessage, setUrlValidationMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
    
    // Clear validation message when URL changes
    if (name === 'videoUrl') {
      setUrlValidationMessage('');
    }
  };

  // Validate YouTube embed URL
  const validateYouTubeEmbedUrl = (url: string): boolean => {
    // Check if it's a YouTube embed URL
    const youtubeEmbedRegex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(?:\?.*)?$/;
    return youtubeEmbedRegex.test(url);
  };

  // Check if URL is accessible
  const checkUrlAccessibility = async (url: string) => {
    setIsValidatingUrl(true);
    setUrlValidationMessage('Validating URL...');
    
    try {
      // In a real implementation, you would use a server-side function to check if the URL is accessible
      // For this demo, we'll simulate a check with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll consider all YouTube embed URLs as valid
      // In a real implementation, you would check if the video exists
      if (validateYouTubeEmbedUrl(url)) {
        setUrlValidationMessage('✓ URL validated successfully');
        setErrors(prev => ({ ...prev, videoUrl: '' }));
        return true;
      } else {
        setUrlValidationMessage('✗ Invalid URL. It must be a YouTube Embed URL');
        setErrors(prev => ({ ...prev, videoUrl: 'Please enter a valid YouTube Embed video URL' }));
        return false;
      }
    } catch (error) {
      setUrlValidationMessage('✗ An error occurred while validating the URL');
      setErrors(prev => ({ ...prev, videoUrl: 'An error occurred while validating the URL' }));
      return false;
    } finally {
      setIsValidatingUrl(false);
    }
  };

  // Validate URL when it changes and after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (lesson.videoUrl && lesson.videoUrl !== 'https://www.youtube.com/embed/dQw4w9WgXcQ') {
        checkUrlAccessibility(lesson.videoUrl);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [lesson.videoUrl]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!lesson.title.trim()) {
      newErrors.title = 'Please enter the lesson title';
    }
    
    if (!lesson.description.trim()) {
      newErrors.description = 'Please enter the lesson description';
    }
    
    if (!lesson.duration.trim()) {
      newErrors.duration = 'Please enter the lesson duration';
    }
    
    if (!lesson.videoUrl.trim()) {
      newErrors.videoUrl = 'Please enter the video URL';
    } else if (!validateYouTubeEmbedUrl(lesson.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid YouTube video URL (must contain /embed/)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First validate the form
    if (!validateForm()) {
      return;
    }
    
    // Then validate the URL
    setIsSubmitting(true);
    const isUrlValid = await checkUrlAccessibility(lesson.videoUrl);
    
    if (isUrlValid) {
      // Generate a unique ID for the new lesson
      const lessonId = `${courseId}-${existingLessons.length + 1}`;
      
      // Add a small delay to simulate processing
      setTimeout(() => {
        onAddLesson({
          id: lessonId,
          ...lesson
        });
        setIsSubmitting(false);
        onClose();
      }, 500);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Add New Lesson</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-primary-100 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={lesson.title}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter lesson title"
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={lesson.description}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter lesson description"
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Duration
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={lesson.duration}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Example: 45 minutes"
                  />
                </div>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Video className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="videoUrl"
                    name="videoUrl"
                    type="text"
                    value={lesson.videoUrl}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                {errors.videoUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>
                )}
                {urlValidationMessage && (
                  <p className={`mt-1 text-xs ${urlValidationMessage.startsWith('✓') ? 'text-green-600' : urlValidationMessage.startsWith('✗') ? 'text-red-600' : 'text-gray-500'}`}>
                    {isValidatingUrl && (
                      <span className="inline-block h-3 w-3 mr-1 rounded-full border-2 border-t-primary-600 border-primary-200 animate-spin"></span>
                    )}
                    {urlValidationMessage}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  The video URL must be in YouTube Embed format (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)
                </p>
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">How to get the Embed URL:</p>
                  <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                    <li>Open the YouTube video</li>
                    <li>Click on "Share" then "Embed"</li>
                    <li>Copy the URL from the code (src="...")</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isValidatingUrl}
                className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Add Lesson'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
