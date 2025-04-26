import { motion } from 'framer-motion';
import { Clock, User, BarChart, Users } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  enrollmentCount?: number;
}

export default function CourseCard({ course, onClick, enrollmentCount = 0 }: CourseCardProps) {
  return (
    <div 
      className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
            {course.title}
          </h3>
          <motion.span 
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              course.isPurchased 
                ? 'bg-green-100 text-green-800'
                : course.isFree
                ? 'bg-blue-100 text-blue-800'
                : 'bg-primary-100 text-primary-800'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {course.isPurchased 
              ? 'Purchased' 
              : course.isFree
              ? 'Free'
              : `$${course.price}`}
          </motion.span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <User size={16} className="ml-1" />
            {course.instructor}
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Clock size={16} className="ml-1" />
            {course.duration}
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <BarChart size={16} className="ml-1" />
            {course.level}
          </motion.div>
        </div>
        
        {enrollmentCount > 0 && (
          <motion.div 
            className="mt-3 pt-3 border-t border-gray-100 flex items-center text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users size={16} className="ml-1 text-green-600" />
            <span className="text-green-600 font-medium">{enrollmentCount}</span>
            <span className="mr-1 text-gray-500">Enrolled Student</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
