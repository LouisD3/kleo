export type CapStatus = 'locked' | 'in-progress' | 'unlocked';
export type CapPhase = 'read' | 'write' | 'feedback' | 'questions' | 'tutoring' | 'complete';

export interface Cap {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  explanation: string;
  keyConcepts: string[];
  xpReward: number;
}

export interface ConceptCheck {
  concept: string;
  covered: boolean;
  studentEvidence?: string;
}

export interface EvaluationResult {
  gaps: string[];
  correct: string[];
  passed: boolean;
  followUpQuestions: string[];
  conceptChecks?: ConceptCheck[];
  tutorExplanation?: string;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface CapState {
  status: CapStatus;
  phase: CapPhase;
  userExplanation: string;
  evaluation?: EvaluationResult;
  followUpAnswers: QuestionAnswer[];
  finalValidation?: { passed: boolean; message: string };
  attemptCount: number;
}

export interface AppState {
  caps: Record<number, CapState>;
  totalXP: number;
  activeCapId: number | null;
}
