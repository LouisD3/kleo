'use client';
import Mascot from './Mascot';
import { BADGE_DEFS, getCapRank, RANK_LABEL, CapRank } from '@/lib/gamification';
import { CapState } from '@/lib/types';

interface Props {
  mode: 'chapter' | 'final-test';
  chapterTitle: string;
  stars: 1 | 2 | 3;
  xpEarned: number;
  capState: CapState;
  newBadgeIds: string[];
  accentColor: string;
  onGoToList: () => void;
  onGoToNextChapter?: () => void;
  onRetry?: () => void;
}

const RANK_CONFIG: Record<CapRank, { bg: string; border: string; text: string }> = {
  gold:   { bg: '#FFFDE7', border: '#FDD835', text: '#F57F17' },
  silver: { bg: '#FAFAFA', border: '#B0BEC5', text: '#546E7A' },
  bronze: { bg: '#FFF3E0', border: '#FFCC80', text: '#E65100' },
};

export default function SessionSummary({
  mode, chapterTitle, stars, xpEarned, capState, newBadgeIds,
  accentColor, onGoToList, onGoToNextChapter, onRetry,
}: Props) {
  const rank = getCapRank(capState);
  const newBadges = BADGE_DEFS.filter(b => newBadgeIds.includes(b.id));

  const completedChapters = capState.chapters.filter(ch => ch.phase === 'complete' && ch.starRating);
  const totalCompleted = completedChapters.length;

  let rankProgressInfo: { current: number; total: number; nextRank: string; hint: string } | null = null;
  if (rank === 'bronze' && totalCompleted > 0) {
    const twoStarCount = completedChapters.filter(ch => (ch.starRating ?? 0) >= 2).length;
    rankProgressInfo = {
      current: twoStarCount,
      total: totalCompleted,
      nextRank: 'Plata 🥈',
      hint: 'Consigue 2⭐+ en la mayoría de capítulos',
    };
  } else if (rank === 'silver' && totalCompleted > 0) {
    const threeStarCount = completedChapters.filter(ch => ch.starRating === 3).length;
    rankProgressInfo = {
      current: threeStarCount,
      total: totalCompleted,
      nextRank: 'Oro 🥇',
      hint: 'Consigue 3⭐ en todos los capítulos',
    };
  }

  return (
    <div className="space-y-5 py-4 animate-pop-in">
      {/* Mascot */}
      <div className="flex justify-center">
        <Mascot variant="inline" emotion="celebrate" size={120} />
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="font-black text-2xl text-gray-800">
          {mode === 'final-test' ? '¡Cap completado!' : '¡Capítulo superado!'}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Dominaste <strong>{chapterTitle}</strong>
        </p>
      </div>

      {/* Stars + XP */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 flex flex-col items-center gap-3">
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <span
              key={i}
              className="text-4xl transition-all duration-300"
              style={{ opacity: i <= stars ? 1 : 0.2, filter: i <= stars ? 'none' : 'grayscale(1)' }}
            >
              ⭐
            </span>
          ))}
        </div>
        <div
          className="px-6 py-2 rounded-full font-black text-white text-xl shadow"
          style={{ backgroundColor: accentColor }}
        >
          +{xpEarned} XP
        </div>
        <p className="text-sm text-gray-500 text-center leading-snug">
          {stars === 3 && <><strong style={{ color: '#58CC02' }}>¡Perfecto!</strong> Lo dominaste a la primera sin ningún error.</>}
          {stars === 2 && <><strong style={{ color: accentColor }}>¡Muy bien!</strong> Lo superaste en el primer intento.</>}
          {stars === 1 && <><strong style={{ color: '#FF9600' }}>¡Bien hecho!</strong> Lo lograste después de practicar un poco más.</>}
        </p>
      </div>

      {/* Cap rank */}
      {rank && (() => {
        const cfg = RANK_CONFIG[rank];
        return (
          <div className="rounded-2xl border-2 p-4" style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}>
            <p className="text-xs uppercase tracking-wide font-bold text-center mb-1" style={{ color: cfg.text }}>
              Tu nivel en este cap
            </p>
            <p className="text-xl font-black text-center" style={{ color: cfg.text }}>
              {RANK_LABEL[rank]}
            </p>
            {rankProgressInfo && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: cfg.text }}>
                    Hacia {rankProgressInfo.nextRank}
                  </span>
                  <span className="text-xs font-bold" style={{ color: cfg.text }}>
                    {rankProgressInfo.current}/{rankProgressInfo.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: cfg.border }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(rankProgressInfo.current / rankProgressInfo.total) * 100}%`,
                      backgroundColor: cfg.text,
                    }}
                  />
                </div>
                <p className="text-xs text-center" style={{ color: cfg.text, opacity: 0.75 }}>
                  {rankProgressInfo.hint}
                </p>
              </div>
            )}
            {rank === 'gold' && (
              <p className="text-xs text-center mt-1" style={{ color: cfg.text, opacity: 0.75 }}>
                ¡Todos los capítulos con 3 estrellas!
              </p>
            )}
          </div>
        );
      })()}

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-bold text-center">¡Logros desbloqueados!</p>
          {newBadges.map(badge => (
            <div key={badge.id} className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <p className="font-black text-sm text-yellow-800">{badge.name}</p>
                <p className="text-xs text-yellow-700">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        {onGoToNextChapter && (
          <button
            onClick={onGoToNextChapter}
            className="w-full py-3 rounded-2xl font-black text-white text-base transition-all active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            Siguiente capítulo →
          </button>
        )}
        {onRetry && stars < 3 && (
          <button
            onClick={onRetry}
            className="w-full py-3 rounded-2xl font-black text-base transition-all active:scale-95 border-2 bg-white"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            🔄 Reintentar para 3 estrellas
          </button>
        )}
        <button
          onClick={onGoToList}
          className="w-full py-3 rounded-2xl font-black text-base transition-all active:scale-95 border-2 bg-white border-gray-200 text-gray-500"
        >
          ← {mode === 'final-test' ? 'Inicio' : 'Lista de capítulos'}
        </button>
      </div>
    </div>
  );
}
