'use client';
import { BADGE_DEFS } from '@/lib/gamification';

interface Props {
  unlockedBadgeIds: string[];
}

export default function BadgesDisplay({ unlockedBadgeIds }: Props) {
  const unlocked = new Set(unlockedBadgeIds);

  return (
    <div className="space-y-3">
      <h3 className="font-black text-lg text-gray-800">Logros</h3>
      <div className="grid grid-cols-4 gap-3">
        {BADGE_DEFS.map(badge => {
          const isUnlocked = unlocked.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                isUnlocked
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-40'
              }`}
              title={isUnlocked ? badge.description : '???'}
            >
              <span className="text-2xl">{isUnlocked ? badge.emoji : '🔒'}</span>
              <span className={`text-xs font-bold text-center leading-tight ${isUnlocked ? 'text-yellow-800' : 'text-gray-400'}`}>
                {isUnlocked ? badge.name : '???'}
              </span>
              {isUnlocked && (
                <span className="text-[10px] font-bold text-yellow-600">+{badge.xpReward} XP</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
