'use client';
import { useState, useEffect, useRef } from 'react';
import { ExplicarAnswer, RevisarItem } from '@/lib/types';
import EvaluatingScreen from './EvaluatingScreen';

interface Props {
  capTitle: string;
  capEmoji: string;
  keyConcepts: string[];
  accentColor: string;
  bgColor: string;
  explicarAnswers: ExplicarAnswer[];
  loopCount: number;
  onComplete: (stars: 1 | 2 | 3) => void;
  onResetToConceptos: () => void;
  onLoopCountIncrement: () => void;
}

interface CheckResult {
  correct: boolean;
  feedback: string;
  newQuestion: string | null;
}

export default function RevisarLoop({
  capTitle,
  capEmoji,
  keyConcepts,
  accentColor,
  bgColor,
  explicarAnswers,
  loopCount,
  onComplete,
  onResetToConceptos,
  onLoopCountIncrement,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(false);
  const [items, setItems] = useState<RevisarItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const failedCountRef = useRef(0);

  useEffect(() => {
    initRevisar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function initRevisar() {
    try {
      const byConceptMap: Record<
        number,
        { conceptIndex: number; concept: string; questionsAndAnswers: { question: string; answer: string }[] }
      > = {};

      for (const ans of explicarAnswers) {
        if (!byConceptMap[ans.conceptIndex]) {
          byConceptMap[ans.conceptIndex] = {
            conceptIndex: ans.conceptIndex,
            concept: keyConcepts[ans.conceptIndex],
            questionsAndAnswers: [],
          };
        }
        byConceptMap[ans.conceptIndex].questionsAndAnswers.push({
          question: ans.question,
          answer: ans.answer,
        });
      }

      const res = await fetch('/api/revisar/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capTitle,
          keyConcepts,
          explicarAnswers: Object.values(byConceptMap),
        }),
      });

      if (!res.ok) throw new Error('API error');
      const { items: fetchedItems } = (await res.json()) as { items: RevisarItem[] };

      if (fetchedItems.length === 0) {
        onComplete(3);
        return;
      }

      setItems(fetchedItems);
      setCurrentQuestion(fetchedItems[0].targetedQuestion);
      setIsLoading(false);
    } catch {
      setInitError(true);
      setIsLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!currentAnswer.trim() || isChecking) return;
    setIsChecking(true);

    const item = items[currentIndex];
    try {
      const res = await fetch('/api/revisar/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capTitle,
          concept: item.concept,
          targetedQuestion: currentQuestion,
          studentAnswer: currentAnswer.trim(),
          aiExplanation: item.aiExplanation,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const result: CheckResult = await res.json();
      setCheckResult(result);

      if (result.correct) {
        setTimeout(() => {
          const fc = failedCountRef.current;
          advanceToNext(fc);
        }, 1500);
      }
    } catch {
      setCheckResult({
        correct: false,
        feedback: 'Hubo un error. Por favor intenta de nuevo.',
        newQuestion: null,
      });
    } finally {
      setIsChecking(false);
    }
  }

  function handleContinueAfterWrong() {
    const result = checkResult!;

    if (!isRetrying && result.newQuestion && result.newQuestion.trim()) {
      setCurrentQuestion(result.newQuestion);
      setIsRetrying(true);
      setCurrentAnswer('');
      setCheckResult(null);
    } else {
      failedCountRef.current += 1;
      advanceToNext(failedCountRef.current);
    }
  }

  function advanceToNext(currentFailedCount: number) {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= items.length) {
      if (currentFailedCount === 0) {
        const stars: 1 | 2 | 3 = loopCount === 0 ? 2 : 1;
        onComplete(stars);
      } else {
        onLoopCountIncrement();
        if (loopCount + 1 >= 3) {
          onResetToConceptos();
        }
      }
    } else {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(items[nextIndex].targetedQuestion);
      setCurrentAnswer('');
      setCheckResult(null);
      setIsRetrying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-[400px]">
        <EvaluatingScreen emoji={capEmoji} />
      </div>
    );
  }

  if (initError) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-5xl">😕</div>
        <p className="text-red-600 font-semibold">Hubo un error al cargar. Por favor recarga la página.</p>
      </div>
    );
  }

  const item = items[currentIndex];

  const relevantExplicarAnswer = explicarAnswers.find(
    (a) => a.conceptIndex === item.conceptIndex && a.questionIndex === item.relevantQuestionIndex
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
        <span>
          Revisando concepto {currentIndex + 1} de {items.length}
        </span>
        {loopCount > 0 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            Intento {loopCount + 1}
          </span>
        )}
      </div>

      {relevantExplicarAnswer && (
        <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base">📝</span>
            <span className="font-bold text-gray-500 text-xs uppercase tracking-wide">
              Tu respondiste
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-snug">
            {relevantExplicarAnswer.question}
          </p>
          <p className="text-sm text-gray-700 italic leading-snug">
            &ldquo;{relevantExplicarAnswer.answer}&rdquo;
          </p>
        </div>
      )}

      <div className="rounded-2xl p-5 space-y-2" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-gray-700 text-sm">Explicación del tutor</span>
        </div>
        <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide">
          {item.concept}
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">{item.aiExplanation}</p>
      </div>

      {!checkResult && (
        <>
          <div
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: accentColor }}
          >
            <p className="font-semibold text-gray-800 text-sm leading-snug">{currentQuestion}</p>
            {isRetrying && (
              <p className="text-xs text-gray-400 mt-1">Nueva pregunta — ¡una oportunidad más!</p>
            )}
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full min-h-[100px] p-4 border-2 rounded-xl resize-none focus:outline-none text-gray-800 text-sm leading-relaxed transition-colors"
            style={{ borderColor: currentAnswer.trim() ? accentColor : '#E5E7EB' }}
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim() || isChecking}
            className="w-full py-3 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
          >
            {isChecking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Comprobando...
              </span>
            ) : (
              'Responder'
            )}
          </button>
        </>
      )}

      {checkResult && (
        <div
          className={`rounded-2xl p-4 space-y-3 border-2 ${
            checkResult.correct
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{checkResult.correct ? '✅' : '❌'}</span>
            <p
              className={`font-semibold text-sm leading-snug ${
                checkResult.correct ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {checkResult.feedback}
            </p>
          </div>

          {!checkResult.correct && (
            <button
              onClick={handleContinueAfterWrong}
              className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              {!isRetrying && checkResult.newQuestion && checkResult.newQuestion.trim()
                ? 'Intentar de nuevo →'
                : 'Continuar →'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
