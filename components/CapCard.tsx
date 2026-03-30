'use client';

import { Cap, CapState } from '@/lib/types';

interface CapCardProps {
  cap: Cap;
  capState: CapState;
  isActive: boolean;
  onClick: () => void;
}

const COLOR_MAP: Record<string, { accent: string; light: string; dark: string }> = {
  blue: { accent: '#1CB0F6', light: '#EFF9FE', dark: '#0E86B8' },
  yellow: { accent: '#FFC800', light: '#FFF9E0', dark: '#CC9E00' },
  green: { accent: '#58CC02', light: '#F0FFF0', dark: '#3D9000' },
};

function getProgressLabel(capState: CapState, cap: Cap): string {
  if (capState.status === 'unlocked') return '¡Completado!';
  const completedChapters = capState.chapters.filter((c) => c.phase === 'complete').length;
  const totalChapters = cap.chapters.length;
  if (capState.finalTest.phase === 'complete') return '¡Completado!';
  if (completedChapters >= totalChapters) return 'Prueba Final';
  const activeChapter = cap.chapters[completedChapters];
  return `Cap. ${completedChapters + 1}: ${activeChapter.title}`;
}

function getProgressPercent(capState: CapState, cap: Cap): number {
  if (capState.status === 'unlocked') return 100;
  const total = cap.chapters.length + 1; // chapters + finalTest
  let completed = capState.chapters.filter((c) => c.phase === 'complete').length;
  if (capState.finalTest.phase === 'complete') completed++;
  return Math.round((completed / total) * 100);
}

export default function CapCard({ cap, capState, isActive, onClick }: CapCardProps) {
  const colors = COLOR_MAP[cap.color] ?? COLOR_MAP.blue;
  const isLocked = capState.status === 'locked';
  const isUnlocked = capState.status === 'unlocked';
  const inProgress = capState.status === 'in-progress';
  const progressLabel = getProgressLabel(capState, cap);
  const progressPercent = getProgressPercent(capState, cap);

  // Star rating from final test
  const starRating = capState.finalTest.starRating;

  return (
    <div className="flex flex-col items-center relative">
      {cap.id > 1 && (
        <div
          className="w-1 h-8 rounded-full mb-2 transition-all duration-500"
          style={{
            background: isLocked ? '#E5E7EB' : colors.accent,
          }}
        />
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`
          relative w-full max-w-sm rounded-3xl p-5 text-left transition-all duration-200
          ${isLocked ? 'opacity-60 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
          ${isActive && !isLocked ? 'ring-4 ring-offset-2' : ''}
        `}
        style={{
          background: isLocked ? '#F3F4F6' : colors.light,
          border: `3px solid ${isLocked ? '#E5E7EB' : colors.accent}`,
          boxShadow: isLocked
            ? 'none'
            : `0 6px 0 ${colors.dark}`,
          ...(isActive && !isLocked ? { ringColor: colors.accent } : {}),
          animation: inProgress && !isActive ? 'pulse-border 2s infinite' : 'none',
        }}
      >
        {/* Badge */}
        {isUnlocked && (
          <div
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white"
            style={{ background: colors.accent }}
          >
            {starRating === 3 ? '⭐⭐⭐' : starRating === 2 ? '⭐⭐' : '⭐'}
          </div>
        )}
        {isLocked && (
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md bg-gray-300 border-2 border-white">
            🔒
          </div>
        )}
        {inProgress && !isActive && (
          <div
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white animate-bounce"
            style={{ background: colors.accent }}
          >
            ▶️
          </div>
        )}

        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
            style={{ background: isLocked ? '#E5E7EB' : 'white' }}
          >
            {cap.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: isLocked ? '#E5E7EB' : colors.accent,
                  color: isLocked ? '#9CA3AF' : 'white',
                }}
              >
                Cap {cap.id}
              </span>
              {!isLocked && (
                <span className="text-xs font-bold text-gray-400">
                  +{cap.xpReward} XP
                </span>
              )}
            </div>
            <h3
              className="font-black text-lg mt-1 leading-tight"
              style={{ color: isLocked ? '#9CA3AF' : '#1F2937' }}
            >
              {cap.title}
            </h3>
            <p
              className="text-xs mt-0.5 font-semibold"
              style={{ color: isLocked ? '#D1D5DB' : '#6B7280' }}
            >
              {cap.subtitle}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {!isLocked && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-1" style={{ color: colors.dark }}>
              <span>{progressLabel}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.dark})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Chapter mini progress dots */}
        {!isLocked && (
          <div className="mt-3 flex gap-1.5">
            {cap.chapters.map((_, i) => {
              const done = capState.chapters[i]?.phase === 'complete';
              return (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-all duration-500"
                  style={{ background: done ? colors.accent : '#E5E7EB' }}
                />
              );
            })}
            <div
              className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{ background: capState.finalTest.phase === 'complete' ? colors.accent : '#E5E7EB' }}
            />
          </div>
        )}
      </button>
    </div>
  );
}
