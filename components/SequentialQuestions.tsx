'use client';
import { useState } from 'react';

interface Props {
  questions: string[];
  accentColor: string;
  isLoading: boolean;
  onSubmit: (answers: string[]) => void;
}

export default function SequentialQuestions({ questions, accentColor, isLoading, onSubmit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');

  function handleNext() {
    const updated = [...answers];
    updated[currentIndex] = currentAnswer.trim();
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer('');
    } else {
      onSubmit(updated);
    }
  }

  const isLast = currentIndex === questions.length - 1;

  return (
    <div key={currentIndex} className="space-y-4 animate-slide-up">
      <p className="text-sm text-gray-500 text-center">
        Pregunta {currentIndex + 1} de {questions.length}
      </p>
      <p className="text-gray-800 font-medium">{questions[currentIndex]}</p>
      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Tu respuesta..."
        className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 text-gray-800"
        disabled={isLoading}
      />
      <button
        onClick={handleNext}
        disabled={currentAnswer.trim().length < 5 || isLoading}
        className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        style={
          currentAnswer.trim().length >= 5 && !isLoading
            ? { backgroundColor: accentColor }
            : {}
        }
      >
        {isLoading ? 'Evaluando…' : isLast ? 'Enviar respuestas' : 'Siguiente →'}
      </button>
    </div>
  );
}
