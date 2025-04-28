import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCourses } from './hooks/useCourses';
import Navbar from './components/Navbar';
import CategoryList from './components/CategoryList';
import CourseCard from './components/CourseCard';
import CourseDetails from './components/CourseDetails';
import ChatButton from './components/ChatButton';
import AuthScreen from './components/AuthScreen';
import AddCourseModal from './components/AddCourseModal';
import InstructorDashboard from './components/InstructorDashboard';
import CourseManagement from './components/CourseManagement';
import AdminDashboard from './components/AdminDashboard';
import StudentProfile from './components/StudentProfile';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Rocket, BookOpen, Users, TrendingUp } from 'lucide-react';

function App() {
  const { user, isAuthenticated, login, register, logout, updateCompletedLessons } = useAuth();
  const { 
    courses,
    coursesWithPurchaseStatus,
    courseEnrollments,
    addCourse,
    updateCourseContent,
    purchaseCourse,
    deleteCourse,
    addStudentManually,
    removeStudent,
    removeInstructor,
    getCourseEnrollments
  } = useCourses(user);

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showInstructorDashboard, setShowInstructorDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showCourseManagement, setShowCourseManagement] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const purchasedCourses = coursesWithPurchaseStatus.filter(course => course.isPurchased);
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const filteredCourses = coursesWithPurchaseStatus.filter(course => {
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesSearch = searchQuery.trim() === '' ? true : (
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const currentCourse = coursesWithPurchaseStatus.find(course => course.id === selectedCourse);

  const handleProfileClick = () => {
    if (user?.role === 'student') {
      setShowStudentProfile(true);
    } else if (user?.role === 'instructor') {
      setShowInstructorDashboard(true);
    } else if (user?.role === 'admin') {
      setShowAdminDashboard(true);
    }
  };

  const handleAdminBack = () => {
    setShowAdminDashboard(false);
    setSelectedCourse(null);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        mode={authMode} 
        setMode={setAuthMode} 
        onLogin={login} 
        onRegister={register} 
      />
    );
  }

  if (showStudentProfile && user?.role === 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={logout}
          onAddCourse={handleProfileClick}
        />
        <div className="flex-grow">
          <StudentProfile
            courses={purchasedCourses}
            completedLessons={user.completedLessons || {}}
            onBack={() => setShowStudentProfile(false)}
            onViewCourse={(courseId) => {
              setSelectedCourse(courseId);
              setShowStudentProfile(false);
            }}
          />
        </div>
        <Footer />
        <ChatButton />
      </div>
    );
  }

  if (showAdminDashboard && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={logout} 
          onAddCourse={() => setShowAddCourseModal(true)} 
        />
        <div className="flex-grow">
          <AdminDashboard 
            user={user}
            courses={courses}
            enrollments={courseEnrollments}
            users={users}
            onViewCourse={(courseId) => {
              setSelectedCourse(courseId);
              setShowAdminDashboard(false);
            }}
            onDeleteCourse={deleteCourse}
            onRemoveStudent={removeStudent}
            onRemoveInstructor={removeInstructor}
            onBack={handleAdminBack}
          />
        </div>
        {showAddCourseModal && (
          <AddCourseModal 
            onClose={() => setShowAddCourseModal(false)}
            onAddCourse={addCourse}
          />
        )}
        <Footer />
        <ChatButton />
      </div>
    );
  }

  if (showCourseManagement && currentCourse && (user?.role === 'instructor' || user?.role === 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={logout} 
          onAddCourse={() => setShowAddCourseModal(true)} 
        />
        <div className="flex-grow">
          <CourseManagement 
            course={currentCourse}
            onBack={() => {
              setShowCourseManagement(false);
              if (user?.role === 'admin') {
                setShowAdminDashboard(true);
              } else {
                setShowInstructorDashboard(true);
              }
            }}
            onUpdateCourse={updateCourseContent}
          />
        </div>
        <Footer />
        <ChatButton />
      </div>
    );
  }

  if (showInstructorDashboard && user?.role === 'instructor') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={logout} 
          onAddCourse={() => setShowAddCourseModal(true)} 
        />
        <div className="flex-grow">
          <InstructorDashboard 
            user={user}
            courses={courses}
            enrollments={courseEnrollments}
            onAddCourse={() => setShowAddCourseModal(true)}
            onViewCourse={(courseId) => {
              setSelectedCourse(courseId);
              setShowInstructorDashboard(false);
              
              const course = courses.find(c => c.id === courseId);
              if (course && course.instructorId === user.email) {
                setShowCourseManagement(true);
              }
            }}
            onRemoveStudent={removeStudent}
            onAddStudentManually={addStudentManually}
            onBack={() => setShowInstructorDashboard(false)}
          />
        </div>
        {showAddCourseModal && (
          <AddCourseModal 
            onClose={() => setShowAddCourseModal(false)}
            onAddCourse={addCourse}
          />
        )}
        <Footer />
        <ChatButton />
      </div>
    );
  }

  if (selectedCourse && currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          user={user} 
          onLogout={logout}
          onAddCourse={handleProfileClick}
        />
        <div className="flex-grow">
          <CourseDetails 
            course={currentCourse} 
            onBack={() => {
              setSelectedCourse(null);
              if (user?.role === 'admin') {
                setShowAdminDashboard(true);
              } else if (user?.role === 'instructor') {
                setShowInstructorDashboard(true);
              } else if (user?.role === 'student') {
                setShowStudentProfile(true);
              }
            }} 
            onPurchaseCourse={purchaseCourse}
            onManageCourse={
              (user?.role === 'instructor' && currentCourse.instructorId === user.email) || user?.role === 'admin'
                ? () => {
                    setShowCourseManagement(true);
                  }
                : undefined
            }
            enrollments={getCourseEnrollments(currentCourse.id)}
            onAddStudentManually={
              (user?.role === 'instructor' && currentCourse.instructorId === user.email) || user?.role === 'admin'
                ? addStudentManually
                : undefined
            }
            onRemoveStudent={
              (user?.role === 'instructor' && currentCourse.instructorId === user.email) || user?.role === 'admin'
                ? removeStudent
                : undefined
            }
            onCompletedLessonsChange={updateCompletedLessons}
            completedLessons={user?.completedLessons?.[currentCourse.id] || []}
          />
        </div>
        {showAddCourseModal && (
          <AddCourseModal 
            onClose={() => setShowAddCourseModal(false)}
            onAddCourse={addCourse}
          />
        )}
        <Footer />
        <ChatButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        user={user} 
        onLogout={logout}
        onAddCourse={handleProfileClick}
      />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the World of Cybersecurity</h1>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Discover a diverse range of specialized courses in cybersecurity
              </p>
            </motion.div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex items-center">
                  <div className="bg-primary-400/20 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">{courses.length}+</h3>
                    <p className="text-primary-100">Courses</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex items-center">
                  <div className="bg-primary-400/20 p-3 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">500+</h3>
                    <p className="text-primary-100">Students</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex items-center">
                  <div className="bg-primary-400/20 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">95%</h3>
                    <p className="text-primary-100">Satisfaction Rate</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 rounded-xl text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Categories</h2>
            <CategoryList 
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category === selectedCategory ? null : category);
              }}
            />
          </motion.section>

          {/* Featured Courses */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {selectedCategory ? `${selectedCategory} Courses` : 'Featured Courses'}
              </motion.h2>
              {selectedCategory && (
                <motion.button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-primary-600 hover:text-primary-800 transition flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  View All Courses
                </motion.button>
              )}
            </div>
            
            {filteredCourses.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      <CourseCard 
                        course={course} 
                        onClick={() => setSelectedCourse(course.id)}
                        enrollmentCount={getCourseEnrollments(course.id).length}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16 bg-gray-100 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery 
                    ? 'No courses match your search'
                    : selectedCategory 
                      ? 'No courses in this category yet'
                      : 'No courses available'
                  }
                </h3>
                <p className="text-gray-500">
                  Try searching with different keywords or browse other categories
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </div>
      
      {showAddCourseModal && (
        <AddCourseModal 
          onClose={() => setShowAddCourseModal(false)}
          onAddCourse={addCourse}
        />
      )}
      
      <Footer />
      <ChatButton />
    </div>
  );
}

export default App;