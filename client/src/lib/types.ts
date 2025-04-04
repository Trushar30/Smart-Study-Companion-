export interface StudyPlan {
  subject: string;
  topics: string[];
  examDateTime: string;
}

export interface TopicProgress {
  id: string;
  name: string;
  progress: number;
}

export interface Note {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface QuizResult {
  topic: string;
  score: number;
  date: string;
}
