'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Palette, HardDrive, Cloud, Download, Upload, Trash2, Moon, Sun, Monitor, Camera } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatRut } from '@/utils/formatters';
import { getProfile, saveProfile, clearAllData } from '@/database/db';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import type { ElectricianProfile } from '@/types';

interface Props {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: Props) {
  const { mode, setMode, effective } = useTheme();
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile().then((p) => {
      const initial: ElectricianProfile = p ?? {
        name: '', rut: '', secNumber: '', phone: '',
        defaultRate: 150, laborFactor: 30,
        theme: 'dark', units: 'metric',
      };
      setProfile(initial);
      if (initial.theme) setMode(initial.theme);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor sube una imagen (PNG o JPG).');
      return;
    }
    if (file.size > 500_000) {
      alert('La imagen es muy pesada (máx 500 KB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      update({ logo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const update = (changes: Partial<ElectricianProfile>) => {
    setProfile({ ...profile, ...changes });
    setSaved(false);
  };

  const handleSave = async () => {
    await saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themeOptions: Array<{ id: ThemeMode; label: string; icon: typeof Moon }> = [
    { id: 'dark', label: 'Oscuro', icon: Moon },
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'system', label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Configuración" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-2xl mx-auto space-y-4">
        <div className="card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center overflow-hidden">
              {profile.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-accent-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{profile.name || 'Electricista'}</p>
              <p className="text-xs text-muted">SEC: {profile.secNumber || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="w-4 h-4 mr-1" /> Subir logo
            </Button>
            {profile.logo && (
              <Button size="sm" variant="ghost" onClick={() => update({ logo: undefined })}>
                Quitar
              </Button>
            )}
            <span className="text-[11px] text-muted-foreground">Aparecerá en cotizaciones y TE1</span>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Su nombre" />
            </div>
            <div className="space-y-2">
              <Label>RUT</Label>
              <Input value={profile.rut} onChange={(e) => update({ rut: formatRut(e.target.value) })} placeholder="12.345.678-9" />
            </div>
            <div className="space-y-2">
              <Label>Número SEC</Label>
              <Input value={profile.secNumber} onChange={(e) => update({ secNumber: e.target.value })} placeholder="12345" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={profile.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+56 9 1234 5678" />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent-secondary" /> Apariencia
          </h3>
          <Separator />
          <div>
            <p className="text-sm text-foreground mb-2">Tema</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setMode(opt.id); update({ theme: opt.id }); }}
                    className={`h-16 rounded-lg font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                      active
                        ? 'bg-accent-primary text-background'
                        : 'bg-elevated text-foreground border border-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Modo activo: <span className="text-foreground font-medium">{effective === 'dark' ? 'Oscuro' : 'Claro'}</span>
            </p>
          </div>
          <div className="space-y-2">
            <Label>Tarifa por defecto ($/kWh)</Label>
            <Input type="number" value={profile.defaultRate} onChange={(e) => update({ defaultRate: parseFloat(e.target.value) || 0 })} suffix="$/kWh" />
          </div>
          <div className="space-y-2">
            <Label>Mano de obra: {profile.laborFactor}%</Label>
            <input type="range" min="0" max="100" value={profile.laborFactor} onChange={(e) => update({ laborFactor: parseInt(e.target.value) })} className="w-full accent-accent-primary" />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-accent-warning" /> Almacenamiento
          </h3>
          <Separator />
          <div className="space-y-2">
            <Button variant="secondary" className="w-full"><Download className="w-4 h-4 mr-2" /> Exportar datos</Button>
            <Button variant="secondary" className="w-full"><Upload className="w-4 h-4 mr-2" /> Importar datos</Button>
            <Button variant="destructive" className="w-full" onClick={async () => { if (confirm('¿Borrar todos los datos locales?')) { await clearAllData(); location.reload(); } }}>
              <Trash2 className="w-4 h-4 mr-2" /> Limpiar cache
            </Button>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Cloud className="w-4 h-4 text-accent-success" /> Sincronización
          </h3>
          <Separator />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-success" />
            <span className="text-sm text-foreground">Datos guardados localmente</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Próximamente: sincronización entre dispositivos
          </p>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg" disabled={saved}>
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </Button>

        <p className="text-xs text-muted text-center py-4">ElectriChile Pro v1.0.0</p>
      </div>
    </div>
  );
}
