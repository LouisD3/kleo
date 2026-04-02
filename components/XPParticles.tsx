'use client';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  xp: number;
  x: number;
}

interface Props {
  xpGained: number;   // when > 0, triggers particles
  trigger: number;    // increment to re-trigger (use a counter)
}

export default function XPParticles({ xpGained, trigger }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (xpGained <= 0) return;
    const count = Math.min(4, Math.ceil(xpGained / 20));
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      xp: xpGained,
      x: 30 + Math.random() * 40, // % from left
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(t);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p, i) => (
        <div
          key={p.id}
          className="absolute bottom-20 font-black text-yellow-500 text-sm animate-float-xp"
          style={{ left: `${p.x + i * 8}%`, animationDelay: `${i * 80}ms` }}
        >
          +{p.xp} XP
        </div>
      ))}
    </div>
  );
}
