'use client';
import { ConceptCheck } from '@/lib/types';

interface Props {
  conceptChecks: ConceptCheck[];
}

export default function StaggeredChecklist({ conceptChecks }: Props) {
  return (
    <ul className="space-y-2">
      {conceptChecks.map((check, i) => (
        <li
          key={i}
          className="flex items-start gap-3 animate-pop-in"
          style={{
            animationDelay: `${i * 150}ms`,
            animationFillMode: 'backwards',
          }}
        >
          <span className="text-lg mt-0.5">{check.covered ? '✅' : '❌'}</span>
          <div className="flex-1">
            <span className={`font-medium ${check.covered ? 'text-green-700' : 'text-red-600'}`}>
              {check.concept}
            </span>
            {check.studentEvidence && (
              <p className="text-xs text-gray-500 mt-0.5 italic">"{check.studentEvidence}"</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
