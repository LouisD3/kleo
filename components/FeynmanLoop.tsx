'use client';

import { useState, useRef } from 'react';
import { Cap, CapState, EvaluationResult } from '@/lib/types';
import FeedbackDisplay from './FeedbackDisplay';
import TutorCard from './TutorCard';
import ReactMarkdown from 'react-markdown';

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

export default function FeynmanLoop({
  cap,
  capState,
  onComplete,
  onStateChange,
}: FeynmanLoopProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accentColor = COLOR_MAP[cap.color] ?? '#1CB0F6';
  const bgColor = BG_MAP[cap.color] ?? '#EFF9FE';

  const handleEvaluate = async () => {
    if (!capState.userExplanation.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'initial',
          capTitle: cap.title,
          keyConcepts: cap.keyConcepts,
          userExplanation: capState.userExplanation,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const evaluation: EvaluationResult = await res.json();

      const newAttemptCount = (capState.attemptCount ?? 0) + 1;

      if (evaluation.passed) {
        setShowCelebration(true);
        onStateChange({ phase: 'complete', evaluation, attemptCount: newAttemptCount });
        setTimeout(() => {
          setShowCelebration(false);
          onComplete(cap.xpReward);
        }, 3500);
      } else {
        setFollowUpAnswers(new Array(evaluation.followUpQuestions.length).fill(''));
        onStateChange({ phase: 'feedback', evaluation, attemptCount: newAttemptCount });
      }
    } catch {
      setError('Hubo un error al evaluar tu respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (followUpAnswers.some((a) => !a.trim())) return;
    setIsLoading(true);
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
          answers: followUpAnswers,
          gaps: capState.evaluation?.gaps ?? [],
        }),
      });

      if (!res.ok) throw new Error('API error');
      const result: EvaluationResult = await res.json();

      if (result.passed) {
        setShowCelebration(true);
        onStateChange({ phase: 'complete', evaluation: result });
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
    }
  };

  const handleRetryFromTutoring = () => {
    onStateChange({ userExplanation: '', phase: 'write' });
  };

  // Phase: READ
  if (capState.phase === 'read') {
    return (
      <div className="space-y-6">
        <div
          className="rounded-3xl p-6 border-2"
          style={{ background: bgColor, borderColor: accentColor }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{cap.emoji}</span>
            <div>
              <h2 className="font-black text-2xl text-gray-800">{cap.title}</h2>
              <p className="text-sm text-gray-500 font-semibold">{cap.subtitle}</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed prose-headings:font-black prose-strong:font-black prose-strong:text-gray-800 prose-li:text-gray-700">
            <ReactMarkdown>{cap.explanation}</ReactMarkdown>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-blue-800 font-bold text-sm">
            💡 Lee con atención. Cuando termines, tendrás que explicarlo con tus propias palabras.
          </p>
        </div>

        <button
          onClick={() => onStateChange({ phase: 'write' })}
          className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all duration-150 active:scale-95 hover:scale-[1.02] shadow-lg"
          style={{ background: accentColor, boxShadow: `0 6px 0 ${accentColor}88` }}
        >
          ¡Ya lo entendí! →
        </button>
      </div>
    );
  }

  // Phase: WRITE
  if (capState.phase === 'write') {
    // Get uncovered concepts from last evaluation for reminder banner
    const uncoveredConcepts = capState.evaluation?.conceptChecks
      ?.filter((c) => !c.covered)
      .map((c) => c.concept) ?? [];
    const showReminder = uncoveredConcepts.length > 0;

    return (
      <div className="space-y-5">
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
          className="w-full h-44 p-4 rounded-2xl border-3 border-gray-200 focus:border-blue-400 focus:outline-none resize-none text-gray-800 text-sm leading-relaxed font-medium transition-all"
          style={{ borderWidth: '2px' }}
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
            onClick={() => onStateChange({ phase: 'read' })}
            className="flex-1 py-3 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
          >
            ← Releer
          </button>
          <button
            onClick={handleEvaluate}
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
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-5xl mb-2">🤔</div>
          <h2 className="font-black text-xl text-gray-800">¡Casi lo tienes!</h2>
          <p className="text-gray-500 text-sm mt-1">Aquí está el resumen de tu respuesta:</p>
        </div>

        <FeedbackDisplay evaluation={capState.evaluation} accentColor={accentColor} />

        {capState.evaluation.followUpQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-black text-gray-700 text-base">
                🎯 Responde estas preguntas para completar el cap:
              </p>
            </div>

            {capState.evaluation.followUpQuestions.map((question, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-gray-200 bg-white p-4 space-y-3 shadow-sm"
              >
                <p className="font-bold text-gray-700 text-sm leading-relaxed">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-black mr-2"
                    style={{ background: accentColor }}
                  >
                    {i + 1}
                  </span>
                  {question}
                </p>
                <textarea
                  value={followUpAnswers[i] ?? ''}
                  onChange={(e) => {
                    const newAnswers = [...followUpAnswers];
                    newAnswers[i] = e.target.value;
                    setFollowUpAnswers(newAnswers);
                  }}
                  placeholder="Tu respuesta..."
                  className="w-full h-24 p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none resize-none text-gray-700 text-sm transition-all"
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleFollowUpSubmit}
              disabled={followUpAnswers.some((a) => !a.trim()) || isLoading}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-150 active:scale-95 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: accentColor, boxShadow: `0 6px 0 ${accentColor}88` }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                '¡Enviar respuestas! 💪'
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Phase: TUTORING
  if (capState.phase === 'tutoring' && capState.evaluation) {
    return (
      <div className="space-y-5">
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
    return (
      <div className="text-center space-y-6 py-8">
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
          +{cap.xpReward} XP ⭐
        </div>
        <div className="flex justify-center gap-3 text-4xl animate-pulse">
          <span>⭐</span><span>🌟</span><span>⭐</span>
        </div>
      </div>
    );
  }

  return null;
}
