import { AppState, CapPhase, CapState } from './types';
import { CAPS } from './caps';

const STORAGE_KEY = 'kleo-physics-state';

const VALID_PHASES: CapPhase[] = ['conceptos', 'explicar', 'revisar', 'complete'];

export function getInitialCapState(capId: number): CapState {
  return {
    status: capId === 1 ? 'in-progress' : 'locked',
    phase: 'conceptos',
    explicarAnswers: [],
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
    const parsed = JSON.parse(raw) as AppState;
    // Migration: reset any cap state with an invalid (old) phase
    for (const capId of Object.keys(parsed.caps)) {
      const capState = parsed.caps[Number(capId)];
      if (!capState || !VALID_PHASES.includes(capState.phase)) {
        parsed.caps[Number(capId)] = getInitialCapState(Number(capId));
      }
    }
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
