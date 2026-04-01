'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppState, CapState, ChapterState, FinalTestState, LearningContent, Level } from '@/lib/types';
import { CAPS } from '@/lib/caps';
import { loadState, saveState, clearState, getInitialCapState } from '@/lib/storage';
import { getLevelForXP, checkNewBadges, getOrCreateDailyObjective, updateDailyObjective, getBadgesXP, DAILY_OBJECTIVE_XP } from '@/lib/gamification';
import XPBar from '@/components/XPBar';
import CapCard from '@/components/CapCard';
import SubRoadmap from '@/components/SubRoadmap';
import FeynmanLoop from '@/components/FeynmanLoop';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import Mascot from '@/components/Mascot';
import LevelUpPopup from '@/components/LevelUpPopup';
import BadgesDisplay from '@/components/BadgesDisplay';
import DailyObjectiveCard from '@/components/DailyObjective';
import XPParticles from '@/components/XPParticles';
import BottomNav, { Tab } from '@/components/BottomNav';
import ProfileTab from '@/components/ProfileTab';

const MAX_XP = CAPS.reduce((sum, c) => sum + c.xpReward, 0);

type ViewMode = 'main' | 'sub-roadmap' | 'learning';

export default function Home() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [view, setView] = useState<ViewMode>('main');
  const [activeCapId, setActiveCapId] = useState<number | null>(null);
  // chapterIndex: null means final-test, number means chapter at that index
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [newXP, setNewXP] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [viewClosing, setViewClosing] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState<Level | null>(null);
  const [sessionBadgeIds, setSessionBadgeIds] = useState<string[]>([]);
  const [xpParticleTrigger, setXpParticleTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  useEffect(() => {
    const state = loadState();
    const obj = getOrCreateDailyObjective(state);
    setAppState({ ...state, dailyObjective: obj });
  }, []);

  useEffect(() => {
    if (appState) saveState(appState);
  }, [appState]);

  // ── State updaters ────────────────────────────────────────────────────────────

  const updateChapterState = useCallback(
    (capId: number, chapterIndex: number, updates: Partial<ChapterState>) => {
      setAppState((prev) => {
        if (!prev) return prev;
        const capState = prev.caps[capId];
        const newChapters = capState.chapters.map((ch, i) =>
          i === chapterIndex ? { ...ch, ...updates } : ch
        );
        return {
          ...prev,
          caps: {
            ...prev.caps,
            [capId]: { ...capState, chapters: newChapters },
          },
        };
      });
    },
    []
  );

  const updateFinalTestState = useCallback(
    (capId: number, updates: Partial<FinalTestState>) => {
      setAppState((prev) => {
        if (!prev) return prev;
        const capState = prev.caps[capId];
        return {
          ...prev,
          caps: {
            ...prev.caps,
            [capId]: {
              ...capState,
              finalTest: { ...capState.finalTest, ...updates },
            },
          },
        };
      });
    },
    []
  );

  // ── Navigation ────────────────────────────────────────────────────────────────

  const navigateTo = (newView: ViewMode, capId?: number, chapterIndex?: number | null) => {
    setViewClosing(false);
    if (capId !== undefined) setActiveCapId(capId);
    if (chapterIndex !== undefined) setActiveChapterIndex(chapterIndex);
    setView(newView);
  };

  const goBack = (targetView: ViewMode) => {
    setViewClosing(true);
    setTimeout(() => {
      setView(targetView);
      setViewClosing(false);
      if (targetView === 'main') {
        setActiveCapId(null);
        setActiveChapterIndex(null);
      }
    }, 350);
  };

  // ── Completion handlers ────────────────────────────────────────────────────────

  const handleChapterComplete = useCallback(
    (capId: number, chapterIndex: number, xpReward: number, stars: 1 | 2 | 3, attemptCount: number) => {
      setXpParticleTrigger(t => t + 1);

      setAppState((prev) => {
        if (!prev) return prev;

        const capState = prev.caps[capId];
        const newChapters = capState.chapters.map((ch, i) =>
          i === chapterIndex ? { ...ch, phase: 'complete' as const } : ch
        );
        const newCapState = { ...capState, chapters: newChapters };

        const newBadgeIds = checkNewBadges(
          { ...prev, caps: { ...prev.caps, [capId]: newCapState } },
          { capId, isChapter: true, stars, attemptCount }
        );

        const dailyObj = getOrCreateDailyObjective(prev);
        const updatedObjective = updateDailyObjective(dailyObj, { isChapter: true, stars });
        const dailyBonus = !dailyObj.completed && updatedObjective.completed ? DAILY_OBJECTIVE_XP : 0;

        const badgeBonus = getBadgesXP(newBadgeIds);
        const totalGained = xpReward + badgeBonus + dailyBonus;

        const oldLevel = getLevelForXP(prev.totalXP);
        const newTotalXP = prev.totalXP + totalGained;
        const newLevel = getLevelForXP(newTotalXP);
        if (newLevel.level > oldLevel.level) {
          setTimeout(() => setLevelUpPopup(newLevel), 600);
        }

        setSessionBadgeIds(newBadgeIds);
        setNewXP(totalGained);

        return {
          ...prev,
          caps: { ...prev.caps, [capId]: newCapState },
          totalXP: newTotalXP,
          unlockedBadgeIds: [...(prev.unlockedBadgeIds ?? []), ...newBadgeIds],
          dailyObjective: updatedObjective,
          lastXPForLevelCheck: newTotalXP,
        };
      });
    },
    []
  );

  const handleFinalTestComplete = useCallback(
    (capId: number, xpReward: number, stars: 1 | 2 | 3, attemptCount: number) => {
      setShowConfetti(true);
      setXpParticleTrigger(t => t + 1);

      setAppState((prev) => {
        if (!prev) return prev;
        const nextCapId = capId + 1;
        const newCaps = { ...prev.caps };

        newCaps[capId] = {
          ...newCaps[capId],
          status: 'unlocked',
          finalTest: { ...newCaps[capId].finalTest, phase: 'complete' },
        };

        if (nextCapId <= CAPS.length) {
          newCaps[nextCapId] = {
            ...getInitialCapState(nextCapId),
            status: 'in-progress',
          };
        }

        const newBadgeIds = checkNewBadges(
          { ...prev, caps: newCaps },
          { capId, isChapter: false, stars, attemptCount }
        );

        const dailyObj = getOrCreateDailyObjective(prev);
        const updatedObjective = updateDailyObjective(dailyObj, { isChapter: false, stars });
        const dailyBonus = !dailyObj.completed && updatedObjective.completed ? DAILY_OBJECTIVE_XP : 0;

        const badgeBonus = getBadgesXP(newBadgeIds);
        const totalGained = xpReward + badgeBonus + dailyBonus;

        const oldLevel = getLevelForXP(prev.totalXP);
        const newTotalXP = prev.totalXP + totalGained;
        const newLevel = getLevelForXP(newTotalXP);
        if (newLevel.level > oldLevel.level) {
          setTimeout(() => setLevelUpPopup(newLevel), 600);
        }

        setSessionBadgeIds(newBadgeIds);
        setNewXP(totalGained);

        return {
          ...prev,
          caps: newCaps,
          totalXP: newTotalXP,
          unlockedBadgeIds: [...(prev.unlockedBadgeIds ?? []), ...newBadgeIds],
          dailyObjective: updatedObjective,
          lastXPForLevelCheck: newTotalXP,
        };
      });

      setTimeout(() => {
        setShowConfetti(false);
        setTimeout(() => setNewXP(0), 500);
      }, 3500);
    },
    []
  );

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleCapClick = (capId: number) => {
    if (!appState) return;
    const cap = appState.caps[capId];
    if (cap.status === 'locked') return;
    navigateTo('sub-roadmap', capId);
  };

  const handleChapterClick = (chapterIndex: number) => {
    navigateTo('learning', activeCapId!, chapterIndex);
  };

  const handleFinalTestClick = () => {
    navigateTo('learning', activeCapId!, null);
  };

  const handleReset = () => {
    clearState();
    setAppState(null);
    setView('main');
    setActiveCapId(null);
    setActiveChapterIndex(null);
    setTimeout(() => {
      const fresh = loadState();
      setAppState(fresh);
    }, 50);
  };

  // ── Derived data ──────────────────────────────────────────────────────────────

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

  // Build LearningContent for the current learning unit
  let learningContent: LearningContent | null = null;
  let learningState: ChapterState | FinalTestState | null = null;
  let learningMode: 'chapter' | 'final-test' = 'chapter';

  if (activeCap && activeCapState && view === 'learning') {
    if (activeChapterIndex !== null) {
      const chapter = activeCap.chapters[activeChapterIndex];
      learningContent = {
        title: chapter.title,
        emoji: activeCap.emoji,
        color: activeCap.color,
        keyConcepts: chapter.keyConcepts,
        conceptPages: chapter.conceptPages,
        explicarQuestions: chapter.explicarQuestions,
        xpReward: chapter.xpReward,
      };
      learningState = activeCapState.chapters[activeChapterIndex];
      learningMode = 'chapter';
    } else {
      // Final test
      learningContent = {
        title: activeCap.title,
        emoji: activeCap.emoji,
        color: activeCap.color,
        keyConcepts: activeCap.finalTest.keyConcepts,
        conceptPages: [],
        explicarQuestions: activeCap.finalTest.explicarQuestions,
        xpReward: activeCap.finalTest.xpReward,
      };
      learningState = activeCapState.finalTest;
      learningMode = 'final-test';
    }
  }

  const slideIn = 'animate-slide-in-right';
  const slideOut = 'animate-slide-out-right';

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-nunito">
      <ConfettiCelebration trigger={showConfetti} />

      {/* Level-up popup */}
      {levelUpPopup && (
        <LevelUpPopup level={levelUpPopup} onClose={() => setLevelUpPopup(null)} />
      )}

      {/* XP Particles */}
      <XPParticles xpGained={newXP} trigger={xpParticleTrigger} />

      {/* ── Persistent header ── */}
      <div className={view !== 'main' ? 'invisible' : ''}>
        <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 shadow-sm">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-xl shadow-sm">
                🔬
              </div>
              <div>
                <h1 className="font-black text-lg text-gray-800 leading-none">Kleo</h1>
                <p className="text-xs text-gray-400 font-semibold leading-none">Física Básica</p>
              </div>
            </div>
            <XPBar totalXP={appState.totalXP} maxXP={MAX_XP} newXP={newXP} />
          </div>
        </header>

        {/* ── Tab: Inicio ── */}
        {activeTab === 'inicio' && (
          <main className="max-w-lg mx-auto px-4 py-6 pb-28">
            {appState.dailyObjective && (
              <div className="mb-6">
                <DailyObjectiveCard objective={appState.dailyObjective} />
              </div>
            )}

            {allComplete ? (
              <div className="text-center py-12 animate-pop-in">
                <div className="flex justify-center mb-2">
                  <Mascot variant="inline" emotion="celebrate" size={120} />
                </div>
                <h2 className="font-black text-3xl text-gray-800 mb-2">¡Física dominada!</h2>
                <p className="text-gray-500 text-base mb-2">
                  Completaste los 3 caps con {appState.totalXP} XP.
                </p>
                <p className="text-gray-400 text-sm">¡El método Feynman funciona! 🧠✨</p>
              </div>
            ) : (
              <>
                {/* Greeting */}
                <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 mb-6 animate-pop-in">
                  <Mascot variant="inline" emotion="idle" size={64} />
                  <div>
                    <p className="font-black text-gray-800 text-sm leading-tight">
                      {appState.totalXP === 0 ? '¡Bienvenido, físico!' : '¡Hola de nuevo!'}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {appState.totalXP === 0
                        ? 'Empieza tu primer capítulo 🚀'
                        : `Llevas ${appState.totalXP} XP — ¡sigue así!`}
                    </p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="font-black text-2xl text-gray-800">Tu camino de aprendizaje</h2>
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
              </>
            )}
          </main>
        )}

        {/* ── Tab: Logros ── */}
        {activeTab === 'logros' && (
          <main className="max-w-lg mx-auto px-4 py-6 pb-28">
            <div className="text-center mb-6">
              <h2 className="font-black text-2xl text-gray-800">Tus logros</h2>
              <p className="text-gray-500 text-sm mt-1">
                {(appState.unlockedBadgeIds ?? []).length} de 8 desbloqueados
              </p>
            </div>
            <BadgesDisplay unlockedBadgeIds={appState.unlockedBadgeIds ?? []} />
          </main>
        )}

        {/* ── Tab: Perfil ── */}
        {activeTab === 'perfil' && (
          <main className="max-w-lg mx-auto px-4 pb-28">
            <ProfileTab
              appState={appState}
              maxXP={MAX_XP}
              onReset={handleReset}
            />
          </main>
        )}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ── Sub-roadmap ── */}
      {(view === 'sub-roadmap' || (view === 'learning' && !viewClosing)) && activeCap && activeCapState && (
        <div
          className={`fixed inset-0 z-50 bg-[#F7F9FB] flex flex-col ${
            view === 'sub-roadmap'
              ? viewClosing ? slideOut : slideIn
              : 'invisible'
          }`}
        >
          <header className="sticky top-0 z-10 bg-white border-b-2 border-gray-100 shadow-sm flex-shrink-0">
            <div className="max-w-lg mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goBack('main')}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors py-1 pr-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-lg leading-none">←</span>
                  <span>Volver</span>
                </button>
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xl">{activeCap.emoji}</span>
                  <div>
                    <span className="font-black text-gray-800 text-base leading-none block">
                      {activeCap.title}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold leading-none">
                      Cap {activeCap.id} · {activeCap.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-4 py-6">
              <SubRoadmap
                cap={activeCap}
                capState={activeCapState}
                onChapterClick={handleChapterClick}
                onFinalTestClick={handleFinalTestClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Learning view (chapter or final test) ── */}
      {view === 'learning' && learningContent && learningState && activeCap && activeCapState && (
        <div
          className={`fixed inset-0 z-[60] bg-[#F7F9FB] flex flex-col ${
            viewClosing ? slideOut : slideIn
          }`}
        >
          <header className="sticky top-0 z-10 bg-white border-b-2 border-gray-100 shadow-sm flex-shrink-0">
            <div className="max-w-lg mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goBack('sub-roadmap')}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors py-1 pr-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-lg leading-none">←</span>
                  <span>Capítulos</span>
                </button>
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xl">{activeCap.emoji}</span>
                  <div>
                    <span className="font-black text-gray-800 text-base leading-none block">
                      {activeChapterIndex !== null
                        ? `Cap. ${activeChapterIndex + 1}: ${learningContent.title}`
                        : 'Prueba Final'}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold leading-none">
                      {activeCap.title} · +{learningContent.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-4 py-6">
              <FeynmanLoop
                content={learningContent}
                state={learningState}
                mode={learningMode}
                capState={activeCapState}
                newBadgeIds={sessionBadgeIds}
                onComplete={(xp, stars, attemptCount) => {
                  if (activeChapterIndex !== null) {
                    handleChapterComplete(activeCap.id, activeChapterIndex, xp, stars, attemptCount);
                  } else {
                    handleFinalTestComplete(activeCap.id, xp, stars, attemptCount);
                  }
                }}
                onStateChange={(updates) => {
                  if (activeChapterIndex !== null) {
                    updateChapterState(activeCap.id, activeChapterIndex, updates as Partial<ChapterState>);
                  } else {
                    updateFinalTestState(activeCap.id, updates as Partial<FinalTestState>);
                  }
                }}
                onGoToList={() => {
                  setSessionBadgeIds([]);
                  setNewXP(0);
                  goBack('sub-roadmap');
                }}
                onGoToNextChapter={
                  activeChapterIndex !== null && activeCap && activeChapterIndex + 1 < activeCap.chapters.length
                    ? () => {
                        setSessionBadgeIds([]);
                        setNewXP(0);
                        navigateTo('learning', activeCap.id, activeChapterIndex + 1);
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
