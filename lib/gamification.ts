import { Level, BadgeDef, DailyObjective, AppState } from './types';
import { CAPS } from './caps';

// ── Levels ────────────────────────────────────────────────────────────────────
export const LEVELS: Level[] = [
  { level: 1, name: 'Aprendiz',     emoji: '🌱', minXP: 0   },
  { level: 2, name: 'Curioso',      emoji: '🔍', minXP: 25  },
  { level: 3, name: 'Explorador',   emoji: '🧭', minXP: 65  },
  { level: 4, name: 'Investigador', emoji: '🔬', minXP: 120 },
  { level: 5, name: 'Científico',   emoji: '⚗️', minXP: 185 },
  { level: 6, name: 'Analista',     emoji: '📊', minXP: 255 },
  { level: 7, name: 'Experto',      emoji: '🎓', minXP: 320 },
  { level: 8, name: 'Genio',        emoji: '🧠', minXP: 370 },
];

export function getLevelForXP(xp: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXP) current = level;
  }
  return current;
}

// ── Badges ────────────────────────────────────────────────────────────────────
export const DAILY_OBJECTIVE_XP = 20;

export const BADGE_DEFS: BadgeDef[] = [
  { id: 'first_chapter',   name: 'Primera chispa',    description: 'Completaste tu primer capítulo',              emoji: '🔥', xpReward: 10 },
  { id: 'three_stars',     name: 'Aprendiz veloz',    description: 'Completaste un capítulo con 3 estrellas',     emoji: '⭐', xpReward: 10 },
  { id: 'persistent',      name: 'Sin rendirse',      description: 'Superaste un capítulo después de reintentar', emoji: '💪', xpReward: 5  },
  { id: 'cap1_complete',   name: 'La Materia',        description: 'Completaste el Cap 1: La Materia',            emoji: '⚛️', xpReward: 20 },
  { id: 'cap2_complete',   name: 'La Fuerza',         description: 'Completaste el Cap 2: La Fuerza',             emoji: '💪', xpReward: 20 },
  { id: 'cap3_complete',   name: 'La Energía',        description: 'Completaste el Cap 3: La Energía',            emoji: '⚡', xpReward: 20 },
  { id: 'perfectionist',   name: 'Perfeccionista',    description: 'Conseguiste 2+ estrellas en 5 capítulos',     emoji: '💎', xpReward: 15 },
  { id: 'all_caps',        name: 'Genio total',       description: '¡Completaste todos los caps!',                emoji: '🏆', xpReward: 25 },
];

export function getBadgesXP(badgeIds: string[]): number {
  return badgeIds.reduce((sum, id) => {
    const def = BADGE_DEFS.find(b => b.id === id);
    return sum + (def?.xpReward ?? 0);
  }, 0);
}

// ── Cap rank ──────────────────────────────────────────────────────────────────
export type CapRank = 'bronze' | 'silver' | 'gold';

export function getCapRank(capState: import('./types').CapState): CapRank | null {
  const completed = capState.chapters.filter(ch => ch.phase === 'complete' && ch.starRating);
  if (completed.length === 0) return null;
  const allGold = completed.every(ch => ch.starRating === 3);
  const avgStars = completed.reduce((sum, ch) => sum + (ch.starRating ?? 1), 0) / completed.length;
  if (allGold) return 'gold';
  if (avgStars >= 2) return 'silver';
  return 'bronze';
}

export const RANK_LABEL: Record<CapRank, string> = {
  gold:   '🥇 Oro',
  silver: '🥈 Plata',
  bronze: '🥉 Bronce',
};

// ── Badge unlock check ─────────────────────────────────────────────────────────
// Returns array of newly unlocked badge IDs
export function checkNewBadges(
  appState: AppState,
  event: { capId: number; isChapter: boolean; stars?: 1 | 2 | 3; attemptCount?: number }
): string[] {
  const already = new Set(appState.unlockedBadgeIds ?? []);
  const newBadges: string[] = [];

  const unlock = (id: string) => {
    if (!already.has(id)) {
      newBadges.push(id);
      already.add(id);
    }
  };

  // Count total completed chapters across all caps
  const totalCompleted = Object.values(appState.caps).reduce(
    (sum, cap) => sum + cap.chapters.filter(ch => ch.phase === 'complete').length, 0
  );

  if (event.isChapter) {
    // first_chapter — first time any chapter is completed
    if (totalCompleted === 0) unlock('first_chapter'); // just completed, so was 0 before

    // three_stars
    if (event.stars === 3) unlock('three_stars');

    // persistent — completed after retrying
    if ((event.attemptCount ?? 0) > 0) unlock('persistent');

    // perfectionist — 2+ stars in 5+ chapters (including this new one)
    const highStarCount = Object.values(appState.caps).reduce(
      (sum, cap) => sum + cap.chapters.filter(ch => ch.phase === 'complete' && (ch.starRating ?? 0) >= 2).length, 0
    );
    if (highStarCount >= 4 && (event.stars ?? 0) >= 2) unlock('perfectionist'); // 4 + this new one = 5
  }

  // cap_complete badges — check if all chapters + finalTest of a cap are done
  const capState = appState.caps[event.capId];
  const allChaptersDone = capState?.chapters.every(ch => ch.phase === 'complete');
  const finalTestDone = capState?.finalTest?.phase === 'complete';

  if (allChaptersDone && finalTestDone) {
    if (event.capId === 1) unlock('cap1_complete');
    if (event.capId === 2) unlock('cap2_complete');
    if (event.capId === 3) unlock('cap3_complete');
  }

  // all_caps
  const allCapsDone = CAPS.every(cap => {
    const cs = appState.caps[cap.id];
    return cs?.chapters.every(ch => ch.phase === 'complete') && cs?.finalTest?.phase === 'complete';
  });
  if (allCapsDone) unlock('all_caps');

  return newBadges;
}

// ── Daily objective ────────────────────────────────────────────────────────────
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getOrCreateDailyObjective(appState: AppState): DailyObjective {
  const today = getTodayString();
  if (appState.dailyObjective && appState.dailyObjective.date === today) {
    return appState.dailyObjective;
  }
  // New day — create objective based on current level
  const level = getLevelForXP(appState.totalXP);
  let obj: DailyObjective;
  if (level.level <= 2) {
    obj = { type: 'complete_chapter', description: 'Completa 1 capítulo hoy', target: 1, current: 0, date: today, completed: false };
  } else if (level.level <= 4) {
    obj = { type: 'get_stars', description: 'Consigue 2 estrellas en un capítulo', target: 2, current: 0, date: today, completed: false };
  } else if (level.level <= 6) {
    obj = { type: 'complete_2chapters', description: 'Completa 2 capítulos hoy', target: 2, current: 0, date: today, completed: false };
  } else {
    obj = { type: 'get_stars', description: 'Consigue 3 estrellas en un capítulo', target: 3, current: 0, date: today, completed: false };
  }
  return obj;
}

export function updateDailyObjective(
  obj: DailyObjective,
  event: { isChapter: boolean; stars?: 1 | 2 | 3 }
): DailyObjective {
  if (obj.completed) return obj;
  let newCurrent = obj.current;
  if (obj.type === 'complete_chapter' && event.isChapter) {
    newCurrent += 1;
  } else if (obj.type === 'complete_2chapters' && event.isChapter) {
    newCurrent += 1;
  } else if (obj.type === 'get_stars' && event.isChapter && (event.stars ?? 0) >= obj.target) {
    newCurrent = obj.target; // mark as done
  }
  return { ...obj, current: Math.min(newCurrent, obj.target), completed: newCurrent >= obj.target };
}
