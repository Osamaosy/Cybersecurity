import { Course, Category } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Penetration Testing', icon: 'swords' },
  { id: '2', name: 'Malware Analysis', icon: 'bug' },
  { id: '3', name: 'Defensive Security', icon: 'shield' },
  { id: '4', name: 'Cryptography', icon: 'key' },
  { id: '5', name: 'Network Security', icon: 'network' },
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'Penetration Testing Fundamentals',
    description: 'Learn the basics of penetration testing and how to discover system vulnerabilities',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    instructor: 'Ahmed Mohamed',
    duration: '8 Hours',
    level: 'Beginner',
    category: 'Penetration Testing',
    price: 49.99,
    content: [
      {
        id: '1-1',
        title: 'Introduction to Penetration Testing',
        duration: '45 Minutes',
        videoUrl: 'https://www.youtube.com/embed/kmJlnUfMd7I?si=fguH9RDUcWf20PSt',
        description: 'Learn the basic concepts of penetration testing and its importance in cybersecurity'
      },
      {
        id: '1-2',
        title: 'Penetration Testing Tools',
        duration: '60 Minutes',
        videoUrl: 'https://www.youtube.com/embed/kUovJpWqEMk?si=sp9ueb-oEAbHM0xc',
        description: 'Explore the essential tools used in penetration testing'
      },
      {
        id: '1-3',
        title: 'Penetration Testing Methodology',
        duration: '55 Minutes',
        videoUrl: 'https://www.youtube.com/embed/X3DVaMnl5n8?si=QvfstU6T6gx9zCZw',
        description: 'Learn the methodical steps for conducting professional penetration testing'
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced Malware Analysis',
    description: 'Advanced course in analyzing and understanding malware and methods of combating it',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    instructor: 'Sarah Ahmed',
    duration: '12 Hours',
    level: 'Advanced',
    category: 'Malware Analysis',
    price: 79.99,
    content: [
      {
        id: '2-1',
        title: 'Introduction to Malware Analysis',
        duration: '50 Minutes',
        videoUrl: 'https://www.youtube.com/embed/kmJlnUfMd7I?si=fguH9RDUcWf20PSt',
        description: 'Learn the basics of malware analysis and its importance'
      },
      {
        id: '2-2',
        title: 'Advanced Analysis Tools',
        duration: '75 Minutes',
        videoUrl: 'https://www.youtube.com/embed/X3DVaMnl5n8?si=QvfstU6T6gx9zCZw',
        description: 'Explore advanced tools used in malware analysis'
      }
    ]
  },
  {
    id: '3',
    title: 'Network Security Basics',
    description: 'Learn the basics of network security and how to protect infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    instructor: 'Mohamed Ali',
    duration: '10 Hours',
    level: 'Beginner',
    category: 'Network Security',
    price: 59.99,
    content: [
      {
        id: '3-1',
        title: 'Network Security Fundamentals',
        duration: '60 Minutes',
        videoUrl: 'https://www.youtube.com/embed/kmJlnUfMd7I?si=fguH9RDUcWf20PSt',
        description: 'Learn the basic concepts of network security'
      },
      {
        id: '3-2',
        title: 'Security Protocols',
        duration: '55 Minutes',
        videoUrl: 'https://www.youtube.com/embed/X3DVaMnl5n8?si=QvfstU6T6gx9zCZw',
        description: 'Study different security protocols and how to implement them'
      }
    ]
  }
];