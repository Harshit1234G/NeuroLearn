export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  avatar?: string;
  childId?: string; // For parents
  classId?: string; // For students and teachers
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  id: string;
  studentId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface StudentProgress {
  studentId: string;
  topics: {
    [topicName: string]: {
      completed: number;
      totalQuizzes: number;
      averageScore: number;
      lastActivity: Date;
    };
  };
  overallProgress: number;
  totalQuizzesCompleted: number;
  averageScore: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
}