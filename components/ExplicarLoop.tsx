'use client';
import { useState } from 'react';
import { LearningContent, ExplicarAnswer } from '@/lib/types';

interface Props {
  content: LearningContent;
  accentColor: string;
  bgColor: string;
  initialAnswers: ExplicarAnswer[];
  onComplete: (answers: ExplicarAnswer[]) => void;
}

const QUESTIONS_PER_CONCEPT = 3;

export default function ExplicarLoop({ content, accentColor, bgColor, initialAnswers, onComplete }: Props) {
  const startConcept = Math.floor(initialAnswers.length / QUESTIONS_PER_CONCEPT);
  const startQuestion = initialAnswers.length % QUESTIONS_PER_CONCEPT;

  const [conceptIndex, setConceptIndex] = useState(startConcept);
  const [questionIndex, setQuestionIndex] = useState(startQuestion);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<ExplicarAnswer[]>(initialAnswers);

  const totalConcepts = content.keyConcepts.length;
  const currentQuestion = content.explicarQuestions[conceptIndex]?.[questionIndex];
  const isLast =
    conceptIndex === totalConcepts - 1 && questionIndex === QUESTIONS_PER_CONCEPT - 1;
  const completedConcepts = Math.floor(answers.length / QUESTIONS_PER_CONCEPT);

  function handleNext() {
    if (!currentAnswer.trim()) return;

    const newAnswer: ExplicarAnswer = {
      conceptIndex,
      questionIndex,
      question: currentQuestion.question,
      answer: currentAnswer.trim(),
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers);
      return;
    }

    if (questionIndex + 1 < QUESTIONS_PER_CONCEPT) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setConceptIndex(conceptIndex + 1);
      setQuestionIndex(0);
    }
    setCurrentAnswer('');
  }

  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: totalConcepts }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < completedConcepts ? 'bg-green-500' : 'bg-gray-200'
            }`}
            style={i === conceptIndex && i >= completedConcepts ? { backgroundColor: accentColor } : {}}
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 font-medium">
        Concepto {conceptIndex + 1}/{totalConcepts} · Pregunta {questionIndex + 1}/{QUESTIONS_PER_CONCEPT}
      </p>

      <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: bgColor }}>
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">{content.emoji}</span>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide leading-snug">
            {content.keyConcepts[conceptIndex]}
          </p>
        </div>
        <p className="text-gray-800 font-semibold text-base leading-snug">
          {currentQuestion?.question}
        </p>
      </div>

      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        className="w-full min-h-[120px] p-4 border-2 rounded-xl resize-none focus:outline-none text-gray-800 text-sm leading-relaxed transition-colors"
        style={{ borderColor: currentAnswer.trim() ? accentColor : '#E5E7EB' }}
      />

      <button
        onClick={handleNext}
        disabled={!currentAnswer.trim()}
        className="w-full py-3 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: accentColor }}
      >
        {isLast ? '¡Listo! 🚀' : 'Siguiente →'}
      </button>
    </div>
  );
}
