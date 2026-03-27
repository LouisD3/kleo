import { AppState, CapState } from './types';
import { CAPS } from './caps';

const STORAGE_KEY = 'kleo-physics-state';

export function getInitialCapState(capId: number): CapState {
  return {
    status: capId === 1 ? 'in-progress' : 'locked',
    phase: 'read',
    userExplanation: '',
    evaluation: undefined,
    followUpAnswers: [],
    finalValidation: undefined,
    attemptCount: 0,
  };
}

export function getInitialAppState(): AppState {
  return {
    caps: Object.fromEntries(
      CAPS.map((cap) => [cap.id, getInitialCapState(cap.id)])
    ),
    totalXP: 0,
    activeCapId: 1,
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getInitialAppState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialAppState();
    return JSON.parse(raw) as AppState;
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
