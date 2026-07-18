'use client';

import { useState, lazy, Suspense } from 'react';
import AppShell from '@/components/layout/AppShell';
import HomeScreen from '@/screens/HomeScreen';

const CalculatorDropScreen = lazy(() => import('@/screens/CalculatorDropScreen'));
const ConverterScreen = lazy(() => import('@/screens/ConverterScreen'));
const ColorCodeScreen = lazy(() => import('@/screens/ColorCodeScreen'));
const ProtectionCalcScreen = lazy(() => import('@/screens/ProtectionCalcScreen'));
const InstallationFormScreen = lazy(() => import('@/screens/InstallationFormScreen'));
const InstallationListScreen = lazy(() => import('@/screens/InstallationListScreen'));
const SolarCalcScreen = lazy(() => import('@/screens/SolarCalcScreen'));
const EmergencyScreen = lazy(() => import('@/screens/EmergencyScreen'));
const MaterialsScreen = lazy(() => import('@/screens/MaterialsScreen'));
const SettingsScreen = lazy(() => import('@/screens/SettingsScreen'));
const NormativaScreen = lazy(() => import('@/screens/NormativaScreen'));
const AmpacityScreen = lazy(() => import('@/screens/AmpacityScreen'));
const ShortCircuitScreen = lazy(() => import('@/screens/ShortCircuitScreen'));
const SelectivityScreen = lazy(() => import('@/screens/SelectivityScreen'));
const CotizadorScreen = lazy(() => import('@/screens/CotizadorScreen'));
const QuoteListScreen = lazy(() => import('@/screens/QuoteListScreen'));
const TE1Screen = lazy(() => import('@/screens/TE1Screen'));
const HelpScreen = lazy(() => import('@/screens/HelpScreen'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [subScreen, setSubScreen] = useState<string | null>(null);

  const handleNavigate = (screen: string) => {
    setSubScreen(screen);
  };

  const handleBack = () => {
    setSubScreen(null);
  };

  if (subScreen) {
    return (
      <AppShell activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSubScreen(null); }}>
        <Suspense fallback={<LoadingFallback />}>
          {subScreen === 'voltage-drop' && <CalculatorDropScreen onBack={handleBack} />}
          {subScreen === 'converter' && <ConverterScreen onBack={handleBack} />}
          {subScreen === 'colors' && <ColorCodeScreen onBack={handleBack} />}
          {subScreen === 'protections' && <ProtectionCalcScreen onBack={handleBack} />}
          {subScreen === 'new-installation' && <InstallationFormScreen onBack={handleBack} />}
          {subScreen === 'solar' && <SolarCalcScreen onBack={handleBack} />}
          {subScreen === 'emergency' && <EmergencyScreen onBack={handleBack} />}
          {subScreen === 'normativa' && <NormativaScreen onBack={handleBack} />}
          {subScreen === 'ampacity' && <AmpacityScreen onBack={handleBack} />}
          {subScreen === 'short-circuit' && <ShortCircuitScreen onBack={handleBack} />}
          {subScreen === 'selectivity' && <SelectivityScreen onBack={handleBack} />}
          {subScreen === 'cotizador' && <CotizadorScreen onBack={handleBack} />}
          {subScreen === 'quotes' && <QuoteListScreen onBack={handleBack} onNew={() => handleNavigate('cotizador')} />}
          {subScreen === 'te1' && <TE1Screen onBack={handleBack} />}
          {subScreen === 'help' && <HelpScreen onBack={handleBack} onNavigate={handleNavigate} />}
        </Suspense>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      <Suspense fallback={<LoadingFallback />}>
        {activeTab === 'home' && <HomeScreen onNavigate={handleNavigate} />}
        {activeTab === 'installations' && <InstallationListScreen onBack={handleBack} onNew={() => handleNavigate('new-installation')} />}
        {activeTab === 'calculators' && (
          <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Calculadoras</h2>
            <button onClick={() => handleNavigate('voltage-drop')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Caída de Tensión</p>
                <p className="text-xs text-muted">Verificar RIC N°03, pto 5.1.3 (≤ 3% alimentador / 5% total)</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('converter')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Conversor de Unidades</p>
                <p className="text-xs text-muted">kW↔HP, °C↔°F, mm²↔AWG</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('protections')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Protecciones</p>
                <p className="text-xs text-muted">Dimensionar protecciones según RIC N°05</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('solar')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Solar Fotovoltaica</p>
                <p className="text-xs text-muted">Dimensionar según RIC N°09</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('normativa')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Normativa RIC</p>
                <p className="text-xs text-muted">Artículos referenciados por cada calculadora</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('ampacity')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h2l3-9 4 18 3-9h6" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Ampacidad</p>
                <p className="text-xs text-muted">Sección mínima por corriente y método de instalación (IEC 60364-5-523)</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('short-circuit')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-danger/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z M5 19h14" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Cortocircuito</p>
                <p className="text-xs text-muted">Icc máxima y mínima en el punto de la instalación</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('selectivity')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Selectividad</p>
                <p className="text-xs text-muted">Recomendación de curva B/C/D, In y poder de corte</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('cotizador')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Cotizador</p>
                <p className="text-xs text-muted">Crea cotizaciones con IVA y envíalas al cliente</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('quotes')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Mis Cotizaciones</p>
                <p className="text-xs text-muted">Historial, estados y PDF</p>
              </div>
            </button>
            <button onClick={() => handleNavigate('te1')} className="card p-4 w-full text-left flex items-center gap-3 hover:bg-elevated transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Declaración TE1</p>
                <p className="text-xs text-muted">Para energización ante la SEC (RIC N°18, N°19)</p>
              </div>
            </button>
          </div>
        )}
        {activeTab === 'materials' && <MaterialsScreen onBack={handleBack} />}
        {activeTab === 'settings' && <SettingsScreen onBack={handleBack} />}
      </Suspense>
    </AppShell>
  );
}
