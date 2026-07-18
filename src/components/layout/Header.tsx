'use client';

import { Zap, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

/**
 * Header mobile. En desktop/tablet (md+) la navegación se hace
 * por la Sidebar, así que este header sólo se renderiza en móvil.
 */
export default function Header({ title, showBack, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 md:hidden bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-elevated transition-colors" aria-label="Volver">
              <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-primary" />
              </div>
              <span className="font-semibold text-foreground text-lg">ElectriChile</span>
            </div>
          )}
          {title && <h1 className="font-semibold text-foreground truncate">{title}</h1>}
        </div>
        <button className="w-9 h-9 rounded-full bg-elevated flex items-center justify-center border border-border" aria-label="Perfil">
          <User className="w-4 h-4 text-muted" />
        </button>
      </div>
    </header>
  );
}
