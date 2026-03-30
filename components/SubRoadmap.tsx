'use client';

import { Cap, CapState } from '@/lib/types';

interface SubRoadmapProps {
  cap: Cap;
  capState: CapState;
  onChapterClick: (chapterIndex: number) => void;
  onFinalTestClick: () => void;
}

const COLOR_MAP: Record<string, { accent: string; light: string; dark: string }> = {
  blue: { accent: '#1CB0F6', light: '#EFF9FE', dark: '#0E86B8' },
  yellow: { accent: '#FFC800', light: '#FFF9E0', dark: '#CC9E00' },
  green: { accent: '#58CC02', light: '#F0FFF0', dark: '#3D9000' },
};

function getChapterStatus(chapterIndex: number, capState: CapState): 'locked' | 'in-progress' | 'complete' {
  const chState = capState.chapters[chapterIndex];
  if (!chState) return 'locked';
  if (chState.phase === 'complete') return 'complete';
  // A chapter is unlocked if all previous chapters are complete
  for (let i = 0; i < chapterIndex; i++) {
    if (capState.chapters[i]?.phase !== 'complete') return 'locked';
  }
  return 'in-progress';
}

function getFinalTestStatus(capState: CapState, totalChapters: number): 'locked' | 'in-progress' | 'complete' {
  if (capState.finalTest.phase === 'complete') return 'complete';
  // Unlock only if all chapters are complete
  for (let i = 0; i < totalChapters; i++) {
    if (capState.chapters[i]?.phase !== 'complete') return 'locked';
  }
  return 'in-progress';
}

function getChapterProgress(chapterIndex: number, capState: CapState): number {
  const chState = capState.chapters[chapterIndex];
  if (!chState) return 0;
  if (chState.phase === 'complete') return 100;
  if (chState.phase === 'revisar') return 70;
  if (chState.phase === 'explicar') return 40;
  if (chState.phase === 'conceptos') return 10;
  return 0;
}

export default function SubRoadmap({ cap, capState, onChapterClick, onFinalTestClick }: SubRoadmapProps) {
  const colors = COLOR_MAP[cap.color] ?? COLOR_MAP.blue;
  const totalChapters = cap.chapters.length;

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="text-center mb-8 animate-pop-in">
        <div className="text-5xl mb-3">{cap.emoji}</div>
        <h2 className="font-black text-2xl text-gray-800">{cap.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{cap.subtitle}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: colors.accent }}>
          +{cap.xpReward} XP total
        </div>
      </div>

      {/* Chapter + FinalTest steps */}
      <div className="flex flex-col items-center">
        {cap.chapters.map((chapter, index) => {
          const status = getChapterStatus(index, capState);
          const isLocked = status === 'locked';
          const isComplete = status === 'complete';
          const progress = getChapterProgress(index, capState);

          return (
            <div key={chapter.id} className="flex flex-col items-center w-full max-w-sm">
              {/* Connector line above (except first) */}
              {index > 0 && (
                <div
                  className="w-1 h-8 rounded-full transition-all duration-500"
                  style={{ background: isLocked ? '#E5E7EB' : colors.accent }}
                />
              )}

              <button
                onClick={() => !isLocked && onChapterClick(index)}
                disabled={isLocked}
                className={`
                  w-full rounded-3xl p-4 text-left transition-all duration-200
                  ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
                `}
                style={{
                  background: isLocked ? '#F3F4F6' : colors.light,
                  border: `2.5px solid ${isLocked ? '#E5E7EB' : colors.accent}`,
                  boxShadow: isLocked ? 'none' : `0 4px 0 ${colors.dark}`,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Step number */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{
                      background: isLocked ? '#E5E7EB' : isComplete ? colors.accent : 'white',
                      color: isLocked ? '#9CA3AF' : isComplete ? 'white' : colors.accent,
                      border: isComplete ? 'none' : `2px solid ${isLocked ? '#E5E7EB' : colors.accent}`,
                    }}
                  >
                    {isComplete ? '✓' : index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-black text-sm leading-tight"
                        style={{ color: isLocked ? '#9CA3AF' : '#1F2937' }}
                      >
                        {chapter.title}
                      </span>
                      <span className="text-xs font-bold flex-shrink-0"
                        style={{ color: isLocked ? '#D1D5DB' : colors.dark }}>
                        +{chapter.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: isLocked ? '#D1D5DB' : '#6B7280' }}>
                      {chapter.keyConcepts.length} conceptos
                    </p>
                  </div>
                </div>

                {/* Progress bar for in-progress chapters */}
                {!isLocked && !isComplete && progress > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${colors.accent}, ${colors.dark})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* Connector to final test */}
        {(() => {
          const ftStatus = getFinalTestStatus(capState, totalChapters);
          const ftLocked = ftStatus === 'locked';
          const ftComplete = ftStatus === 'complete';

          return (
            <>
              <div
                className="w-1 h-8 rounded-full transition-all duration-500"
                style={{ background: ftLocked ? '#E5E7EB' : colors.accent }}
              />

              <button
                onClick={() => !ftLocked && onFinalTestClick()}
                disabled={ftLocked}
                className={`
                  w-full max-w-sm rounded-3xl p-4 text-left transition-all duration-200
                  ${ftLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
                `}
                style={{
                  background: ftLocked ? '#F3F4F6' : ftComplete ? colors.light : `linear-gradient(135deg, ${colors.light}, white)`,
                  border: `2.5px solid ${ftLocked ? '#E5E7EB' : colors.accent}`,
                  boxShadow: ftLocked ? 'none' : `0 4px 0 ${colors.dark}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: ftLocked ? '#E5E7EB' : ftComplete ? colors.accent : 'white',
                      border: ftComplete ? 'none' : `2px solid ${ftLocked ? '#E5E7EB' : colors.accent}`,
                    }}
                  >
                    {ftComplete ? '🏆' : '⭐'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-black text-sm leading-tight"
                        style={{ color: ftLocked ? '#9CA3AF' : '#1F2937' }}
                      >
                        Prueba Final
                      </span>
                      <span className="text-xs font-bold flex-shrink-0"
                        style={{ color: ftLocked ? '#D1D5DB' : colors.dark }}>
                        +{cap.finalTest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: ftLocked ? '#D1D5DB' : '#6B7280' }}>
                      {ftLocked ? 'Completa todos los capítulos' : ftComplete ? '¡Superada!' : 'Demuestra todo lo aprendido'}
                    </p>
                  </div>
                </div>
              </button>
            </>
          );
        })()}
      </div>
    </div>
  );
}
