'use client';
import Mascot from './Mascot';
import { BADGE_DEFS, getCapRank, RANK_LABEL } from '@/lib/gamification';
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
}

const STAR_DISPLAY: Record<1 | 2 | 3, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' };

export default function SessionSummary({ mode, chapterTitle, stars, xpEarned, capState, newBadgeIds, accentColor, onGoToList, onGoToNextChapter }: Props) {
  const rank = getCapRank(capState);
  const newBadges = BADGE_DEFS.filter(b => newBadgeIds.includes(b.id));

  return (
    <div className="space-y-5 py-4 animate-pop-in">
      {/* Kleobot */}
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
      <div className="flex items-center justify-center gap-4">
        <div className="text-2xl">{STAR_DISPLAY[stars]}</div>
        <div
          className="px-5 py-2 rounded-full font-black text-white text-lg shadow"
          style={{ backgroundColor: accentColor }}
        >
          +{xpEarned} XP
        </div>
      </div>

      {/* Stars explanation */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600 text-center">
        {stars === 3 && <p>🌟 <strong>¡Perfecto!</strong> Lo dominaste a la primera sin ningún error.</p>}
        {stars === 2 && <p>⭐⭐ <strong>¡Muy bien!</strong> Lo superaste en el primer intento.</p>}
        {stars === 1 && <p>⭐ <strong>¡Bien hecho!</strong> Lo lograste después de practicar un poco más.</p>}
      </div>

      {/* Cap rank */}
      {rank && (
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Tu nivel en este cap</p>
          <p className="text-xl font-black text-gray-800">{RANK_LABEL[rank]}</p>
          <p className="text-xs text-gray-500 mt-1">
            {rank === 'gold' && '¡Todos los capítulos con 3 estrellas!'}
            {rank === 'silver' && 'Mayoría de capítulos con 2+ estrellas'}
            {rank === 'bronze' && 'Sigue practicando para mejorar tu rango'}
          </p>
        </div>
      )}

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
        <button
          onClick={onGoToList}
          className="w-full py-3 rounded-2xl font-black text-base transition-all active:scale-95 border-2 bg-white"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          ← {mode === 'final-test' ? 'Inicio' : 'Lista de capítulos'}
        </button>
      </div>
    </div>
  );
}
