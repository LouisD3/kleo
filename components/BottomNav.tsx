'use client';

export type Tab = 'inicio' | 'logros' | 'perfil';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: string; activeIcon: string }[] = [
  { id: 'inicio',  label: 'Inicio',  icon: '🏠', activeIcon: '🏠' },
  { id: 'logros',  label: 'Logros',  icon: '🏆', activeIcon: '🏆' },
  { id: 'perfil',  label: 'Perfil',  icon: '👤', activeIcon: '👤' },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-gray-100 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around px-4 py-2">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-all ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span
                className={`text-xs font-black leading-none transition-colors ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
