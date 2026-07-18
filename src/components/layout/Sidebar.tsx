'use client';

import { Zap } from 'lucide-react';
import { NAV_ITEMS } from './BottomNav';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Sidebar de navegación para tablet/desktop (md+).
 * En móvil se oculta y se muestra el BottomNav.
 */
export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 lg:w-64 md:fixed md:inset-y-0 md:left-0 md:z-30 bg-surface border-r border-border">
      <div className="flex items-center gap-2 h-16 px-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-accent-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-accent-primary" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-foreground">ElectriChile</span>
          <span className="text-[10px] text-muted uppercase tracking-wider">Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-muted hover:bg-elevated hover:text-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border text-[11px] text-muted-foreground">
        Basado en RIC N°01–N°19 (SEC, 2020)
      </div>
    </aside>
  );
}
