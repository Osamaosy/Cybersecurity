export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  price: number;
  isFree?: boolean;
  isPurchased?: boolean;
  content: CourseContent[];
  instructorId?: string;
  attachments: Attachment[];
}

export interface CourseContent {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
}

export interface Attachment {
  id: string;
  title: string;
  url: string;
  type: 'document' | 'video' | 'other';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface UserType {
  name: string;
  email: string;
  password?:string;
  purchasedCourses: string[];
  role: 'student' | 'instructor' | 'admin';
  createdCourses?: string[];
  completedLessons?: Record<string, string[]>;
}

export interface NewCourse {
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isFree?: boolean;
  duration: string;
  image: string;
  attachments: Attachment[];
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  userName: string;
  enrollmentDate: string;
}