import { useState } from 'react';
import { BookOpen, PlusCircle, Users, Edit, Search, Mail, Trash2, ArrowLeft } from 'lucide-react';
import { Course, UserType, CourseEnrollment } from '../types';

interface InstructorDashboardProps {
  user: UserType;
  courses: Course[];
  enrollments: CourseEnrollment[];
  onAddCourse: () => void;
  onViewCourse: (courseId: string) => void;
  onRemoveStudent: (courseId: string, userId: string) => void;
  onAddStudentManually: (courseId: string, email: string, name: string) => void;
  onBack: () => void;
}

export default function InstructorDashboard({
  user,
  courses,
  enrollments,
  onAddCourse,
  onViewCourse,
  onRemoveStudent,
  onAddStudentManually,
  onBack
}: InstructorDashboardProps) {
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<string | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [addStudentError, setAddStudentError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses for the current instructor
  const instructorCourses = courses.filter(course => course.instructorId === user.email);

  // Retrieve student enrollments for a specific course
  const getCourseEnrollments = (courseId: string) => {
    return enrollments.filter(enrollment => enrollment.courseId === courseId);
  };

  // Calculate the number of students enrolled in a specific course
  const getCourseEnrollmentCount = (courseId: string) => {
    return getCourseEnrollments(courseId).length;
  };

  // Function to add a student manually
  const handleAddStudent = () => {
    if (!newStudentEmail || !newStudentName) {
      setAddStudentError('Please enter both email and student name');
      return;
    }

    if (!newStudentEmail.includes('@')) {
      setAddStudentError('Please enter a valid email');
      return;
    }

    if (selectedCourseForStudents) {
      onAddStudentManually(selectedCourseForStudents, newStudentEmail, newStudentName);
      setNewStudentEmail('');
      setNewStudentName('');
      setAddStudentError('');
      setShowAddStudentForm(false);
    }
  };

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

  // Retrieve details of the selected course
  const selectedCourse = selectedCourseForStudents
    ? courses.find(course => course.id === selectedCourseForStudents)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary-600 mb-6 hover:text-primary-700 transition"
      >
        Back to Main Menu
        <ArrowLeft className="ml-2" />
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Instructor Dashboard</h1>
      
      {/* Student Management Section */}
      {selectedCourseForStudents && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Students</h2>
              <p className="text-gray-600">
                {selectedCourse?.title} - {getCourseEnrollmentCount(selectedCourseForStudents)} Students
              </p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => setSelectedCourseForStudents(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Back to Courses
              </button>
              <button
                onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                <PlusCircle className="h-4 w-4 ml-2" />
                Add Student
              </button>
            </div>
          </div>
          
          {/* Add Student Form */}
          {showAddStudentForm && (
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-primary-800 mb-3">Add New Student</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
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
                    Email
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
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                >
                  Add Student
                </button>
              </div>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="relative max-w-md mb-4">
            <input
              type="text"
              placeholder="Search for a student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Student Table */}
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
                          onClick={() => onRemoveStudent(selectedCourseForStudents!, enrollment.userId)}
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
      
      {/* Courses Section */}
      {!selectedCourseForStudents && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
            <button
              onClick={onAddCourse}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Add New Course
              <PlusCircle className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          {instructorCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lessons
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructorCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-md object-cover" src={course.image} alt={course.title} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.level}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.content.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                          onClick={() => onViewCourse(course.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Edit className="h-4 w-4 ml-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Start by adding your first course</p>
              <button
                onClick={onAddCourse}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add New Course
                <PlusCircle className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
