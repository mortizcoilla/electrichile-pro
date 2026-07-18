'use client';

import { Home, FolderOpen, Calculator, Package, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'installations', label: 'Instalaciones', icon: FolderOpen },
  { id: 'calculators', label: 'Calculadoras', icon: Calculator },
  { id: 'materials', label: 'Materiales', icon: Package },
  { id: 'settings', label: 'Config', icon: Settings },
] as const;

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Bottom nav para móvil. En tablet/desktop (md+) se oculta y la
 * navegación se hace por la Sidebar lateral.
 */
export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-surface/90 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive ? 'text-accent-primary' : 'text-muted-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { NAV_ITEMS };
