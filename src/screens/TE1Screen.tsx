'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileDown, Save, ChevronDown, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SignaturePad from '@/components/shared/SignaturePad';
import { addTE1, getNextTE1Number, updateTE1, getProfile } from '@/database/db';
import { downloadTE1PDF } from '@/utils/te1PdfGenerator';
import { shareTE1ViaWhatsApp } from '@/utils/shareUtils';
import { REGIONS } from '@/data/regions';
import type { TE1Declaration, InstallationType, EmpalmeType, InstallationDest, ElectricianProfile } from '@/types';

interface Props {
  onBack: () => void;
}

export default function TE1Screen({ onBack }: Props) {
  const [decl, setDecl] = useState<TE1Declaration | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showTech, setShowTech] = useState(true);
  const [showProtection, setShowProtection] = useState(true);
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const p = await getProfile();
    setProfile(p ? { ...p } : null);
    const number = await getNextTE1Number();
    setDecl({
      id: `te1-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      number,
      createdAt: new Date(),
      installerName: p?.name ?? '',
      installerRut: p?.rut ?? '',
      installerSecNumber: p?.secNumber ?? '',
      installerPhone: p?.phone ?? '',
      installerAddress: '',
      clientName: '',
      clientRut: '',
      address: '',
      commune: '',
      region: 'RM',
      installationType: 'nueva',
      installationArea: 0,
      installationDest: 'vivienda',
      empalmeType: 'monofasico',
      empalmeCapacity: 10,
      installedPowerKW: 0,
      totalCircuits: 0,
      lightingCircuits: 0,
      outletCircuits: 0,
      dedicatedCircuits: 0,
      phasesCount: 1,
      mainConductorSection: 6,
      mainConductorMaterial: 'cobre',
      mainConductorType: 'N2XOH 0,6/1 kV',
      mainBreakerIn: 25,
      mainBreakerCurve: 'C',
      mainBreakerPdc: 10,
      hasDifferential: true,
      differentialSensitivity: 30,
      hasGrounding: true,
      groundingResistance: 0,
      compliesWithRic: true,
      observations: '',
      installerSignature: undefined,
      clientSignature: undefined,
    });
  };

  if (!decl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const update = (changes: Partial<TE1Declaration>) => setDecl({ ...decl, ...changes });

  const handleSave = async () => {
    if (savedId) {
      await updateTE1(savedId, decl);
    } else {
      await addTE1(decl);
      setSavedId(decl.id);
    }
  };

  const handlePDF = () => {
    downloadTE1PDF(decl, profile);
  };

  const validations = [
    { ok: !!decl.installerName, msg: 'Falta nombre del instalador' },
    { ok: !!decl.installerSecNumber, msg: 'Falta N° SEC del instalador' },
    { ok: !!decl.clientName, msg: 'Falta nombre del cliente' },
    { ok: !!decl.clientRut, msg: 'Falta RUT del cliente' },
    { ok: !!decl.address, msg: 'Falta dirección' },
    { ok: decl.installedPowerKW > 0, msg: 'Potencia instalada debe ser > 0' },
    { ok: decl.totalCircuits > 0, msg: 'Debe haber al menos 1 circuito' },
  ];
  const isValid = validations.every((v) => v.ok);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Declaración TE1" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        <div className="card space-y-2 bg-accent-secondary/5 border border-accent-secondary/30">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-secondary" />
            <div>
              <p className="text-sm font-semibold text-foreground">TE1 · RIC N°18 y N°19</p>
              <p className="text-xs text-muted-foreground">Declaración para energización ante la empresa distribuidora</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">N° {decl.number}</p>
        </div>

        {/* Instalador */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-foreground">1. Instalador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Nombre</Label><Input value={decl.installerName} onChange={(e) => update({ installerName: e.target.value })} /></div>
            <div className="space-y-2"><Label>RUT</Label><Input value={decl.installerRut} onChange={(e) => update({ installerRut: e.target.value })} placeholder="12.345.678-9" /></div>
            <div className="space-y-2"><Label>N° Registro SEC</Label><Input value={decl.installerSecNumber} onChange={(e) => update({ installerSecNumber: e.target.value })} /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input value={decl.installerPhone} onChange={(e) => update({ installerPhone: e.target.value })} placeholder="+56 9 ..." /></div>
            <div className="space-y-2 md:col-span-2"><Label>Dirección</Label><Input value={decl.installerAddress} onChange={(e) => update({ installerAddress: e.target.value })} /></div>
          </div>
        </div>

        {/* Cliente */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-foreground">2. Cliente y ubicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Cliente</Label><Input value={decl.clientName} onChange={(e) => update({ clientName: e.target.value })} /></div>
            <div className="space-y-2"><Label>RUT</Label><Input value={decl.clientRut} onChange={(e) => update({ clientRut: e.target.value })} placeholder="12.345.678-9" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Dirección</Label><Input value={decl.address} onChange={(e) => update({ address: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Comuna</Label>
              <select value={decl.commune} onChange={(e) => update({ commune: e.target.value })} className="input-field">
                <option value="">Seleccionar</option>
                {REGIONS.find((r) => r.id === decl.region)?.communes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Región</Label>
              <select value={decl.region} onChange={(e) => update({ region: e.target.value, commune: '' })} className="input-field">
                {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="card space-y-3">
          <button onClick={() => setShowTech((v) => !v)} className="w-full flex items-center justify-between">
            <h3 className="font-semibold text-foreground">3. Características de la instalación</h3>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showTech ? 'rotate-180' : ''}`} />
          </button>
          {showTech && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select value={decl.installationType} onChange={(e) => update({ installationType: e.target.value as InstallationType })} className="input-field">
                  <option value="nueva">Nueva</option>
                  <option value="ampliacion">Ampliación</option>
                  <option value="modificacion">Modificación</option>
                  <option value="reparacion">Reparación</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Destino</Label>
                <select value={decl.installationDest} onChange={(e) => update({ installationDest: e.target.value as InstallationDest })} className="input-field">
                  <option value="vivienda">Vivienda</option>
                  <option value="oficina">Oficina</option>
                  <option value="local">Local comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="space-y-2"><Label>Superficie (m²)</Label><Input type="number" value={decl.installationArea} onChange={(e) => update({ installationArea: parseFloat(e.target.value) || 0 })} /></div>
              <div className="space-y-2">
                <Label>Empalme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <select value={decl.empalmeType} onChange={(e) => update({ empalmeType: e.target.value as EmpalmeType })} className="input-field">
                    <option value="monofasico">Monofásico</option>
                    <option value="trifasico">Trifásico</option>
                  </select>
                  <select value={decl.empalmeCapacity} onChange={(e) => update({ empalmeCapacity: parseInt(e.target.value) as 10 | 16 | 20 | 25 | 32 | 40 | 50 | 63 | 80 | 100 })} className="input-field">
                    {[6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100].map((v) => <option key={v} value={v}>{v} A</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fases</Label>
                <select value={decl.phasesCount} onChange={(e) => update({ phasesCount: parseInt(e.target.value) as 1 | 3 })} className="input-field">
                  <option value={1}>1 fase</option>
                  <option value={3}>3 fases</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Datos eléctricos */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-foreground">4. Características eléctricas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Potencia instalada (kW)</Label><Input type="number" value={decl.installedPowerKW} onChange={(e) => update({ installedPowerKW: parseFloat(e.target.value) || 0 })} step="0.1" /></div>
            <div className="space-y-2"><Label>Total circuitos</Label><Input type="number" value={decl.totalCircuits} onChange={(e) => update({ totalCircuits: parseInt(e.target.value) || 0 })} /></div>
            <div className="space-y-2"><Label>Iluminación</Label><Input type="number" value={decl.lightingCircuits} onChange={(e) => update({ lightingCircuits: parseInt(e.target.value) || 0 })} /></div>
            <div className="space-y-2"><Label>Enchufes</Label><Input type="number" value={decl.outletCircuits} onChange={(e) => update({ outletCircuits: parseInt(e.target.value) || 0 })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Dedicados</Label><Input type="number" value={decl.dedicatedCircuits} onChange={(e) => update({ dedicatedCircuits: parseInt(e.target.value) || 0 })} /></div>
          </div>
        </div>

        {/* Protecciones */}
        <div className="card space-y-3">
          <button onClick={() => setShowProtection((v) => !v)} className="w-full flex items-center justify-between">
            <h3 className="font-semibold text-foreground">5. Conductores y protecciones</h3>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showProtection ? 'rotate-180' : ''}`} />
          </button>
          {showProtection && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>Sección (mm²)</Label><Input type="number" value={decl.mainConductorSection} onChange={(e) => update({ mainConductorSection: parseFloat(e.target.value) || 0 })} /></div>
                <div className="space-y-2">
                  <Label>Material</Label>
                  <select value={decl.mainConductorMaterial} onChange={(e) => update({ mainConductorMaterial: e.target.value as 'cobre' | 'aluminio' })} className="input-field">
                    <option value="cobre">Cobre</option>
                    <option value="aluminio">Aluminio</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Tipo</Label><Input value={decl.mainConductorType} onChange={(e) => update({ mainConductorType: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>ITM (A)</Label><Input type="number" value={decl.mainBreakerIn} onChange={(e) => update({ mainBreakerIn: parseFloat(e.target.value) || 0 })} /></div>
                <div className="space-y-2">
                  <Label>Curva</Label>
                  <select value={decl.mainBreakerCurve} onChange={(e) => update({ mainBreakerCurve: e.target.value as 'B' | 'C' | 'D' })} className="input-field">
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>PdC (kA)</Label><Input type="number" value={decl.mainBreakerPdc} onChange={(e) => update({ mainBreakerPdc: parseFloat(e.target.value) || 0 })} /></div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={decl.hasDifferential} onChange={(e) => update({ hasDifferential: e.target.checked })} className="accent-accent-primary" />
                  Diferencial
                </label>
                {decl.hasDifferential && (
                  <select value={decl.differentialSensitivity} onChange={(e) => update({ differentialSensitivity: parseInt(e.target.value) as 30 | 300 | 500 })} className="input-field max-w-[140px]">
                    <option value={30}>30 mA</option>
                    <option value={300}>300 mA</option>
                    <option value={500}>500 mA</option>
                  </select>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={decl.hasGrounding} onChange={(e) => update({ hasGrounding: e.target.checked })} className="accent-accent-primary" />
                  Puesta a tierra
                </label>
                {decl.hasGrounding && (
                  <Input type="number" value={decl.groundingResistance} onChange={(e) => update({ groundingResistance: parseFloat(e.target.value) || 0 })} suffix="Ω" step="0.1" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="card space-y-2">
          <Label>Observaciones</Label>
          <textarea value={decl.observations} onChange={(e) => update({ observations: e.target.value })} rows={3} className="input-field resize-none" placeholder="Notas adicionales para la SEC o la distribuidora..." />
        </div>

        {/* Firmas digitales */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-foreground">Firmas</h3>
          <SignaturePad
            value={decl.installerSignature}
            onChange={(d) => update({ installerSignature: d, signedAt: d ? new Date() : undefined })}
            label={`Firma del instalador · ${decl.installerName || '—'}`}
          />
          <div className="border-t border-border" />
          <SignaturePad
            value={decl.clientSignature}
            onChange={(d) => update({ clientSignature: d })}
            label={`Firma del cliente · ${decl.clientName || '—'}`}
          />
        </div>

        {/* Validación */}
        {!isValid && (
          <div className="card space-y-1 bg-accent-warning/5 border border-accent-warning/30">
            <p className="text-xs font-semibold text-accent-warning">Antes de generar el PDF:</p>
            {validations.filter((v) => !v.ok).map((v, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {v.msg}</p>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="grid grid-cols-3 gap-2 sticky bottom-20 md:bottom-4">
          <Button onClick={handleSave} variant="outline">
            <Save className="w-4 h-4 mr-1" /> {savedId ? 'Actual.' : 'Guardar'}
          </Button>
          <Button onClick={handlePDF} variant="outline">
            <FileDown className="w-4 h-4 mr-1" /> PDF
          </Button>
          <Button onClick={() => shareTE1ViaWhatsApp(decl)}>
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
