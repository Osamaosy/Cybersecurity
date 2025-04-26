import { useState } from 'react';
import { BookOpen, Users, Edit, Search, Mail, Trash2, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { Course, UserType, CourseEnrollment } from '../types';

interface AdminDashboardProps {
  user: UserType;
  courses: Course[];
  enrollments: CourseEnrollment[];
  users: UserType[];
  onViewCourse: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onRemoveStudent: (courseId: string, userId: string) => void;
  onRemoveInstructor: (instructorId: string) => void;
  onBack: () => void;
}

export default function AdminDashboard({
  courses,
  enrollments,
  users,
  onViewCourse,
  onDeleteCourse,
  onRemoveStudent,
  onRemoveInstructor,
  onBack
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'instructors' | 'students'>('courses');
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get enrollments for a specific course
  const getCourseEnrollments = (courseId: string) => {
    return enrollments.filter(enrollment => enrollment.courseId === courseId);
  };

  // Get enrollment count for a course
  const getCourseEnrollmentCount = (courseId: string) => {
    return getCourseEnrollments(courseId).length;
  };

  // Get all instructors
  const instructors = users.filter(u => u.role === 'instructor');

  // Get all students
  const students = users.filter(u => u.role === 'student');

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower)
    );
  });

  // Filter instructors based on search query
  const filteredInstructors = instructors.filter(instructor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      instructor.name.toLowerCase().includes(searchLower) ||
      instructor.email.toLowerCase().includes(searchLower)
    );
  });

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });

  // Filter enrollments based on search query
  const filteredEnrollments = selectedCourseForStudents
    ? getCourseEnrollments(selectedCourseForStudents).filter(enrollment => {
        const searchLower = searchQuery.toLowerCase();
        return (
          enrollment.userName.toLowerCase().includes(searchLower) ||
          enrollment.userId.toLowerCase().includes(searchLower)
        );
      })
    : [];

  // Get selected course details
  const selectedCourse = selectedCourseForStudents
    ? courses.find(course => course.id === selectedCourseForStudents)
    : null;

  // Get course count for an instructor
  const getInstructorCourseCount = (instructorId: string) => {
    return courses.filter(course => course.instructorId === instructorId).length;
  };

  // Get enrollment count for a student
  const getStudentEnrollmentCount = (studentId: string) => {
    return enrollments.filter(enrollment => enrollment.userId === studentId).length;
  };

  // Handle course deletion with confirmation
  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      onDeleteCourse(courseId);
    }
  };

  // Handle instructor removal with confirmation
  const handleRemoveInstructor = (instructorId: string) => {
    if (confirm('Are you sure you want to remove this instructor? All associated courses will be deleted.')) {
      onRemoveInstructor(instructorId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
      >
        <ArrowRight className="ml-2" />
        Back to Main Menu
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center">
          <span>Admin Mode</span>
          <Shield className="h-5 w-5 ml-2" />
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <h2 className="text-3xl font-bold text-gray-900">{courses.length}</h2>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Instructors</p>
              <h2 className="text-3xl font-bold text-gray-900">{instructors.length}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <h2 className="text-3xl font-bold text-gray-900">{students.length}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      {!selectedCourseForStudents && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab('courses');
                  setSearchQuery('');
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => {
                  setActiveTab('instructors');
                  setSearchQuery('');
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'instructors'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Instructors
              </button>
              <button
                onClick={() => {
                  setActiveTab('students');
                  setSearchQuery('');
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Students Management Section */}
      {selectedCourseForStudents && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Students</h2>
              <p className="text-gray-600">
                {selectedCourse?.title} - {getCourseEnrollmentCount(selectedCourseForStudents)} student(s)
              </p>
            </div>
            <button
              onClick={() => setSelectedCourseForStudents(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md mb-4">
            <input
              type="text"
              placeholder="Search for a student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 ml-1 text-gray-400" />
                          {enrollment.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onRemoveStudent(selectedCourseForStudents, enrollment.userId)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Remove Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      {searchQuery ? 'No matching search results' : 'No students enrolled in this course'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Courses Tab */}
      {!selectedCourseForStudents && activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search for a course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center ">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-md object-cover" src={course.image} alt={course.title} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${course.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium text-green-600 ml-1">
                            {getCourseEnrollmentCount(course.id)}
                          </span>
                          <button
                            onClick={() => setSelectedCourseForStudents(course.id)}
                            className="text-primary-600 hover:text-primary-800 transition"
                            title="View Students"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => onViewCourse(course.id)}
                            className="text-primary-600 hover:text-primary-900 flex items-center"
                            title="View Course"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete Course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-500">
                {searchQuery ? 'No matching search results' : 'No courses have been added yet'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Instructors Tab */}
      {!selectedCourseForStudents && activeTab === 'instructors' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Instructors</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search for an instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {filteredInstructors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Count
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstructors.map((instructor) => (
                    <tr key={instructor.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 ml-1 text-gray-400" />
                          {instructor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getInstructorCourseCount(instructor.email)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                          onClick={() => handleRemoveInstructor(instructor.email)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Remove Instructor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Instructors Available</h3>
              <p className="text-gray-500">
                {searchQuery ? 'No matching search results' : 'No instructors registered yet'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Students Tab */}
      {!selectedCourseForStudents && activeTab === 'students' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Students</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search for a student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled Courses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 ml-1 text-gray-400" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStudentEnrollmentCount(student.email)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Available</h3>
              <p className="text-gray-500">
                {searchQuery ? 'No matching search results' : 'No students registered yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
