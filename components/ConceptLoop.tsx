'use client';
import { useState } from 'react';
import { Cap } from '@/lib/types';

interface Props {
  cap: Cap;
  accentColor: string;
  bgColor: string;
  onComplete: (combinedText: string) => void;
}

type SubStep = 'read' | 'check' | 'write';

export default function ConceptLoop({ cap, accentColor, bgColor, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subStep, setSubStep] = useState<SubStep>('read');
  const [miniWrites, setMiniWrites] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [checkResult, setCheckResult] = useState<null | 'correct' | 'wrong'>(null);
  const [showReward, setShowReward] = useState(false);
  const [completedDots, setCompletedDots] = useState<boolean[]>(new Array(cap.conceptPages.length).fill(false));

  const total = cap.conceptPages.length;
  const page = cap.conceptPages[currentIndex];

  function handleCheckAnswer(index: 0 | 1) {
    if (index === page.quickCheck.correctIndex) {
      setCheckResult('correct');
      setTimeout(() => {
        setCheckResult(null);
        setSubStep('write');
        setCurrentAnswer('');
      }, 800);
    } else {
      setCheckResult('wrong');
    }
  }

  function handleMiniWrite() {
    if (currentAnswer.trim().length < 20) return;
    const newMiniWrites = [...miniWrites, currentAnswer.trim()];
    setMiniWrites(newMiniWrites);

    // Mark dot as completed
    const newDots = [...completedDots];
    newDots[currentIndex] = true;
    setCompletedDots(newDots);

    // Show reward
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      if (currentIndex + 1 < total) {
        setCurrentIndex(currentIndex + 1);
        setSubStep('read');
        setCheckResult(null);
        setCurrentAnswer('');
      } else {
        onComplete(newMiniWrites.join('\n\n'));
      }
    }, 1000);
  }

  return (
    <div className="relative">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-6">
        {cap.conceptPages.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              completedDots[i]
                ? 'bg-green-500 animate-pop-in scale-110'
                : i === currentIndex
                ? `bg-${accentColor}-500`
                : 'bg-gray-200'
            }`}
            style={
              i === currentIndex && !completedDots[i]
                ? { backgroundColor: accentColor }
                : {}
            }
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">
        Concepto {currentIndex + 1} / {total}
      </p>

      {/* Reward banner */}
      {showReward && (
        <div className="absolute inset-x-0 top-0 flex justify-center z-10 animate-slide-up">
          <div className="bg-green-100 text-green-700 font-bold px-6 py-3 rounded-2xl shadow-lg text-lg">
            ¡Bien hecho! 🌟
          </div>
        </div>
      )}

      {/* Sub-step: Read */}
      {subStep === 'read' && (
        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: bgColor }}>
          <div className="text-5xl text-center">{cap.emoji}</div>
          <h2 className="text-xl font-bold text-center text-gray-800">{page.name}</h2>
          <p className="text-gray-700 leading-relaxed text-center">{page.explanation}</p>
          <button
            onClick={() => setSubStep('check')}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            ¡Lo tengo! →
          </button>
        </div>
      )}

      {/* Sub-step: Quick check */}
      {subStep === 'check' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 text-center">¿Lo entendiste?</h3>
          <p className="text-gray-700 text-center">{page.quickCheck.question}</p>
          <div className="space-y-3">
            {page.quickCheck.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleCheckAnswer(i as 0 | 1)}
                className={`w-full py-3 px-5 rounded-xl font-medium border-2 transition-all ${
                  checkResult === 'correct' && i === page.quickCheck.correctIndex
                    ? 'border-green-500 bg-green-50 text-green-700 animate-pop-in'
                    : checkResult === 'wrong' && i !== page.quickCheck.correctIndex
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-400 text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {checkResult === 'wrong' && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3 text-center">
              💡 {page.quickCheck.hint}
            </p>
          )}
          {checkResult === 'correct' && (
            <p className="text-center text-green-600 font-bold animate-pop-in">¡Correcto! ✅</p>
          )}
        </div>
      )}

      {/* Sub-step: Mini-write */}
      {subStep === 'write' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 text-center">Ahora explícalo tú</h3>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Explícalo en tus propias palabras..."
            className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 text-gray-800"
          />
          <p className="text-xs text-gray-400 text-right">{currentAnswer.trim().length} / 20 caracteres mínimo</p>
          <button
            onClick={handleMiniWrite}
            disabled={currentAnswer.trim().length < 20}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={currentAnswer.trim().length >= 20 ? { backgroundColor: accentColor } : {}}
          >
            ¡Listo! →
          </button>
        </div>
      )}
    </div>
  );
}
