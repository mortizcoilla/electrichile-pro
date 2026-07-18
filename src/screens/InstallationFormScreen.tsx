'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, FileText, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInstallationStore } from '@/stores/installationStore';
import { REGIONS } from '@/data/regions';
import { formatRut, validateRut } from '@/utils/formatters';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCamera } from '@/hooks/useCamera';
import { generateInstallationPDF } from '@/utils/pdfGenerator';
import { addInstallation } from '@/database/db';

interface Props {
  onBack: () => void;
}

const STEPS = ['Datos', 'Fotos', 'Técnico', 'Firma'];

export default function InstallationFormScreen({ onBack }: Props) {
  const [step, setStep] = useState(0);
  const store = useInstallationStore();
  const { currentInstallation, setCurrentInstallation } = store;
  const geo = useGeolocation();
  const cam = useCamera();
  const [stepError, setStepError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const signatureRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  const selectedRegion = REGIONS.find((r) => r.name === currentInstallation.region);

  const handleRutChange = (value: string) => {
    setCurrentInstallation({ clientRut: formatRut(value) });
  };

  const handleNextFromData = () => {
    const name = (currentInstallation.clientName || '').trim();
    const rut = currentInstallation.clientRut || '';
    const address = (currentInstallation.address || '').trim();
    if (!name || !rut || !address) {
      setStepError('Completa nombre, RUT y dirección para continuar');
      return;
    }
    if (!validateRut(rut)) {
      setStepError('El RUT ingresado no es válido');
      return;
    }
    setStepError('');
    setStep(1);
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = signatureRef.current?.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const { x, y } = getCanvasPoint(e);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = signatureRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = signatureRef.current;
    if (canvas) store.setSignature(canvas.toDataURL('image/png'));
  };

  const clearSignature = () => {
    const canvas = signatureRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    store.setSignature('');
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    try {
      if (cam.photo) {
        setCurrentInstallation({
          photos: [{ id: crypto.randomUUID(), dataUrl: cam.photo, timestamp: new Date() }],
        });
      }
      if (geo.lat != null && geo.lng != null) {
        setCurrentInstallation({ location: { lat: geo.lat, lng: geo.lng } });
      }
      const installation = store.buildInstallation();
      await generateInstallationPDF(installation);
      await addInstallation(installation);
      store.setInstallations([...store.installations, installation]);
      store.resetCurrentInstallation();
      cam.clearPhoto();
      onBack();
    } catch (error) {
      console.error(error);
      setSaveError('No se pudo generar el certificado. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Nueva Instalación" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  i === step
                    ? 'bg-accent-primary text-background'
                    : i < step
                    ? 'bg-accent-success text-white'
                    : 'bg-elevated text-muted'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground">Datos del Cliente</h3>
              <div className="space-y-2">
                <Label>Nombre del cliente</Label>
                <Input value={currentInstallation.clientName || ''} onChange={(e) => setCurrentInstallation({ clientName: e.target.value })} placeholder="Juan Pérez" />
              </div>
              <div className="space-y-2">
                <Label>RUT</Label>
                <Input value={currentInstallation.clientRut || ''} onChange={(e) => handleRutChange(e.target.value)} placeholder="12.345.678-9" />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input value={currentInstallation.address || ''} onChange={(e) => setCurrentInstallation({ address: e.target.value })} placeholder="Av. Principal 1234" />
              </div>
              <div className="space-y-2">
                <Label>Región</Label>
                <select value={currentInstallation.region || ''} onChange={(e) => setCurrentInstallation({ region: e.target.value, commune: '' })} className="input-field">
                  <option value="">Seleccionar región</option>
                  {REGIONS.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
                </select>
              </div>
              {selectedRegion && (
                <div className="space-y-2">
                  <Label>Comuna</Label>
                  <select value={currentInstallation.commune || ''} onChange={(e) => setCurrentInstallation({ commune: e.target.value })} className="input-field">
                    <option value="">Seleccionar comuna</option>
                    {selectedRegion.communes.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Tipo de obra</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['nueva', 'ampliacion', 'mantenimiento'] as const).map((t) => (
                    <button key={t} onClick={() => setCurrentInstallation({ type: t })} className={`p-3 rounded-xl text-xs font-medium transition-all ${currentInstallation.type === t ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                      {t === 'nueva' ? 'Nueva' : t === 'ampliacion' ? 'Ampliación' : 'Mantención'}
                    </button>
                  ))}
                </div>
              </div>
              {stepError && <p className="text-xs text-accent-danger">{stepError}</p>}
              <Button onClick={handleNextFromData} className="w-full">Siguiente</Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground">Fotos y Ubicación</h3>
              <input ref={cam.inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={cam.handleFileChange} />
              <Button variant="secondary" onClick={cam.takePhoto} className="w-full">
                <Camera className="w-5 h-5 mr-2" /> Tomar foto
              </Button>
              {cam.photo && (
                <div className="relative">
                  <img src={cam.photo} alt="Foto" className="w-full h-40 object-cover rounded-xl" />
                  <button onClick={cam.clearPhoto} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">×</button>
                </div>
              )}
              <Button variant="secondary" onClick={geo.getLocation} className="w-full" disabled={geo.loading}>
                <MapPin className="w-5 h-5 mr-2" />
                {geo.loading ? 'Obteniendo...' : 'Obtener ubicación'}
              </Button>
              {geo.lat && geo.lng && (
                <p className="text-xs text-accent-success">Lat: {geo.lat.toFixed(6)}, Lng: {geo.lng.toFixed(6)}</p>
              )}
              {geo.error && <p className="text-xs text-accent-danger">{geo.error}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Atrás</Button>
                <Button onClick={() => setStep(2)} className="flex-1">Siguiente</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground">Memoria Técnica</h3>
              <div className="space-y-2">
                <Label>Descripción técnica</Label>
                <textarea value={currentInstallation.technicalNotes || ''} onChange={(e) => setCurrentInstallation({ technicalNotes: e.target.value })} rows={4} className="input-field resize-none" placeholder="Describe la instalación..." />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Atrás</Button>
                <Button onClick={() => setStep(3)} className="flex-1">Siguiente</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground">Firma y Certificado</h3>
              <canvas
                ref={signatureRef}
                width={400}
                height={180}
                className="w-full h-[180px] bg-white rounded-xl border border-border touch-none cursor-crosshair"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={endDrawing}
                onPointerLeave={endDrawing}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">El cliente firma aquí</p>
                <Button variant="ghost" size="sm" onClick={clearSignature}>Limpiar</Button>
              </div>
              {!currentInstallation.signature && (
                <p className="text-xs text-muted text-center">Se requiere la firma para generar el certificado</p>
              )}
              {saveError && <p className="text-xs text-accent-danger">{saveError}</p>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Atrás</Button>
                <Button onClick={handleSave} className="flex-1" disabled={!currentInstallation.signature || saving}>
                  <FileText className="w-4 h-4 mr-2" /> {saving ? 'Generando...' : 'Generar PDF'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
