/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { UserType } from '../types';

interface UseAuthReturn {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => boolean;
  logout: () => void;
  updateCompletedLessons: (courseId: string, lessonId: string) => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Create admin account if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some((u: UserType) => u.email === 'admin@gmail.com');
    
    if (!adminExists) {
      const adminUser: UserType = {
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: 'admin123',
        purchasedCourses: [],
        role: 'admin',
        createdCourses: [],
        completedLessons: {}
      };
      
      const updatedUsers = [...users, adminUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userInfo: UserType = { 
        name: foundUser.name, 
        email: foundUser.email,
        purchasedCourses: foundUser.purchasedCourses || [],
        role: foundUser.role || 'student',
        createdCourses: foundUser.createdCourses || [],
        completedLessons: foundUser.completedLessons || {}
      };
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
    }
    
    return false;
  };

  const register = (name: string, email: string, password: string, role: 'student' | 'instructor'): boolean => {
    if (!name || !email.includes('@') || password.length < 6) {
      return false;
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some((user: any) => user.email === email)) {
      return false;
    }
    
    const newUser = { 
      name, 
      email, 
      password,
      purchasedCourses: [],
      role,
      createdCourses: [],
      completedLessons: {}
    };
    const updatedUsers = [...existingUsers, newUser];
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const userInfo: UserType = { 
      name, 
      email,
      purchasedCourses: [],
      role,
      createdCourses: [],
      completedLessons: {}
    };
    setUser(userInfo);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    return true;
  };

  const updateCompletedLessons = (courseId: string, lessonId: string) => {
    if (!user) return;

    const updatedCompletedLessons = { ...user.completedLessons };
    if (!updatedCompletedLessons[courseId]) {
      updatedCompletedLessons[courseId] = [];
    }

    if (!updatedCompletedLessons[courseId].includes(lessonId)) {
      updatedCompletedLessons[courseId].push(lessonId);
    }

    const updatedUser = {
      ...user,
      completedLessons: updatedCompletedLessons
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update the users array in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: UserType) =>
      u.email === user.email ? { ...u, completedLessons: updatedCompletedLessons } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateCompletedLessons
  };
}