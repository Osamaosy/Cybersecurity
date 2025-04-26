/* eslint-disable no-irregular-whitespace */
import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, User, LogOut, ChevronDown, BookOpen, PlusCircle, Shield, LayoutDashboard } from 'lucide-react';
import { UserType as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  onAddCourse?: () => void;
}

export default function Navbar({ user, onLogout, onAddCourse }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getActionButton = () => {
    if (!onAddCourse) return null;

    if (user?.role === 'admin') {
      return (
        <button
          onClick={onAddCourse}
          className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-full text-sm hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow ml-2"
        >
          Admin panel
          <Shield className="h-4 w-4 ml-1.5" />
        </button>
      );
    }

    if (user?.role === 'instructor') {
      return (
        <button
          onClick={onAddCourse}
          className="flex items-center bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow ml-2"
        >
          Add a course
          <PlusCircle className="h-4 w-4 ml-1.5" />
        </button>
      );
    }

    if (user?.role === 'student') {
      return (
        <button
          onClick={onAddCourse}
          className="flex items-center bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow ml-2"
        >
          <LayoutDashboard className="h-4 w-4 ml-1.5" />
          My courses
        </button>
      );
    }

    return null;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center">
            <ShieldCheck className="h-7 w-7 text-primary-500" />
            <span className="mr-2 text-lg font-bold text-gray-800">Cyber ​​Tech</span>
          </div>
          
          {user ? (
            <div className="flex items-center">
              <div className="relative mr-3" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 space-x-reverse bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full text-sm transition-all duration-200"
                >
                  <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-gray-700 mx-2">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : user.role === 'instructor'
                              ? 'bg-primary-50 text-primary-600 border border-primary-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          {user.role === 'admin' ? (
                            <span className="flex items-center">
                              Admin
                              <Shield className="h-3 w-3 ml-1" />
                            </span>
                          ) : user.role === 'instructor' ? (
                            <span className="flex items-center">
                              Instructor
                              <BookOpen className="h-3 w-3 ml-1" />
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Student
                              <User className="h-3 w-3 ml-1" />
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {getActionButton()}

              <button
                onClick={onLogout}
                className="flex items-center text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all duration-200 mr-2"
              >
                exit
                <LogOut className="h-4 w-4 ml-1.5" />
              </button>
            </div>
          ) : (
            <button className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow">
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}