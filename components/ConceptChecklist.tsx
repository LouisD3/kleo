'use client';

import { ConceptCheck } from '@/lib/types';

interface ConceptChecklistProps {
  conceptChecks: ConceptCheck[];
  accentColor: string;
}

export default function ConceptChecklist({ conceptChecks, accentColor }: ConceptChecklistProps) {
  const coveredCount = conceptChecks.filter((c) => c.covered).length;
  const total = conceptChecks.length;

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: accentColor + '18' }}>
        <span className="font-black text-sm text-gray-700">Conceptos evaluados</span>
        <span
          className="text-sm font-black px-3 py-0.5 rounded-full text-white"
          style={{ background: coveredCount >= Math.ceil(total * 6 / 7) ? '#58CC02' : '#FF4B4B' }}
        >
          {coveredCount}/{total}
        </span>
      </div>
      <ul className="divide-y divide-gray-100">
        {conceptChecks.map((check, i) => (
          <li
            key={i}
            className="px-4 py-3"
            style={{ background: check.covered ? '#F0FFF4' : '#FFF5F5' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5 flex-shrink-0">{check.covered ? '✅' : '❌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: check.covered ? '#166534' : '#991B1B' }}>
                  {check.concept}
                </p>
                {check.covered && check.studentEvidence && (
                  <p className="text-xs mt-0.5 text-green-700 italic leading-relaxed">
                    "{check.studentEvidence}"
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
