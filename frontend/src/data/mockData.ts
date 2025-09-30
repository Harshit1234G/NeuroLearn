import { User, Question, QuizResult, StudentProgress, Topic } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.student@neurolearm.com',
    role: 'student',
    classId: 'class-1',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Sarah Thompson',
    email: 'sarah.teacher@neurolearn.com',
    role: 'teacher',
    classId: 'class-1',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.parent@neurolearn.com',
    role: 'parent',
    childId: '1',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.student@neurolearn.com',
    role: 'student',
    classId: 'class-1',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.student@neurolearn.com',
    role: 'student',
    classId: 'class-1',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Mock Topics
export const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Basic arithmetic, algebra, and geometry',
    questionsCount: 10,
    difficulty: 'medium',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Science',
    description: 'Physics, chemistry, and biology fundamentals',
    questionsCount: 10,
    difficulty: 'hard',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'English',
    description: 'Grammar, vocabulary, and reading comprehension',
    questionsCount: 10,
    difficulty: 'easy',
    color: '#F59E0B'
  },
  {
    id: '4',
    name: 'History',
    description: 'World history and historical events',
    questionsCount: 10,
    difficulty: 'medium',
    color: '#8B5CF6'
  }
];

// Mock Questions
export const mockQuestions: Question[] = [
  // Mathematics Questions
  {
    id: 'math-1',
    question: 'What is 25 + 37?',
    options: ['52', '62', '72', '82'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: 'math-2',
    question: 'Solve for x: 2x + 5 = 13',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  {
    id: 'math-3',
    question: 'What is the area of a circle with radius 5?',
    options: ['25π', '10π', '15π', '20π'],
    correctAnswer: 0,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  {
    id: 'math-4',
    question: 'What is 144 ÷ 12?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: 'math-5',
    question: 'What is the square root of 64?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    topic: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: 'math-6',
    question: 'If a triangle has angles of 60° and 70°, what is the third angle?',
    options: ['40°', '50°', '60°', '70°'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  {
    id: 'math-7',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  {
    id: 'math-8',
    question: 'Solve: 3² + 4² = ?',
    options: ['25', '24', '23', '22'],
    correctAnswer: 0,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  {
    id: 'math-9',
    question: 'What is the perimeter of a rectangle with length 8 and width 5?',
    options: ['24', '26', '28', '30'],
    correctAnswer: 1,
    topic: 'Mathematics',
    difficulty: 'easy'
  },
  {
    id: 'math-10',
    question: 'If y = 2x + 3 and x = 4, what is y?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 2,
    topic: 'Mathematics',
    difficulty: 'medium'
  },
  
  // Science Questions
  {
    id: 'sci-1',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    topic: 'Science',
    difficulty: 'medium'
  },
  {
    id: 'sci-2',
    question: 'How many bones are in the adult human body?',
    options: ['206', '208', '210', '212'],
    correctAnswer: 0,
    topic: 'Science',
    difficulty: 'hard'
  },
  {
    id: 'sci-3',
    question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswer: 2,
    topic: 'Science',
    difficulty: 'easy'
  },
  {
    id: 'sci-4',
    question: 'What is the speed of light?',
    options: ['299,792,458 m/s', '300,000,000 m/s', '298,000,000 m/s', '301,000,000 m/s'],
    correctAnswer: 0,
    topic: 'Science',
    difficulty: 'hard'
  },
  {
    id: 'sci-5',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    topic: 'Science',
    difficulty: 'easy'
  },
  {
    id: 'sci-6',
    question: 'What is the pH of pure water?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    topic: 'Science',
    difficulty: 'medium'
  },
  {
    id: 'sci-7',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
    correctAnswer: 2,
    topic: 'Science',
    difficulty: 'medium'
  },
  {
    id: 'sci-8',
    question: 'What is the atomic number of carbon?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 2,
    topic: 'Science',
    difficulty: 'medium'
  },
  {
    id: 'sci-9',
    question: 'Which law states that energy cannot be created or destroyed?',
    options: ['Newton\'s First Law', 'Law of Conservation of Energy', 'Newton\'s Second Law', 'Boyle\'s Law'],
    correctAnswer: 1,
    topic: 'Science',
    difficulty: 'hard'
  },
  {
    id: 'sci-10',
    question: 'What is the smallest unit of matter?',
    options: ['Molecule', 'Atom', 'Electron', 'Neutron'],
    correctAnswer: 1,
    topic: 'Science',
    difficulty: 'medium'
  }
];

// Mock Quiz Results
export const mockQuizResults: QuizResult[] = [
  {
    id: 'result-1',
    studentId: '1',
    topic: 'Mathematics',
    score: 8,
    totalQuestions: 10,
    answers: [
      { questionId: 'math-1', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-2', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-3', selectedAnswer: 0, isCorrect: true },
      { questionId: 'math-4', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-5', selectedAnswer: 2, isCorrect: true },
      { questionId: 'math-6', selectedAnswer: 0, isCorrect: false },
      { questionId: 'math-7', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-8', selectedAnswer: 0, isCorrect: true },
      { questionId: 'math-9', selectedAnswer: 2, isCorrect: false },
      { questionId: 'math-10', selectedAnswer: 2, isCorrect: true }
    ],
    completedAt: new Date('2024-12-15T10:30:00'),
    timeSpent: 420
  },
  {
    id: 'result-2',
    studentId: '1',
    topic: 'Science',
    score: 7,
    totalQuestions: 10,
    answers: [
      { questionId: 'sci-1', selectedAnswer: 2, isCorrect: true },
      { questionId: 'sci-2', selectedAnswer: 1, isCorrect: false },
      { questionId: 'sci-3', selectedAnswer: 2, isCorrect: true },
      { questionId: 'sci-4', selectedAnswer: 0, isCorrect: true },
      { questionId: 'sci-5', selectedAnswer: 1, isCorrect: true },
      { questionId: 'sci-6', selectedAnswer: 1, isCorrect: true },
      { questionId: 'sci-7', selectedAnswer: 2, isCorrect: true },
      { questionId: 'sci-8', selectedAnswer: 1, isCorrect: false },
      { questionId: 'sci-9', selectedAnswer: 1, isCorrect: true },
      { questionId: 'sci-10', selectedAnswer: 2, isCorrect: false }
    ],
    completedAt: new Date('2024-12-14T14:20:00'),
    timeSpent: 510
  },
  {
    id: 'result-3',
    studentId: '4',
    topic: 'Mathematics',
    score: 9,
    totalQuestions: 10,
    answers: [
      { questionId: 'math-1', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-2', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-3', selectedAnswer: 0, isCorrect: true },
      { questionId: 'math-4', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-5', selectedAnswer: 2, isCorrect: true },
      { questionId: 'math-6', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-7', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-8', selectedAnswer: 0, isCorrect: true },
      { questionId: 'math-9', selectedAnswer: 1, isCorrect: true },
      { questionId: 'math-10', selectedAnswer: 1, isCorrect: false }
    ],
    completedAt: new Date('2024-12-15T09:15:00'),
    timeSpent: 380
  }
];

// Mock Student Progress
export const mockStudentProgress: StudentProgress[] = [
  {
    studentId: '1',
    topics: {
      'Mathematics': {
        completed: 3,
        totalQuizzes: 5,
        averageScore: 8.2,
        lastActivity: new Date('2024-12-15T10:30:00')
      },
      'Science': {
        completed: 2,
        totalQuizzes: 4,
        averageScore: 7.5,
        lastActivity: new Date('2024-12-14T14:20:00')
      },
      'English': {
        completed: 1,
        totalQuizzes: 3,
        averageScore: 8.0,
        lastActivity: new Date('2024-12-13T11:45:00')
      }
    },
    overallProgress: 65,
    totalQuizzesCompleted: 6,
    averageScore: 7.9
  },
  {
    studentId: '4',
    topics: {
      'Mathematics': {
        completed: 4,
        totalQuizzes: 5,
        averageScore: 8.8,
        lastActivity: new Date('2024-12-15T09:15:00')
      },
      'Science': {
        completed: 3,
        totalQuizzes: 4,
        averageScore: 8.3,
        lastActivity: new Date('2024-12-14T16:30:00')
      }
    },
    overallProgress: 78,
    totalQuizzesCompleted: 7,
    averageScore: 8.6
  }
];