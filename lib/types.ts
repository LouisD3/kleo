export type CapStatus = 'locked' | 'in-progress' | 'unlocked';
export type CapPhase = 'conceptos' | 'explicar' | 'revisar' | 'complete';

export interface ConceptPage {
  name: string;
  explanation: string;
  quickCheck: {
    question: string;
    options: [string, string];
    correctIndex: 0 | 1;
    hint: string;
  };
}

export interface ExplicarQuestion {
  question: string;
  type: 'comprehension' | 'application';
}

export interface ExplicarAnswer {
  conceptIndex: number;
  questionIndex: number;
  question: string;
  answer: string;
}

export interface RevisarItem {
  conceptIndex: number;
  concept: string;
  aiExplanation: string;
  targetedQuestion: string;
  relevantQuestionIndex: number; // 0 | 1 | 2 — index dans explicarQuestions[conceptIndex]
}

export interface Cap {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  explanation: string;
  keyConcepts: string[];
  xpReward: number;
  conceptPages: ConceptPage[];
  explicarQuestions: ExplicarQuestion[][];
}

export interface CapState {
  status: CapStatus;
  phase: CapPhase;
  explicarAnswers: ExplicarAnswer[];
  attemptCount: number; // number of failed Revisar loops
  starRating?: 1 | 2 | 3;
}

export interface AppState {
  caps: Record<number, CapState>;
  totalXP: number;
  activeCapId: number | null;
}
