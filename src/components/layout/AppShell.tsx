'use client';

import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import OfflineBanner from './OfflineBanner';
import UpdateBanner from './UpdateBanner';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Shell principal de la app, ahora responsive.
 *
 *  - Móvil (< md): header arriba, bottom-nav abajo, contenido en 1 columna.
 *  - Tablet/Desktop (≥ md): sidebar fija a la izquierda, contenido centrado
 *    con un max-width cómodo para lectura.
 */
export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <UpdateBanner />
      <OfflineBanner />

      <div className="md:pl-60 lg:pl-64">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <Header />
        <main className="px-4 py-6 md:px-8 md:py-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto pb-24 md:pb-12">
          {children}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}
