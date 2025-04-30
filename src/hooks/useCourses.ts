/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Course, CourseContent, NewCourse, CourseEnrollment, UserType } from '../types';
import { courses as initialCourses } from '../data';

interface UseCoursesReturn {
  courses: Course[];
  coursesWithPurchaseStatus: Course[];
  courseEnrollments: CourseEnrollment[];
  addCourse: (newCourse: NewCourse) => void;
  updateCourseContent: (courseId: string, updatedContent: CourseContent[]) => void;
  purchaseCourse: (courseId: string) => boolean;
  deleteCourse: (courseId: string) => void;
  addStudentManually: (courseId: string, email: string, name: string) => void;
  removeStudent: (courseId: string, userId: string) => void;
  removeInstructor: (instructorId: string) => void;
  getCourseEnrollments: (courseId: string) => CourseEnrollment[];
}

export function useCourses(user: UserType | null): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [coursesWithPurchaseStatus, setCoursesWithPurchaseStatus] = useState<Course[]>(initialCourses);
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([]);

  useEffect(() => {
    try {
      // Load courses from localStorage if available
      const savedCourses = localStorage.getItem('courses');
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(parsedCourses);
      }
      
      // Load enrollments from localStorage if available
      const savedEnrollments = localStorage.getItem('enrollments');
      if (savedEnrollments) {
        setCourseEnrollments(JSON.parse(savedEnrollments));
      }

      // Update purchase status whenever user changes
      if (user) {
        const currentUser = JSON.parse(localStorage.getItem('users') || '[]')
          .find((u: any) => u.email === user.email);
        
        if (currentUser) {
          const purchasedCourses = currentUser.purchasedCourses || [];
          updateCoursePurchaseStatus(purchasedCourses, savedCourses ? JSON.parse(savedCourses) : initialCourses);
        }
      } else {
        updateCoursePurchaseStatus([], savedCourses ? JSON.parse(savedCourses) : initialCourses);
      }
    } catch (error) {
      console.error('Error loading courses or enrollments:', error);
      setCourses(initialCourses);
      updateCoursePurchaseStatus([], initialCourses);
    }
  }, [user]);

  const updateCoursePurchaseStatus = (purchasedCourseIds: string[], coursesToUpdate: Course[]) => {
    try {
      const updatedCourses = coursesToUpdate.map(course => ({
        ...course,
        isPurchased: purchasedCourseIds.includes(course.id)
      }));
      setCoursesWithPurchaseStatus(updatedCourses);
    } catch (error) {
      console.error('Error updating course purchase status:', error);
    }
  };

  const addCourse = (newCourse: NewCourse) => {
    try {
      if (!user || (user.role !== 'instructor' && user.role !== 'admin')) return;
      
      const courseId = `course-${Date.now()}`;
      const courseToAdd: Course = {
        id: courseId,
        ...newCourse,
        instructor: user.name,
        instructorId: user.email,
        content: []
      };
      
      const updatedCourses = [...courses, courseToAdd];
      setCourses(updatedCourses);
      setCoursesWithPurchaseStatus(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const updateCourseContent = (courseId: string, updatedContent: CourseContent[]) => {
    try {
      const updatedCourses = courses.map(course => 
        course.id === courseId 
          ? { ...course, content: updatedContent }
          : course
      );
      
      setCourses(updatedCourses);
      setCoursesWithPurchaseStatus(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error updating course content:', error);
    }
  };

  const purchaseCourse = (courseId: string): boolean => {
    try {
      if (!user) return false;

      // Check if course exists
      const courseExists = courses.some(course => course.id === courseId);
      if (!courseExists) {
        console.error('Course not found:', courseId);
        return false;
      }

      // Get current user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((u: any) => u.email === user.email);
      
      if (!currentUser) {
        console.error('User not found:', user.email);
        return false;
      }

      // Check if already purchased
      const purchasedCourses = currentUser.purchasedCourses || [];
      if (purchasedCourses.includes(courseId)) {
        console.error('Course already purchased:', courseId);
        return false;
      }

      // Update user's purchased courses
      const updatedPurchasedCourses = [...purchasedCourses, courseId];
      
      // Update users in localStorage
      const updatedUsers = users.map((u: any) => 
        u.email === user.email 
          ? { ...u, purchasedCourses: updatedPurchasedCourses }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update local user state
      const updatedUser = {
        ...user,
        purchasedCourses: updatedPurchasedCourses
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update course purchase status
      updateCoursePurchaseStatus(updatedPurchasedCourses, courses);
      
      // Create new enrollment
      const newEnrollment: CourseEnrollment = {
        courseId,
        userId: user.email,
        userName: user.name,
        enrollmentDate: new Date().toISOString()
      };
      
      const updatedEnrollments = [...courseEnrollments, newEnrollment];
      setCourseEnrollments(updatedEnrollments);
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));

      return true;
    } catch (error) {
      console.error('Error purchasing course:', error);
      return false;
    }
  };

  const deleteCourse = (courseId: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      setCoursesWithPurchaseStatus(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      const updatedEnrollments = courseEnrollments.filter(
        enrollment => enrollment.courseId !== courseId
      );
      
      setCourseEnrollments(updatedEnrollments);
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => ({
        ...u,
        purchasedCourses: (u.purchasedCourses || []).filter((id: string) => id !== courseId),
        createdCourses: (u.createdCourses || []).filter((id: string) => id !== courseId)
      }));
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const addStudentManually = (courseId: string, email: string, name: string) => {
    try {
      // Check if course exists
      const courseExists = courses.some(course => course.id === courseId);
      if (!courseExists) {
        console.error('Course not found:', courseId);
        return;
      }

      const newEnrollment: CourseEnrollment = {
        courseId,
        userId: email,
        userName: name,
        enrollmentDate: new Date().toISOString()
      };
      
      const updatedEnrollments = [...courseEnrollments, newEnrollment];
      setCourseEnrollments(updatedEnrollments);
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        const tempPassword = 'password123';
        const newUser = {
          name,
          email,
          password: tempPassword,
          purchasedCourses: [courseId],
          role: 'student',
          createdCourses: [],
          completedLessons: {}
        };
        
        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } else {
        const updatedUsers = users.map((u: any) => {
          if (u.email === email) {
            const purchasedCourses = u.purchasedCourses || [];
            if (!purchasedCourses.includes(courseId)) {
              return {
                ...u,
                purchasedCourses: [...purchasedCourses, courseId]
              };
            }
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    } catch (error) {
      console.error('Error adding student manually:', error);
    }
  };

  const removeStudent = (courseId: string, userId: string) => {
    try {
      const updatedEnrollments = courseEnrollments.filter(
        enrollment => !(enrollment.courseId === courseId && enrollment.userId === userId)
      );
      
      setCourseEnrollments(updatedEnrollments);
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email === userId) {
          return {
            ...u,
            purchasedCourses: (u.purchasedCourses || []).filter((id: string) => id !== courseId)
          };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const removeInstructor = (instructorId: string) => {
    try {
      const instructorCourses = courses.filter(course => course.instructorId === instructorId);
      instructorCourses.forEach(course => {
        deleteCourse(course.id);
      });
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((u: any) => u.email !== instructorId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error removing instructor:', error);
    }
  };

  const getCourseEnrollments = (courseId: string): CourseEnrollment[] => {
    try {
      return courseEnrollments.filter(enrollment => enrollment.courseId === courseId);
    } catch (error) {
      console.error('Error getting course enrollments:', error);
      return [];
    }
  };

  return {
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
  };
}
