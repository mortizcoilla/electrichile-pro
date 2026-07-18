'use client';

import { WifiOff } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

export default function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-accent-warning/10 border-b border-accent-warning/30 px-4 py-2.5 md:ml-60 lg:ml-64">
      <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
        <WifiOff className="w-4 h-4 text-accent-warning" />
        <span className="text-sm text-accent-warning font-medium">
          Sin conexión — Los datos se guardan localmente
        </span>
      </div>
    </div>
  );
}
