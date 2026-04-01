'use client';
import { useState, useMemo } from 'react';
import { LearningContent, ExplicarAnswer } from '@/lib/types';
import Mascot from './Mascot';

const ENCOURAGEMENTS = [
  '¡Tú puedes! Escribe lo que sabes.',
  'No hay respuestas incorrectas aquí.',
  '¡Explícalo con tus propias palabras!',
  '¡Piensa y escribe, lo estás haciendo genial!',
  'Describe lo que recuerdas, ¡así se aprende!',
  '¡Cada idea cuenta!',
  'Sin prisa, con calma. ¡Tú lo tienes!',
];

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
  const encouragement = useMemo(
    () => ENCOURAGEMENTS[(conceptIndex * 3 + questionIndex) % ENCOURAGEMENTS.length],
    [conceptIndex, questionIndex]
  );
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
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((conceptIndex + (questionIndex / QUESTIONS_PER_CONCEPT)) / totalConcepts) * 100}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      <p className="text-center text-sm text-gray-500 font-medium">
        Concepto {conceptIndex + 1}/{totalConcepts} · Pregunta {questionIndex + 1}/{QUESTIONS_PER_CONCEPT}
      </p>

      <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: bgColor }}>
        <div className="flex items-center gap-3">
          <Mascot variant="inline" emotion="idle" size={48} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide leading-snug">
              {content.keyConcepts[conceptIndex]}
            </p>
            <p className="text-xs text-gray-400 italic mt-0.5">{encouragement}</p>
          </div>
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
