export type CapStatus = 'locked' | 'in-progress' | 'unlocked';
export type CapPhase = 'conceptos' | 'explicar' | 'revisar' | 'complete';
export type FinalTestPhase = 'explicar' | 'revisar' | 'complete';

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
  relevantQuestionIndex: number;
}

// Unified content interface passed to FeynmanLoop and sub-components
export interface LearningContent {
  title: string;
  emoji: string;
  color: string;
  keyConcepts: string[];
  conceptPages: ConceptPage[]; // empty array for final test
  explicarQuestions: ExplicarQuestion[][];
  xpReward: number;
}

export interface Chapter {
  id: number;
  title: string;
  xpReward: number;
  keyConcepts: string[];
  conceptPages: ConceptPage[];
  explicarQuestions: ExplicarQuestion[][];
}

export interface FinalTest {
  xpReward: number;
  keyConcepts: string[];
  explicarQuestions: ExplicarQuestion[][];
}

export interface Cap {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  xpReward: number; // sum of all chapters + finalTest
  chapters: Chapter[];
  finalTest: FinalTest;
}

export interface ChapterState {
  phase: CapPhase;
  explicarAnswers: ExplicarAnswer[];
  attemptCount: number;
  starRating?: 1 | 2 | 3;
}

export interface FinalTestState {
  phase: FinalTestPhase;
  explicarAnswers: ExplicarAnswer[];
  attemptCount: number;
  starRating?: 1 | 2 | 3;
}

export interface CapState {
  status: CapStatus;
  chapters: ChapterState[];
  finalTest: FinalTestState;
}

export interface AppState {
  caps: Record<number, CapState>;
  totalXP: number;
  unlockedBadgeIds: string[];   // NEW
  dailyObjective: DailyObjective | null;  // NEW
  lastXPForLevelCheck: number;  // NEW — pour détecter les level-ups
}

// ── Gamification ──────────────────────────────────────────────────────────────

export interface Level {
  level: number;       // 1-8
  name: string;        // "Aprendiz", etc.
  emoji: string;
  minXP: number;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface DailyObjective {
  type: 'complete_chapter' | 'get_stars' | 'complete_2chapters';
  description: string;
  target: number;      // 1 or 2 (chapters) or 2 (stars level)
  current: number;
  date: string;        // YYYY-MM-DD
  completed: boolean;
}
