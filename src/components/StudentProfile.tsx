import { BookOpen, Clock, BarChart, CheckCircle, PlayCircle, ArrowLeft } from 'lucide-react';
import { Course, CourseContent } from '../types';
import { motion } from 'framer-motion';

interface StudentProfileProps {
  courses: Course[];
  completedLessons: Record<string, string[]>;
  onBack: () => void;
  onViewCourse: (courseId: string) => void;
}

export default function StudentProfile({ courses, completedLessons, onBack, onViewCourse }: StudentProfileProps) {
  const calculateProgress = (courseId: string, content: CourseContent[]) => {
    const completed = completedLessons[courseId]?.length || 0;
    const total = content.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
      >
        Back to main menu
        <ArrowLeft className="ml-2" />
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My educational courses</h1>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <Clock className="h-4 w-4 ml-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 ml-1" />
                      {course.content.length} Lessons
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BarChart className="h-4 w-4 ml-1" />
                      {course.level}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Level of progress</span>
                      <span className="text-sm font-medium text-primary-600">
                        {calculateProgress(course.id, course.content)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(course.id, course.content)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {course.content.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          {completedLessons[course.id]?.includes(lesson.id) ? (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-400 ml-2" />
                          )}
                          <span className={completedLessons[course.id]?.includes(lesson.id) ? 'text-gray-600' : 'text-gray-500'}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-gray-400">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onViewCourse(course.id)}
                    className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
                  >
                    <PlayCircle className="h-4 w-4 ml-2" />
                    Continue learning
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">There are no courses to subscribe to. </h3>
            <p className="text-gray-500">
            You haven't purchased a course yet. Browse the available courses and start your learning journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}