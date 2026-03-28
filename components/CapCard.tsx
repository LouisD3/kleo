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

export default function CapCard({ cap, capState, isActive, onClick }: CapCardProps) {
  const colors = COLOR_MAP[cap.color] ?? COLOR_MAP.blue;
  const isLocked = capState.status === 'locked';
  const isUnlocked = capState.status === 'unlocked';
  const inProgress = capState.status === 'in-progress';

  const getProgressLabel = () => {
    if (isUnlocked) return '¡Completado!';
    if (capState.phase === 'conceptos') return 'Aprendiendo conceptos';
    if (capState.phase === 'explicar') return 'Explicando conceptos';
    if (capState.phase === 'revisar') return 'Revisando con tutor';
    if (capState.phase === 'complete') return '¡Dominado!';
    return 'En progreso';
  };

  const getProgressPercent = () => {
    if (isUnlocked) return 100;
    if (capState.phase === 'conceptos') return 10;
    if (capState.phase === 'explicar') return 45;
    if (capState.phase === 'revisar') return 75;
    if (capState.phase === 'complete') return 100;
    return 0;
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Connector line above (except first cap) */}
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
            {capState.starRating === 3
              ? '⭐⭐⭐'
              : capState.starRating === 2
              ? '⭐⭐'
              : '⭐'}
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
              <span>{getProgressLabel()}</span>
              <span>{getProgressPercent()}%</span>
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${getProgressPercent()}%`,
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.dark})`,
                }}
              />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
