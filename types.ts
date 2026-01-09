
export interface User {
  firstName: string;
  lastName: string;
  usn: string;
  email: string;
  isLoggedIn: boolean;
  assessmentResult?: AssessmentResult;
}

export type Dimension = 'processing' | 'perception' | 'input' | 'understanding';

export interface AssessmentResult {
  id: string;
  type: 'static' | 'ai';
  scores: Record<Dimension, number>; // -5 to +5
  profileCode: string;               // e.g., "ASVS"
  profileLabel: string;
  profileDescription: string;
  recommendations: string[];
  contextInsights: string[];
  timestamp: number;
}

export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface AdaptiveQuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  bloom_level: BloomLevel;
  learning_style_tags: string[]; // e.g. ["Visual", "Sequential"]
}

export interface AdaptiveQuiz {
  quiz_id: string;
  topic: string;
  target_bloom: BloomLevel;
  questions: AdaptiveQuizQuestion[];
  dr_fox_intro: string;
}

export interface QuizAttempt {
  score: number;
  total: number;
  bloom_achieved: BloomLevel;
  timestamp: number;
  topic: string;
}

export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  options: {
    A: string;  // Pole 1 (Active/Sensing/Visual/Sequential)
    B: string;  // Pole 2 (Reflective/Intuitive/Verbal/Global)
    C: string;  // Neutral
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  icon: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  order: number;
  topics?: Topic[];
}

export interface VideoItem {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  title: string;
  url: string;
  duration: string;
}

export interface Topic {
  id: string;
  name: string;
  overview: string;
  materials: StudyMaterial[];
  videoUrl: string;
  labVideoUrl: string;
  videos?: VideoItem[];
  quiz: QuizQuestion[];
  questionBank?: QuestionBank;
}

export interface QuestionBank {
  mcqs: QuizQuestion[];
  fillBlanks: Array<{ id: string; question: string; answer: string }>;
  matchFollowing: Array<{ id: string; term: string; definition: string }>;
  trueFalse: Array<{ id: string; question: string; answer: boolean; explanation: string }>;
  shortAnswers: Array<{ id: string; question: string; answer: string }>;
  longAnswers: Array<{ id: string; question: string; answer: string }>;
  numerical: Array<{ id: string; question: string; solution: string }>;
  scenarios: Array<{ id: string; title: string; context: string; tasks: string[]; solution: string }>;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'doc';
  isDownloaded: boolean;
  url: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  solution: string;
}

// Coding Lab Interfaces
export type LabMode = 'learn' | 'practice' | 'test';
export type PracticeType = 'dependent' | 'independent';
