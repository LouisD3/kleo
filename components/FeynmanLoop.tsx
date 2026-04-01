'use client';

import { useState } from 'react';
import { LearningContent, ChapterState, FinalTestState, ExplicarAnswer } from '@/lib/types';
import ConceptLoop from './ConceptLoop';
import ExplicarLoop from './ExplicarLoop';
import RevisarLoop from './RevisarLoop';
import PhaseStepBar from './PhaseStepBar';
import Mascot from './Mascot';

interface FeynmanLoopProps {
  content: LearningContent;
  state: ChapterState | FinalTestState;
  mode: 'chapter' | 'final-test';
  onComplete: (xp: number) => void;
  onStateChange: (updates: Partial<ChapterState> | Partial<FinalTestState>) => void;
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

export default function FeynmanLoop({
  content,
  state,
  mode,
  onComplete,
  onStateChange,
}: FeynmanLoopProps) {
  const accentColor = COLOR_MAP[content.color] ?? '#1CB0F6';
  const bgColor = BG_MAP[content.color] ?? '#EFF9FE';


  // For chapter: 4 steps (0=conceptos, 1=explicar, 2=revisar, 3=complete)
  // For final-test: 3 steps (0=explicar, 1=revisar, 2=complete)
  function getPhaseStep(): 0 | 1 | 2 | 3 {
    if (mode === 'final-test') {
      const map: Record<string, 0 | 1 | 2> = {
        explicar: 0,
        revisar: 1,
        complete: 2,
      };
      return (map[state.phase] ?? 0) as 0 | 1 | 2 | 3;
    }
    const map: Record<string, 0 | 1 | 2 | 3> = {
      conceptos: 0,
      explicar: 1,
      revisar: 2,
      complete: 3,
    };
    return map[state.phase] ?? 0;
  }

  const currentStep = getPhaseStep();

  // ── Conceptos (chapter only) ─────────────────────────────────────────────────
  if (mode === 'chapter' && state.phase === 'conceptos') {
    return (
      <div className="space-y-4">
        <Mascot emotion="idle" />
        <PhaseStepBar currentStep={0} accentColor={accentColor} mode="chapter" />
        <ConceptLoop
          content={content}
          accentColor={accentColor}
          bgColor={bgColor}
          onComplete={() => onStateChange({ phase: 'explicar' })}
        />
      </div>
    );
  }

  // ── Explicar ─────────────────────────────────────────────────────────────────
  if (state.phase === 'explicar') {
    const stepIndex = mode === 'final-test' ? 0 : 1;
    return (
      <div className="space-y-4">
        <Mascot emotion="idle" />
        <PhaseStepBar currentStep={stepIndex as 0 | 1 | 2 | 3} accentColor={accentColor} mode={mode} />
        <div className="text-center mb-2">
          <h2 className="font-black text-xl text-gray-800">
            {mode === 'final-test' ? 'Prueba Final' : 'Explícalo tú'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'final-test'
              ? 'Demuestra todo lo que aprendiste en este cap'
              : 'Responde cada pregunta con tus propias palabras'}
          </p>
        </div>
        <ExplicarLoop
          content={content}
          accentColor={accentColor}
          bgColor={bgColor}
          initialAnswers={(state as ChapterState).explicarAnswers ?? []}
          onComplete={(answers: ExplicarAnswer[]) =>
            onStateChange({ phase: 'revisar', explicarAnswers: answers })
          }
        />
      </div>
    );
  }

  // ── Revisar ──────────────────────────────────────────────────────────────────
  // Pas de mascot flottant ici : EvaluatingScreen et la barre de feedback
  // affichent chacun leur propre mascot inline.
  if (state.phase === 'revisar') {
    const stepIndex = mode === 'final-test' ? 1 : 2;
    return (
      <div className="space-y-4">
        <PhaseStepBar currentStep={stepIndex as 0 | 1 | 2 | 3} accentColor={accentColor} mode={mode} />
        <div className="text-center mb-2">
          <h2 className="font-black text-xl text-gray-800">Revisemos juntos</h2>
          <p className="text-gray-500 text-sm mt-1">
            El tutor revisará tu comprensión de los conceptos
          </p>
        </div>
        <RevisarLoop
          key={`revisar-${state.attemptCount ?? 0}`}
          capTitle={content.title}
          capEmoji={content.emoji}
          keyConcepts={content.keyConcepts}
          accentColor={accentColor}
          bgColor={bgColor}
          explicarAnswers={(state as ChapterState).explicarAnswers ?? []}
          loopCount={state.attemptCount ?? 0}
          onComplete={(stars: 1 | 2 | 3) => {
            onStateChange({ phase: 'complete', starRating: stars });
            setTimeout(() => onComplete(content.xpReward), 3500);
          }}
          onLoopCountIncrement={() => {
            const newCount = (state.attemptCount ?? 0) + 1;
            onStateChange({ attemptCount: newCount });
          }}
          onResetToConceptos={() => {
            if (mode === 'chapter') {
              onStateChange({ phase: 'conceptos', explicarAnswers: [], attemptCount: 0 });
            } else {
              // Final test: reset to explicar (no conceptos)
              onStateChange({ phase: 'explicar', explicarAnswers: [], attemptCount: 0 });
            }
          }}
        />
      </div>
    );
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  if (state.phase === 'complete') {
    const stepIndex = mode === 'final-test' ? 2 : 3;

    const stars = state.starRating ?? 1;
    const starDisplay = stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐';

    return (
      <div className="text-center space-y-5 py-8">
        <PhaseStepBar currentStep={stepIndex as 0 | 1 | 2 | 3} accentColor={accentColor} mode={mode} />

        {/* Kleobot célèbre — grand format centré */}
        <div className="flex justify-center mt-2">
          <Mascot variant="inline" emotion="celebrate" size={140} />
        </div>

        <div>
          <h2 className="font-black text-3xl text-gray-800">
            {mode === 'final-test' ? '¡Cap completado!' : '¡Capítulo superado!'}
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Dominaste <strong>{content.title}</strong>
          </p>
        </div>
        <div
          className="inline-block px-6 py-3 rounded-full font-black text-white text-xl shadow-lg"
          style={{ background: accentColor }}
        >
          +{content.xpReward} XP {starDisplay}
        </div>
      </div>
    );
  }

  return null;
}
