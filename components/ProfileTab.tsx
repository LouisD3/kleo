'use client';

import { AppState } from '@/lib/types';
import { CAPS } from '@/lib/caps';
import { getLevelForXP, LEVELS, BADGE_DEFS } from '@/lib/gamification';
import Mascot from './Mascot';

interface Props {
  appState: AppState;
  maxXP: number;
  onReset: () => void;
}

export default function ProfileTab({ appState, maxXP, onReset }: Props) {
  const currentLevel = getLevelForXP(appState.totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1) ?? null;

  const levelProgress = nextLevel
    ? Math.min((appState.totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP), 1)
    : 1;

  // Stats
  const totalChapters = CAPS.reduce((sum, cap) => sum + cap.chapters.length, 0);
  const completedChapters = Object.values(appState.caps).reduce(
    (sum, cap) => sum + cap.chapters.filter(ch => ch.phase === 'complete').length, 0
  );
  const totalStars = Object.values(appState.caps).reduce(
    (sum, cap) => sum + cap.chapters.reduce((s, ch) => s + (ch.starRating ?? 0), 0), 0
  );
  const maxStars = totalChapters * 3;
  const unlockedBadges = (appState.unlockedBadgeIds ?? []).length;

  return (
    <div className="space-y-6 pb-6">
      {/* Avatar + level */}
      <div className="flex flex-col items-center pt-4 pb-2 space-y-3">
        <Mascot variant="inline" emotion="idle" size={80} />
        <div className="text-center">
          <p className="font-black text-xl text-gray-800">
            {currentLevel.emoji} {currentLevel.name}
          </p>
          <p className="text-sm text-gray-400 font-semibold">Nivel {currentLevel.level}</p>
        </div>
      </div>

      {/* Level progress card */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-black text-sm text-gray-700">Progreso de nivel</span>
          {nextLevel ? (
            <span className="text-xs text-gray-400 font-semibold">
              {appState.totalXP} / {nextLevel.minXP} XP → {nextLevel.emoji} {nextLevel.name}
            </span>
          ) : (
            <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full">
              ¡Nivel máximo!
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${levelProgress * 100}%`, backgroundColor: '#1CB0F6' }}
          />
        </div>
        {nextLevel && (
          <p className="text-xs text-gray-400 text-right">
            Faltan {nextLevel.minXP - appState.totalXP} XP para el siguiente nivel
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          emoji="⚡"
          value={`${appState.totalXP}`}
          label="XP total"
          sub={`de ${maxXP} posibles`}
          color="#FFD700"
        />
        <StatCard
          emoji="📚"
          value={`${completedChapters}/${totalChapters}`}
          label="Capítulos"
          sub="completados"
          color="#1CB0F6"
        />
        <StatCard
          emoji="⭐"
          value={`${totalStars}/${maxStars}`}
          label="Estrellas"
          sub="conseguidas"
          color="#FF9600"
        />
        <StatCard
          emoji="🏅"
          value={`${unlockedBadges}/${BADGE_DEFS.length}`}
          label="Logros"
          sub="desbloqueados"
          color="#58CC02"
        />
      </div>

      {/* Reset */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl font-black text-sm text-red-400 border-2 border-red-100 hover:bg-red-50 transition-colors"
        >
          Reiniciar progreso
        </button>
      </div>
    </div>
  );
}

function StatCard({
  emoji, value, label, sub, color,
}: {
  emoji: string; value: string; label: string; sub: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 flex flex-col items-center gap-1 text-center">
      <span className="text-2xl">{emoji}</span>
      <span className="font-black text-xl text-gray-800" style={{ color }}>{value}</span>
      <span className="font-black text-xs text-gray-700">{label}</span>
      <span className="text-xs text-gray-400">{sub}</span>
    </div>
  );
}
