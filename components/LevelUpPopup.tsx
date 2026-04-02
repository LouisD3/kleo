'use client';
import { Level } from '@/lib/types';
import Mascot from './Mascot';

interface Props {
  level: Level;
  onClose: () => void;
}

export default function LevelUpPopup({ level, onClose }: Props) {

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-pop-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-xs mx-4 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <Mascot variant="inline" emotion="celebrate" size={100} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">¡Subiste de nivel!</p>
          <p className="font-black text-4xl mt-1">{level.emoji}</p>
          <p className="font-black text-2xl text-gray-800 mt-1">{level.name}</p>
          <p className="text-sm text-gray-500 mt-2">Nuevo título desbloqueado: <strong>{level.name}</strong></p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl font-black text-white text-sm bg-yellow-400 transition-all active:scale-95"
        >
          ¡Genial!
        </button>
      </div>
    </div>
  );
}
