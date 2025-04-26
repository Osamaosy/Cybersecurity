import { motion } from 'framer-motion';
import { categories } from '../data';
import * as Icons from 'lucide-react';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export default function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
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
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons];
        const isSelected = category.name === selectedCategory;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300 transform ${
              isSelected 
                ? 'bg-primary-100 border-2 border-primary-500 shadow-lg scale-105' 
                : 'bg-white shadow-md hover:shadow-lg hover:scale-105'
            }`}
            variants={itemVariants}
            whileHover={{ scale: isSelected ? 1.05 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {IconComponent && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isSelected ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                  className={`h-8 w-8 mb-3 ${
                    isSelected ? 'text-primary-700' : 'text-primary-600'
                  }`} 
              </motion.div>
            )}
            <span className={`text-sm font-medium ${
              isSelected ? 'text-primary-800' : 'text-gray-700'
            }`}>
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}