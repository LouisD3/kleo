'use client';

import { Cap, CapState, ExplicarAnswer } from '@/lib/types';
import ConceptLoop from './ConceptLoop';
import ExplicarLoop from './ExplicarLoop';
import RevisarLoop from './RevisarLoop';
import PhaseStepBar from './PhaseStepBar';

interface FeynmanLoopProps {
  cap: Cap;
  capState: CapState;
  onComplete: (xp: number) => void;
  onStateChange: (newState: Partial<CapState>) => void;
}

const COLOR_MAP: Record<string, string> = {
  blue: '#1CB0F6',
  yellow: '#FFD700',
  green: '#58CC02',
};

const BG_MAP: Record<string, string> = {
  blue: '#EFF9FE',
  yellow: '#FFFDE7',
  green: '#F0FFF0',
};

function getPhaseStep(phase: string): 0 | 1 | 2 | 3 {
  const map: Record<string, 0 | 1 | 2 | 3> = {
    conceptos: 0,
    explicar: 1,
    revisar: 2,
    complete: 3,
  };
  return map[phase] ?? 0;
}

export default function FeynmanLoop({
  cap,
  capState,
  onComplete,
  onStateChange,
}: FeynmanLoopProps) {
  const accentColor = COLOR_MAP[cap.color] ?? '#1CB0F6';
  const bgColor = BG_MAP[cap.color] ?? '#EFF9FE';
  const currentStep = getPhaseStep(capState.phase);

  // ── Conceptos ───────────────────────────────────────────────────────────────
  if (capState.phase === 'conceptos') {
    return (
      <div className="space-y-4">
        <PhaseStepBar currentStep={0} accentColor={accentColor} />
        <ConceptLoop
          cap={cap}
          accentColor={accentColor}
          bgColor={bgColor}
          onComplete={() => onStateChange({ phase: 'explicar' })}
        />
      </div>
    );
  }

  // ── Explicar ─────────────────────────────────────────────────────────────────
  if (capState.phase === 'explicar') {
    return (
      <div className="space-y-4">
        <PhaseStepBar currentStep={1} accentColor={accentColor} />
        <div className="text-center mb-2">
          <h2 className="font-black text-xl text-gray-800">Explícalo tú</h2>
          <p className="text-gray-500 text-sm mt-1">
            Responde cada pregunta con tus propias palabras
          </p>
        </div>
        <ExplicarLoop
          cap={cap}
          accentColor={accentColor}
          bgColor={bgColor}
          initialAnswers={capState.explicarAnswers ?? []}
          onComplete={(answers: ExplicarAnswer[]) =>
            onStateChange({ phase: 'revisar', explicarAnswers: answers })
          }
        />
      </div>
    );
  }

  // ── Revisar ──────────────────────────────────────────────────────────────────
  if (capState.phase === 'revisar') {
    return (
      <div className="space-y-4">
        <PhaseStepBar currentStep={2} accentColor={accentColor} />
        <div className="text-center mb-2">
          <h2 className="font-black text-xl text-gray-800">Revisemos juntos</h2>
          <p className="text-gray-500 text-sm mt-1">
            El tutor revisará tu comprensión de los conceptos
          </p>
        </div>
        <RevisarLoop
          key={`revisar-${capState.attemptCount ?? 0}`}
          cap={cap}
          accentColor={accentColor}
          bgColor={bgColor}
          explicarAnswers={capState.explicarAnswers ?? []}
          loopCount={capState.attemptCount ?? 0}
          onComplete={(stars: 1 | 2 | 3) => {
            onStateChange({ phase: 'complete', starRating: stars });
            setTimeout(() => onComplete(cap.xpReward), 3500);
          }}
          onLoopCountIncrement={() => {
            const newCount = (capState.attemptCount ?? 0) + 1;
            onStateChange({ attemptCount: newCount });
          }}
          onResetToConceptos={() => {
            onStateChange({ phase: 'conceptos', explicarAnswers: [], attemptCount: 0 });
          }}
        />
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  if (capState.phase === 'complete') {
    const stars = capState.starRating ?? 1;
    const starDisplay = stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐';

    return (
      <div className="text-center space-y-6 py-8">
        <PhaseStepBar currentStep={3} accentColor={accentColor} />
        <div className="text-8xl animate-bounce">🏆</div>
        <div>
          <h2 className="font-black text-3xl text-gray-800">¡Nivel completado!</h2>
          <p className="text-gray-500 mt-2 text-base">
            Dominaste <strong>{cap.title}</strong>
          </p>
        </div>
        <div
          className="inline-block px-6 py-3 rounded-full font-black text-white text-xl shadow-lg"
          style={{ background: accentColor }}
        >
          +{cap.xpReward} XP {starDisplay}
        </div>
        <div className="flex justify-center gap-3 text-4xl animate-pulse">
          <span>⭐</span>
          <span>🌟</span>
          <span>⭐</span>
        </div>
      </div>
    );
  }

  return null;
}
