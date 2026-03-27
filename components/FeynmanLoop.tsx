'use client';

import { useState, useRef } from 'react';
import { Cap, CapState, EvaluationResult } from '@/lib/types';
import FeedbackDisplay from './FeedbackDisplay';
import TutorCard from './TutorCard';
import ConceptLoop from './ConceptLoop';
import EvaluatingScreen from './EvaluatingScreen';
import PhaseStepBar from './PhaseStepBar';
import SequentialQuestions from './SequentialQuestions';

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

function getEncouragementMessage(covered: number, total: number) {
  if (covered === total) return { text: '¡Increíble! ¡Lo entendiste todo! 🌟', color: 'text-green-600' };
  if (covered / total >= 5 / 7) return { text: '¡Casi perfecto! Solo te faltó un poquito 💪', color: 'text-blue-600' };
  if (covered / total >= 3 / 7) return { text: '¡Buen intento! Vamos a reforzar esto 🔍', color: 'text-yellow-600' };
  return { text: '¡Sigue así! Cada intento te enseña algo nuevo 🚀', color: 'text-red-500' };
}

export default function FeynmanLoop({
  cap,
  capState,
  onComplete,
  onStateChange,
}: FeynmanLoopProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  // Track whether initial eval passed directly (no followup needed) for star rating
  const initialPassedDirectly = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accentColor = COLOR_MAP[cap.color] ?? '#1CB0F6';
  const bgColor = BG_MAP[cap.color] ?? '#EFF9FE';

  // Determine PhaseStepBar step
  function getPhaseStep(): 0 | 1 | 2 | 3 {
    const phase = capState.phase;
    const attemptCount = capState.attemptCount ?? 0;
    if (phase === 'read' || (phase === 'write' && attemptCount === 0)) return 0;
    if (phase === 'write' && attemptCount > 0) return 1;
    if (phase === 'feedback' || phase === 'questions' || phase === 'tutoring') return 2;
    if (phase === 'complete') return 3;
    return 0;
  }

  const handleEvaluate = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'initial',
          capTitle: cap.title,
          keyConcepts: cap.keyConcepts,
          userExplanation: text,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const evaluation: EvaluationResult = await res.json();

      const newAttemptCount = (capState.attemptCount ?? 0) + 1;

      if (evaluation.passed) {
        // Direct pass — compute star rating
        // 3 stars if first attempt (attemptCount was 0 before this), else 1 star
        const starRating: 1 | 3 = newAttemptCount === 1 ? 3 : 1;
        initialPassedDirectly.current = true;
        setShowCelebration(true);
        onStateChange({ phase: 'complete', evaluation, attemptCount: newAttemptCount, starRating });
        setTimeout(() => {
          setShowCelebration(false);
          onComplete(cap.xpReward);
        }, 3500);
      } else {
        initialPassedDirectly.current = false;
        setFollowUpAnswers(new Array(evaluation.followUpQuestions.length).fill(''));
        onStateChange({ phase: 'feedback', evaluation, attemptCount: newAttemptCount });
      }
    } catch {
      setError('Hubo un error al evaluar tu respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setIsEvaluating(false);
    }
  };

  const handleFollowUpSubmit = async (answers: string[]) => {
    setIsLoading(true);
    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'followup',
          capTitle: cap.title,
          keyConcepts: cap.keyConcepts,
          questions: capState.evaluation?.followUpQuestions ?? [],
          answers: answers,
          gaps: capState.evaluation?.gaps ?? [],
        }),
      });

      if (!res.ok) throw new Error('API error');
      const result: EvaluationResult = await res.json();

      if (result.passed) {
        // Passed via follow-up: 2 stars if attempt was 1 (first attempt), else 1 star
        const currentAttemptCount = capState.attemptCount ?? 1;
        const starRating: 1 | 2 = currentAttemptCount <= 1 ? 2 : 1;
        setShowCelebration(true);
        onStateChange({ phase: 'complete', evaluation: result, starRating });
        setTimeout(() => {
          setShowCelebration(false);
          onComplete(cap.xpReward);
        }, 3500);
      } else {
        onStateChange({ phase: 'tutoring', evaluation: result });
      }
    } catch {
      setError('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setIsEvaluating(false);
    }
  };

  const handleRetryFromTutoring = () => {
    onStateChange({ userExplanation: '', phase: 'write' });
  };

  // Phase: READ or first-time WRITE → ConceptLoop
  if (capState.phase === 'read' || (capState.phase === 'write' && (capState.attemptCount ?? 0) === 0)) {
    return (
      <div className="relative space-y-4">
        {isEvaluating && <EvaluatingScreen emoji={cap.emoji} />}
        <PhaseStepBar currentStep={0} accentColor={accentColor} />
        <ConceptLoop
          cap={cap}
          accentColor={accentColor}
          bgColor={bgColor}
          onComplete={(combinedText) => {
            onStateChange({ userExplanation: combinedText, phase: 'write' });
            handleEvaluate(combinedText);
          }}
        />
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Phase: WRITE (retry attempt, attemptCount > 0)
  if (capState.phase === 'write') {
    const uncoveredConcepts = capState.evaluation?.conceptChecks
      ?.filter((c) => !c.covered)
      .map((c) => c.concept) ?? [];
    const showReminder = uncoveredConcepts.length > 0;

    return (
      <div className="relative space-y-5">
        {isEvaluating && <EvaluatingScreen emoji={cap.emoji} />}
        <PhaseStepBar currentStep={1} accentColor={accentColor} />

        <div className="text-center">
          <div className="text-5xl mb-3">✍️</div>
          <h2 className="font-black text-2xl text-gray-800">¡Explícalo tú!</h2>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed">
            Imagina que le explicas <strong>{cap.title}</strong> a un amigo de 10 años.
            Usa tus propias palabras, sin releer el texto.
          </p>
        </div>

        {showReminder && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
            <p className="font-black text-amber-800 text-sm mb-2">
              Recuerda cubrir estos conceptos:
            </p>
            <ul className="space-y-1">
              {uncoveredConcepts.map((concept, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="flex-shrink-0">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
            {(capState.attemptCount ?? 0) > 0 && (
              <p className="text-xs text-amber-600 mt-2 font-semibold">
                Intento #{(capState.attemptCount ?? 0) + 1}
              </p>
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={capState.userExplanation}
          onChange={(e) => onStateChange({ userExplanation: e.target.value })}
          placeholder={`Escribe tu explicación de ${cap.title} aquí...`}
          className="w-full h-44 p-4 rounded-2xl border-gray-200 focus:border-blue-400 focus:outline-none resize-none text-gray-800 text-sm leading-relaxed font-medium transition-all"
          style={{ borderWidth: '2px', borderStyle: 'solid' }}
        />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{capState.userExplanation.length} caracteres</span>
          <span>Mínimo 50 caracteres para enviar</span>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => onStateChange({ phase: 'feedback' })}
            className="flex-1 py-3 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
          >
            ← Volver
          </button>
          <button
            onClick={() => handleEvaluate(capState.userExplanation)}
            disabled={capState.userExplanation.trim().length < 50 || isLoading}
            className="flex-[2] py-3 rounded-2xl font-black text-white text-base transition-all duration-150 active:scale-95 hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: accentColor, boxShadow: `0 5px 0 ${accentColor}88` }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluando...
              </span>
            ) : (
              '¡Evalúa mi respuesta! 🚀'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Phase: FEEDBACK (gaps detected, follow-up questions)
  if (capState.phase === 'feedback' && capState.evaluation) {
    const conceptChecks = capState.evaluation.conceptChecks ?? [];
    const coveredCount = conceptChecks.filter((c) => c.covered).length;
    const totalConcepts = conceptChecks.length || cap.keyConcepts.length;
    const encouragement = getEncouragementMessage(coveredCount, totalConcepts);

    return (
      <div className="relative space-y-5">
        {isEvaluating && <EvaluatingScreen emoji={cap.emoji} />}
        <PhaseStepBar currentStep={2} accentColor={accentColor} />

        <div className="text-center">
          <div className="text-5xl mb-2">🤔</div>
          <h2 className="font-black text-xl text-gray-800">¡Casi lo tienes!</h2>
          <p className={`text-sm mt-1 font-semibold ${encouragement.color}`}>{encouragement.text}</p>
        </div>

        <FeedbackDisplay evaluation={capState.evaluation} accentColor={accentColor} />

        {capState.evaluation.followUpQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-black text-gray-700 text-base">
                🎯 Responde estas preguntas para completar el cap:
              </p>
            </div>

            <SequentialQuestions
              questions={capState.evaluation.followUpQuestions}
              accentColor={accentColor}
              isLoading={isLoading}
              onSubmit={handleFollowUpSubmit}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Phase: QUESTIONS (alias to feedback with questions)
  if (capState.phase === 'questions' && capState.evaluation) {
    return (
      <div className="relative space-y-5">
        {isEvaluating && <EvaluatingScreen emoji={cap.emoji} />}
        <PhaseStepBar currentStep={2} accentColor={accentColor} />

        <div className="text-center">
          <p className="font-black text-gray-700 text-base">
            🎯 Responde estas preguntas para completar el cap:
          </p>
        </div>

        <SequentialQuestions
          questions={capState.evaluation.followUpQuestions}
          accentColor={accentColor}
          isLoading={isLoading}
          onSubmit={handleFollowUpSubmit}
        />

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Phase: TUTORING
  if (capState.phase === 'tutoring' && capState.evaluation) {
    return (
      <div className="relative space-y-5">
        <PhaseStepBar currentStep={2} accentColor={accentColor} />

        <div className="text-center">
          <div className="text-5xl mb-2">📚</div>
          <h2 className="font-black text-xl text-gray-800">Sigamos aprendiendo</h2>
          <p className="text-gray-500 text-sm mt-1">
            Aquí tienes una explicación de los conceptos que te faltaron:
          </p>
        </div>

        <TutorCard
          tutorExplanation={capState.evaluation.tutorExplanation ?? ''}
          accentColor={accentColor}
          bgColor={bgColor}
          onRetry={handleRetryFromTutoring}
          attemptCount={capState.attemptCount ?? 1}
        />
      </div>
    );
  }

  // Phase: COMPLETE (celebration shown before onComplete is called)
  if (capState.phase === 'complete') {
    const starRating = capState.starRating ?? 1;
    const starDisplay = starRating === 3 ? '⭐⭐⭐' : starRating === 2 ? '⭐⭐' : '⭐';

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
          <span>⭐</span><span>🌟</span><span>⭐</span>
        </div>
      </div>
    );
  }

  return null;
}
