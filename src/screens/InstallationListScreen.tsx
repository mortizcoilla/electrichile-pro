'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Calendar, Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';
import { useInstallationStore } from '@/stores/installationStore';
import { getAllInstallations } from '@/database/db';
import { formatDate } from '@/utils/formatters';

interface Props {
  onBack: () => void;
  onNew: () => void;
}

export default function InstallationListScreen({ onBack, onNew }: Props) {
  const installations = useInstallationStore((s) => s.installations);
  const setInstallations = useInstallationStore((s) => s.setInstallations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllInstallations()
      .then(setInstallations)
      .catch((error) => console.error('Error al cargar instalaciones', error))
      .finally(() => setLoading(false));
  }, [setInstallations]);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Instalaciones" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <Button onClick={onNew} className="w-full">
          <Plus className="w-5 h-5 mr-2" /> Nueva Instalación
        </Button>

        {loading ? (
          <p className="text-sm text-muted text-center">Cargando...</p>
        ) : installations.length === 0 ? (
          <EmptyState icon={FileText} title="Sin instalaciones" description="Crea tu primera instalación para generar certificados" />
        ) : (
          <div className="space-y-3">
            {installations.map((inst, i) => (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{inst.clientName}</p>
                    <p className="text-xs text-muted">{inst.clientRut}</p>
                  </div>
                  <Badge variant={inst.status === 'completed' ? 'success' : 'secondary'}>
                    {inst.status === 'completed' ? 'Completado' : 'Borrador'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {inst.commune}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(new Date(inst.createdAt))}
                  </span>
                </div>
                <p className="text-xs text-accent-secondary font-medium">
                  {inst.certificateNumber}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
