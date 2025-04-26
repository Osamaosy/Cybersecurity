import { useState } from 'react';
import { ArrowLeft, PlusCircle, Trash2, Video } from 'lucide-react';
import { Course, CourseContent } from '../types';
import AddLessonModal from './AddLessonModal';

interface CourseManagementProps {
  course: Course;
  onBack: () => void;
  onUpdateCourse: (courseId: string, updatedContent: CourseContent[]) => void;
}

export default function CourseManagement({ course, onBack, onUpdateCourse }: CourseManagementProps) {
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessons, setLessons] = useState<CourseContent[]>(course.content);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(
    course.content.length > 0 ? course.content[0].id : null
  );
  const [currentVideo, setCurrentVideo] = useState<string>(
    course.content.length > 0 ? course.content[0].videoUrl : ''
  );

  const handleAddLesson = (newLesson: CourseContent) => {
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    onUpdateCourse(course.id, updatedLessons);
    
    // Select the newly added lesson
    setSelectedLesson(newLesson.id);
    setCurrentVideo(newLesson.videoUrl);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (lessons.length <= 1) {
      alert('Not all lessons can be deleted. A course must contain at least one lesson.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
      setLessons(updatedLessons);
      onUpdateCourse(course.id, updatedLessons);
      
      // If the deleted lesson was selected, select the first lesson
      if (selectedLesson === lessonId) {
        const firstLesson = updatedLessons[0];
        if (firstLesson) {
          setSelectedLesson(firstLesson.id);
          setCurrentVideo(firstLesson.videoUrl);
        } else {
          setSelectedLesson(null);
          setCurrentVideo('');
        }
      }
    }
  };

  const handleLessonSelect = (lessonId: string, videoUrl: string) => {
    setSelectedLesson(lessonId);
    setCurrentVideo(videoUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
      >
        Back to Control Panel
        <ArrowLeft className="ml-2" />
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Management: {course.title}</h1>
          <button
            onClick={() => setShowAddLessonModal(true)}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Add a new lesson
            <PlusCircle className="h-4 w-4 ml-2" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {currentVideo ? (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={currentVideo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>No specific video</p>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                {selectedLesson && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {lessons.find(l => l.id === selectedLesson)?.title}
                    </h2>
                    <p className="text-gray-600">
                      {lessons.find(l => l.id === selectedLesson)?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Course lessons</h3>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-lg transition ${
                        selectedLesson === lesson.id
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer flex-1"
                          onClick={() => handleLessonSelect(lesson.id, lesson.videoUrl)}
                        >
                          <Video size={16} className="mr-2 text-primary-600" />
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 ml-4">{lesson.duration}</span>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-red-500 hover:text-red-700 transition ml-2"
                            title="Delete the lesson"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddLessonModal && (
        <AddLessonModal
          onClose={() => setShowAddLessonModal(false)}
          onAddLesson={handleAddLesson}
          courseId={course.id}
          existingLessons={lessons}
        />
      )}
    </div>
  );
}