'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#58CC02', '#FFD700', '#FF4B4B', '#1CB0F6', '#CE82FF'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    frame();

    // Big burst in the center
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors,
      zIndex: 9999,
    });
  }, [trigger]);

  return null;
}
