import { useState } from 'react';
import { Clock, User, BarChart, PlayCircle, Lock, Settings, Users, Mail, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { Course, CourseEnrollment } from '../types';
import CourseContent from './CourseContent';
import PaymentModal from './PaymentModal';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onPurchaseCourse: (courseId: string) => void;
  onManageCourse?: () => void;
  enrollments?: CourseEnrollment[];
  onAddStudentManually?: (courseId: string, email: string, name: string) => void;
  onRemoveStudent?: (courseId: string, userId: string) => void;
  onCompletedLessonsChange?: (courseId: string, lessonId: string) => void;
  completedLessons?: string[];
}

export default function CourseDetails({ 
  course, 
  onBack, 
  onPurchaseCourse, 
  onManageCourse,
  enrollments = [],
  onAddStudentManually,
  onRemoveStudent,
  onCompletedLessonsChange,
  completedLessons = []
}: CourseDetailsProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(course.content[0]?.videoUrl);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [addStudentError, setAddStudentError] = useState('');

  const handleStartCourse = () => {
    if (course.isPurchased || course.isFree) {
      setIsWatching(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = (courseId: string) => {
    onPurchaseCourse(courseId);
    setIsWatching(true);
  };

  const handleAddStudent = () => {
    if (!newStudentEmail || !newStudentName) {
      setAddStudentError("Please enter the student's email and name.");
      return;
    }

    if (!newStudentEmail.includes('@')) {
      setAddStudentError('Please enter a valid email address.');
      return;
    }

    if (onAddStudentManually) {
      onAddStudentManually(course.id, newStudentEmail, newStudentName);
      setNewStudentEmail('');
      setNewStudentName('');
      setAddStudentError('');
      setShowAddStudentForm(false);
    }
  };

  const handleCompletedLessonsChange = (lessonId: string) => {
    if (onCompletedLessonsChange) {
      onCompletedLessonsChange(course.id, lessonId);
    }
  };

  if (isWatching && (course.isPurchased || course.isFree)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setIsWatching(false)}
          className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
        >
          Back to course details
          <ArrowLeft className="ml-2" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={currentVideo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <CourseContent 
              content={course.content} 
              onSelectVideo={setCurrentVideo}
              completedLessons={completedLessons}
              onCompletedLessonsChange={handleCompletedLessonsChange}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
      >
        Back to main menu
        <ArrowLeft className="ml-2" />   
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-72 object-cover"
        />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center">
              <span className="bg-primary-100 text-primary-800 px-4 py-1 rounded-full text-sm ml-2">
                {course.category}
              </span>
              <span className={`px-4 py-1 rounded-full text-lg font-bold ${
                course.isFree 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-primary-600 text-white'
              }`}>
                {course.isFree ? 'free' : `$${course.price}`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 space-x-reverse mb-6 text-gray-600">
            <div className="flex items-center">
              <User size={20} className="ml-2" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Clock size={20} className="ml-2" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <BarChart size={20} className="ml-2" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center">
              <Users size={20} className="ml-2 text-green-600" />
              <span className="text-green-600">{enrollments.length} student</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-bold mb-4">Course Description</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>

          {onManageCourse && enrollments.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Registered students</h2>
                {onAddStudentManually && (
                  <button
                    onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                    className="flex items-center text-primary-600 hover:text-primary-700 transition"
                  >
                    <PlusCircle className="h-4 w-4 ml-1" />
                    Add a student manually
                  </button>
                )}
              </div>
              
              {showAddStudentForm && (
                <div className="bg-primary-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-primary-800 mb-3">إضافة طالب جديد</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                      Student's name
                      </label>
                      <input
                        type="text"
                        id="studentName"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter student name"
                      />
                    </div>
                    <div>
                      <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      e-mail
                      </label>
                      <input
                        type="email"
                        id="studentEmail"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                  {addStudentError && (
                    <p className="text-red-600 text-sm mb-3">{addStudentError}</p>
                  )}
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        setShowAddStudentForm(false);
                        setNewStudentEmail('');
                        setNewStudentName('');
                        setAddStudentError('');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      cancellation
                    </button>
                    <button
                      onClick={handleAddStudent}
                      className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                    >
                      Add student
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">اسم الطالب</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">البريد الإلكتروني</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">تاريخ التسجيل</th>
                        {onRemoveStudent && (
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {enrollments.map((enrollment, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-900">{enrollment.userName}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 ml-1 text-gray-400" />
                              {enrollment.userId}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(enrollment.enrollmentDate).toLocaleDateString('ar-EG')}
                          </td>
                          {onRemoveStudent && (
                            <td className="px-4 py-3 text-sm text-center">
                              <button
                                onClick={() => onRemoveStudent(course.id, enrollment.userId)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Remove student"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleStartCourse}
                className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center transition ${
                  course.isPurchased || course.isFree
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600'
                }`}
              >
                {course.isPurchased || course.isFree ? (
                  <>
                    <PlayCircle className="ml-2" />
                    Start the course now
                  </>
                ) : (
                  <>
                    <Lock className="ml-2" />
                    Buy the course now
                  </>
                )}
              </button>
              
              {onManageCourse && (
                <button 
                  onClick={onManageCourse}
                  className="py-3 px-6 rounded-lg flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  <Settings className="ml-2" />
                  Course management
                </button>
              )}
            </div>
            
            {!course.isPurchased && !course.isFree && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Purchase this course to access all content and learning materials.
              </p>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && !course.isFree && (
        <PaymentModal 
          course={course}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}