'use client';

import { useEffect, useRef, useState } from 'react';
import { getLevelForXP } from '@/lib/gamification';

interface XPBarProps {
  totalXP: number;
  maxXP: number;
  newXP?: number;
}

export default function XPBar({ totalXP, maxXP, newXP }: XPBarProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [displayXP, setDisplayXP] = useState(totalXP - (newXP ?? 0));
  const prevXPRef = useRef(totalXP - (newXP ?? 0));

  useEffect(() => {
    if (newXP && newXP > 0) {
      setShowPopup(true);
      const timer = setInterval(() => {
        setDisplayXP((prev) => {
          const next = Math.min(prev + Math.ceil(newXP / 30), totalXP);
          if (next >= totalXP) clearInterval(timer);
          return next;
        });
      }, 30);
      const popupTimer = setTimeout(() => setShowPopup(false), 2500);
      return () => {
        clearInterval(timer);
        clearTimeout(popupTimer);
      };
    } else {
      setDisplayXP(totalXP);
    }
  }, [newXP, totalXP]);

  const percentage = Math.min((displayXP / maxXP) * 100, 100);
  const level = getLevelForXP(displayXP);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="font-bold text-gray-700 text-sm">
            {displayXP} / {maxXP} XP
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-500">
          Nv.{level.level} {level.name} {level.emoji}
        </span>
      </div>

      <div className="h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #58CC02 0%, #89E219 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
            }}
          />
        </div>
      </div>

      {showPopup && newXP && (
        <div
          className="absolute -top-10 right-0 bg-yellow-400 text-white font-black px-4 py-1 rounded-full text-lg shadow-lg animate-bounce"
          style={{ zIndex: 50 }}
        >
          +{newXP} XP ✨
        </div>
      )}
    </div>
  );
}
