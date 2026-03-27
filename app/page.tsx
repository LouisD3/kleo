'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, CapState } from '@/lib/types';
import { CAPS } from '@/lib/caps';
import { loadState, saveState, clearState, getInitialCapState } from '@/lib/storage';
import XPBar from '@/components/XPBar';
import CapCard from '@/components/CapCard';
import FeynmanLoop from '@/components/FeynmanLoop';
import ConfettiCelebration from '@/components/ConfettiCelebration';

const MAX_XP = CAPS.reduce((sum, c) => sum + c.xpReward, 0);

export default function Home() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [activeCapId, setActiveCapId] = useState<number | null>(null);
  const [newXP, setNewXP] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationCapId, setCelebrationCapId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const state = loadState();
    setAppState(state);
    // Auto-open the first in-progress cap
    const firstInProgress = CAPS.find(
      (c) => state.caps[c.id]?.status === 'in-progress'
    );
    if (firstInProgress) {
      setActiveCapId(firstInProgress.id);
      setDrawerOpen(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (appState) saveState(appState);
  }, [appState]);

  const updateCapState = useCallback(
    (capId: number, updates: Partial<CapState>) => {
      setAppState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          caps: {
            ...prev.caps,
            [capId]: { ...prev.caps[capId], ...updates },
          },
        };
      });
    },
    []
  );

  const handleCapComplete = useCallback(
    (capId: number, xpReward: number) => {
      setCelebrationCapId(capId);
      setShowConfetti(true);
      setNewXP(xpReward);

      setAppState((prev) => {
        if (!prev) return prev;
        const nextCapId = capId + 1;
        const newCaps = { ...prev.caps };

        // Mark current as unlocked
        newCaps[capId] = { ...newCaps[capId], status: 'unlocked', phase: 'complete' };

        // Unlock next cap if it exists
        if (nextCapId <= CAPS.length) {
          newCaps[nextCapId] = {
            ...getInitialCapState(nextCapId),
            status: 'in-progress',
          };
        }

        return {
          ...prev,
          caps: newCaps,
          totalXP: prev.totalXP + xpReward,
          activeCapId: nextCapId <= CAPS.length ? nextCapId : null,
        };
      });

      // After celebration, move to next cap or close drawer
      setTimeout(() => {
        setShowConfetti(false);
        const nextCapId = capId + 1;
        if (nextCapId <= CAPS.length) {
          setActiveCapId(nextCapId);
        } else {
          setDrawerOpen(false);
          setActiveCapId(null);
        }
        // Reset XP popup after a beat
        setTimeout(() => setNewXP(0), 500);
      }, 3500);
    },
    []
  );

  const handleCapClick = (capId: number) => {
    if (!appState) return;
    const cap = appState.caps[capId];
    if (cap.status === 'locked') return;
    setActiveCapId(capId);
    setDrawerOpen(true);
  };

  const handleReset = () => {
    clearState();
    setAppState(null);
    setTimeout(() => {
      const fresh = loadState();
      setAppState(fresh);
      setActiveCapId(1);
      setDrawerOpen(true);
    }, 50);
  };

  if (!appState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCap = activeCapId ? CAPS.find((c) => c.id === activeCapId) : null;
  const activeCapState = activeCapId ? appState.caps[activeCapId] : null;
  const allComplete = CAPS.every((c) => appState.caps[c.id]?.status === 'unlocked');

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-nunito">
      <ConfettiCelebration trigger={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-sm">
                🔬
              </div>
              <div>
                <h1 className="font-black text-lg text-gray-800 leading-none">Kleo</h1>
                <p className="text-xs text-gray-400 font-semibold leading-none">Física Básica</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-red-400 font-bold transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              Reiniciar
            </button>
          </div>
          <XPBar totalXP={appState.totalXP} maxXP={MAX_XP} newXP={newXP} />
        </div>
      </header>

      {/* Skill Tree */}
      <main className="max-w-lg mx-auto px-4 py-8">
        {allComplete ? (
          <div className="text-center py-12 animate-pop-in">
            <div className="text-8xl mb-4">🎓</div>
            <h2 className="font-black text-3xl text-gray-800 mb-2">
              ¡Física dominada!
            </h2>
            <p className="text-gray-500 text-base mb-2">
              Completaste los 3 caps con {appState.totalXP} XP.
            </p>
            <p className="text-gray-400 text-sm">
              ¡El método Feynman funciona! 🧠✨
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="font-black text-2xl text-gray-800">
                Tu camino de aprendizaje
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Completa cada cap para desbloquear el siguiente
              </p>
            </div>

            <div className="flex flex-col items-center space-y-0">
              {CAPS.map((cap) => (
                <CapCard
                  key={cap.id}
                  cap={cap}
                  capState={appState.caps[cap.id]}
                  isActive={activeCapId === cap.id}
                  onClick={() => handleCapClick(cap.id)}
                />
              ))}
            </div>

            <div className="mt-10 text-center text-sm text-gray-400 font-semibold">
              <p>💡 Toca un cap para comenzar o continuar</p>
            </div>
          </>
        )}
      </main>

      {/* Drawer / Bottom Sheet */}
      {drawerOpen && activeCap && activeCapState && activeCapState.status !== 'unlocked' && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCap.emoji}</span>
                <div>
                  <span className="font-black text-gray-800 text-base">
                    {activeCap.title}
                  </span>
                  <span className="text-gray-400 text-xs block font-semibold">
                    Cap {activeCap.id} · {activeCap.xpReward} XP
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FeynmanLoop
                cap={activeCap}
                capState={activeCapState}
                onComplete={(xp) => handleCapComplete(activeCap.id, xp)}
                onStateChange={(updates) => updateCapState(activeCap.id, updates)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
