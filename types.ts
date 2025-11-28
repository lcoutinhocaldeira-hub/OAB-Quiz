
export type QuizMode = 'practice' | 'simulation';

export interface QuizSettings {
  subject: string;
  topics: string[];
  numberOfQuestions: number;
  quizMode: QuizMode;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  subject: string;
  topics: string[];
}

export type AppState = 'setup' | 'loading' | 'active' | 'finished' | 'history';
