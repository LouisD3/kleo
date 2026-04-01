'use client';
import { DailyObjective } from '@/lib/types';

interface Props {
  objective: DailyObjective;
  accentColor?: string;
}

export default function DailyObjectiveCard({ objective, accentColor = '#1CB0F6' }: Props) {
  const pct = Math.min((objective.current / objective.target) * 100, 100);

  return (
    <div className={`rounded-2xl border-2 p-4 space-y-2 ${objective.completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span className="font-black text-sm text-gray-700">Objetivo del día</span>
        </div>
        {objective.completed && (
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">¡Completado!</span>
        )}
      </div>
      <p className="text-sm text-gray-600">{objective.description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: objective.completed ? '#16a34a' : accentColor }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{objective.current} / {objective.target}</p>
    </div>
  );
}
