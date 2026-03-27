'use client';

import { EvaluationResult } from '@/lib/types';
import ConceptChecklist from './ConceptChecklist';

interface FeedbackDisplayProps {
  evaluation: EvaluationResult;
  accentColor?: string;
}

export default function FeedbackDisplay({ evaluation, accentColor = '#1CB0F6' }: FeedbackDisplayProps) {
  return (
    <div className="space-y-4 w-full">
      {/* Concept-by-concept checklist */}
      {evaluation.conceptChecks && evaluation.conceptChecks.length > 0 && (
        <ConceptChecklist conceptChecks={evaluation.conceptChecks} accentColor={accentColor} />
      )}

      {/* What they got right */}
      {evaluation.correct.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✅</span>
            <h3 className="font-black text-green-700 text-base">
              Lo que entendiste bien
            </h3>
          </div>
          <ul className="space-y-2">
            {evaluation.correct.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {evaluation.gaps.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <h3 className="font-black text-amber-700 text-base">
              Lo que te faltó mencionar
            </h3>
          </div>
          <ul className="space-y-2">
            {evaluation.gaps.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-0.5 text-amber-500 flex-shrink-0">ℹ</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
