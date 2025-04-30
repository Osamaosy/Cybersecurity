import React, { useState } from 'react';
import { X, BookOpen, Clock, BarChart, DollarSign, Image, FileText, Link, Plus, Trash2 } from 'lucide-react';
import { NewCourse, Attachment } from '../types';
import { categories } from '../data';

interface AddCourseModalProps {
  onClose: () => void;
  onAddCourse: (course: NewCourse) => void;
}

export default function AddCourseModal({ onClose, onAddCourse }: AddCourseModalProps) {
  const [course, setCourse] = useState<NewCourse>({
    title: '',
    description: '',
    category: categories[0].name,
    level: 'Beginner',
    price: 49.99,
    isFree: false,
    duration: '8 hours',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    attachments: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [newAttachment, setNewAttachment] = useState<Omit<Attachment, 'id'>>({
    title: '',
    url: '',
    type: 'document'  
  });
  const [attachmentError, setAttachmentError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setCourse({ ...course, [name]: parseFloat(value) });
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const handleToggleFree = () => {
    setCourse(prev => ({ 
      ...prev, 
      isFree: !prev.isFree,
      price: !prev.isFree ? 0 : 49.99 
    }));
  };

  const validateAttachmentUrl = (url: string) => {
    // Basic URL validation
    const urlPattern = /^https:\/\/(drive\.google\.com|docs\.google\.com|www\.dropbox\.com|onedrive\.live\.com)/;
    return urlPattern.test(url);
  };

  const handleAddAttachment = () => {
    setAttachmentError('');

    if (!newAttachment.title.trim() || !newAttachment.url.trim()) {
      setAttachmentError('Please fill in both title and URL');
      return;
    }

    if (!validateAttachmentUrl(newAttachment.url)) {
      setAttachmentError('Please enter a valid Google Drive, Dropbox, or OneDrive URL');
      return;
    }

    const attachment: Attachment = {
      id: `attachment-${Date.now()}`,
      ...newAttachment
    };

    setCourse(prev => ({
      ...prev,
      attachments: [...prev.attachments, attachment]
    }));

    setNewAttachment({
      title: '',
      url: '',
      type: 'document'
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setCourse(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!course.title.trim()) {
      newErrors.title = 'Please enter the course title';
    }
    
    if (!course.description.trim()) {
      newErrors.description = 'Please enter the course description';
    }
    
    if (!course.duration.trim()) {
      newErrors.duration = 'Please enter the course duration';
    }
    
    if (!course.isFree && course.price <= 0) {
      newErrors.price = 'Course price must be greater than zero';
    }

    if (customImageUrl && !isValidImageUrl(customImageUrl)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif)$/i) || url.startsWith('https://images.unsplash.com/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      if (customImageUrl && isValidImageUrl(customImageUrl)) {
        setCourse(prev => ({ ...prev, image: customImageUrl }));
      }
      
      setTimeout(() => {
        onAddCourse(course);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    'https://images.unsplash.com/photo-1563206767-5b18f218e8de',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Add New Course</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-primary-100 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={course.title}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter course title"
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={course.description}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Enter detailed course description"
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={course.category}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <BarChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="level"
                    name="level"
                    value={course.level}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Duration
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={course.duration}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="Example: 8 hours"
                  />
                </div>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    type="button"
                    onClick={handleToggleFree}
                    className={`flex-1 py-3 px-4 rounded-lg border ${
                      course.isFree
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFree}
                    className={`flex-1 py-3 px-4 rounded-lg border ${
                      !course.isFree
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {!course.isFree && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={course.price}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="Enter course price"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image
                </label>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {sampleImages.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setCourse({ ...course, image: img });
                          setCustomImageUrl('');
                        }}
                        className={`relative cursor-pointer rounded-lg overflow-hidden h-24 ${
                          course.image === img ? 'ring-2 ring-primary-500' : ''
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {course.image === img && (
                          <div className="absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="customImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Or Enter a Custom Image URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Image className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="customImageUrl"
                        type="text"
                        value={customImageUrl}
                        onChange={(e) => {
                          setCustomImageUrl(e.target.value);
                          if (isValidImageUrl(e.target.value)) {
                            setCourse({ ...course, image: e.target.value });
                          }
                        }}
                        className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                          errors.image ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      The URL must be a valid image (jpg, jpeg, png, gif) or an Unsplash URL
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Attachments Section */}
              <div className="md:col-span-2">
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Course Attachments</h4>
                  
                  {/* Add New Attachment Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="attachmentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Attachment Title
                        </label>
                        <input
                          id="attachmentTitle"
                          type="text"
                          value={newAttachment.title}
                          onChange={(e) => setNewAttachment({ ...newAttachment, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter attachment title"
                        />
                      </div>
                      <div>
                        <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Attachment URL
                        </label>
                        <div className="relative">
                          <input
                            id="attachmentUrl"
                            type="text"
                            value={newAttachment.url}
                            onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://drive.google.com/..."
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Link className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label htmlFor="attachmentType" className="block text-sm font-medium text-gray-700 mb-1">
                        Attachment Type
                      </label>
                      <select
                        id="attachmentType"
                        value={newAttachment.type}
                        onChange={(e) => setNewAttachment({ ...newAttachment, type: e.target.value as 'document' | 'video' | 'other' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {attachmentError && (
                      <p className="mt-2 text-sm text-red-600">{attachmentError}</p>
                    )}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        Add Attachment
                      </button>
                    </div>
                  </div>

                  {/* Attachments List */}
                  {course.attachments.length > 0 && (
                    <div className="space-y-2">
                      {course.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Link className="h-5 w-5 text-gray-400 ml-2" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{attachment.title}</p>
                              <p className="text-xs text-gray-500">{attachment.type}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Add Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
