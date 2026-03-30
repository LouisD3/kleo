import { AppState, CapState, ChapterState, FinalTestState } from './types';
import { CAPS } from './caps';

const STORAGE_KEY = 'kleo-physics-state-v2';

export function getInitialChapterState(): ChapterState {
  return {
    phase: 'conceptos',
    explicarAnswers: [],
    attemptCount: 0,
  };
}

export function getInitialFinalTestState(): FinalTestState {
  return {
    phase: 'explicar',
    explicarAnswers: [],
    attemptCount: 0,
  };
}

export function getInitialCapState(capId: number): CapState {
  const cap = CAPS.find((c) => c.id === capId)!;
  return {
    status: capId === 1 ? 'in-progress' : 'locked',
    chapters: cap.chapters.map(() => getInitialChapterState()),
    finalTest: getInitialFinalTestState(),
  };
}

export function getInitialAppState(): AppState {
  return {
    caps: Object.fromEntries(
      CAPS.map((cap) => [cap.id, getInitialCapState(cap.id)])
    ),
    totalXP: 0,
  };
}

function isValidCapState(state: unknown, capId: number): boolean {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  if (!s.status || !s.chapters || !s.finalTest) return false;
  if (!Array.isArray(s.chapters)) return false;
  const cap = CAPS.find((c) => c.id === capId);
  if (!cap) return false;
  if ((s.chapters as unknown[]).length !== cap.chapters.length) return false;
  return true;
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getInitialAppState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialAppState();
    const parsed = JSON.parse(raw) as AppState;
    // Validate and migrate invalid cap states
    for (const cap of CAPS) {
      if (!isValidCapState(parsed.caps?.[cap.id], cap.id)) {
        parsed.caps[cap.id] = getInitialCapState(cap.id);
      }
    }
    if (typeof parsed.totalXP !== 'number') parsed.totalXP = 0;
    return parsed;
  } catch {
    return getInitialAppState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
