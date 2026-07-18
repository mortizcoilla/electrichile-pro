'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Sparkles, BookOpen, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  HELP_SECTIONS,
  QUICK_START,
  CHANGELOG,
  searchHelp,
  type HelpBlock,
  type HelpSection,
} from '@/data/helpContent';
import { useAppStore } from '@/stores/appStore';

interface Props {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

const BLOCK_VARIANT_CLASS: Record<NonNullable<HelpBlock['variant']>, string> = {
  info: 'bg-accent-secondary/10 border-accent-secondary/30 text-foreground',
  success: 'bg-accent-success/10 border-accent-success/30 text-foreground',
  warning: 'bg-accent-warning/10 border-accent-warning/30 text-foreground',
};

export default function HelpScreen({ onBack, onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ intro: true });
  const [showChangelog, setShowChangelog] = useState(false);

  const filtered = useMemo(() => searchHelp(query), [query]);
  const setActiveTab = useAppStore((s) => s.setCurrentScreen);

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const goTo = (route?: string) => {
    if (!route || !onNavigate) return;
    setActiveTab('home');
    onNavigate(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Ayuda" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        {/* Hero */}
        <div className="card bg-gradient-to-br from-accent-primary/15 to-accent-secondary/10 border border-accent-primary/30 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-primary" />
            <h1 className="text-lg font-semibold text-foreground">Centro de ayuda</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Todo lo que necesitás saber para usar ElectriChile Pro. Buscá una palabra clave o recorré las secciones.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en la ayuda..."
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick start — solo cuando no hay query */}
        {!query && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Primeros pasos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {QUICK_START.map((step) => {
                const Icon = step.icon;
                const interactive = !!step.route;
                const Wrapper = interactive ? 'button' : 'div';
                return (
                  <Wrapper
                    key={step.number}
                    onClick={interactive ? () => goTo(step.route) : undefined}
                    className={`card text-left p-3 space-y-1 ${interactive ? 'hover:bg-elevated transition-colors cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {step.number}
                      </div>
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-sm text-foreground">{step.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pl-9 leading-relaxed">{step.description}</p>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        )}

        {/* Secciones */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-sm text-muted-foreground">
                No encontré resultados para &quot;<span className="text-foreground">{query}</span>&quot;
              </p>
              <Button size="sm" variant="ghost" onClick={() => setQuery('')} className="mt-2">
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            filtered.map((section) => (
              <SectionBlock
                key={section.id}
                section={section}
                open={openSections[section.id] ?? false}
                onToggle={() => toggleSection(section.id)}
                query={query}
              />
            ))
          )}
        </div>

        {/* Changelog — solo cuando no hay query */}
        {!query && (
          <div className="card space-y-2">
            <button
              onClick={() => setShowChangelog((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-accent-primary font-semibold uppercase tracking-wide">Novedades v{CHANGELOG[0]?.version}</p>
                <p className="text-sm font-medium text-foreground">¿Qué hay de nuevo en esta versión?</p>
              </div>
              {showChangelog ? (
                <ChevronUp className="w-4 h-4 text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted" />
              )}
            </button>
            <AnimatePresence>
              {showChangelog && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2 border-t border-border"
                >
                  {CHANGELOG.map((rel) => (
                    <div key={rel.version} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{rel.date}</p>
                      <ul className="space-y-1 text-sm text-foreground/90">
                        {rel.changes.map((c, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-accent-primary shrink-0">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted text-center py-4">
          ElectriChile Pro v{CHANGELOG[0]?.version} · {CHANGELOG[0]?.date}
        </p>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  open,
  onToggle,
  query,
}: {
  section: HelpSection;
  open: boolean;
  onToggle: () => void;
  query: string;
}) {
  const Icon = section.icon;
  return (
    <div className="card overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-3 text-left">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-accent-primary/15 text-accent-primary flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{section.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{section.description}</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted shrink-0 mt-1" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border space-y-3">
              {section.content.map((block, idx) => (
                <BlockRenderer key={idx} block={block} query={query} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BlockRenderer({ block, query }: { block: HelpBlock; query: string }) {
  if (block.type === 'paragraph' && block.text) {
    return (
      <p className="text-sm text-foreground/90 leading-relaxed">
        <Highlight text={block.text} query={query} />
      </p>
    );
  }
  if (block.type === 'list' && block.items) {
    return (
      <ul className="space-y-1.5 text-sm text-foreground/90">
        {block.items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-accent-primary shrink-0 mt-0.5">•</span>
            <span><Highlight text={it} query={query} /></span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'steps' && block.items) {
    return (
      <ol className="space-y-2 text-sm text-foreground/90">
        {block.items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-elevated border border-border text-muted-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="pt-0.5"><Highlight text={it} query={query} /></span>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === 'callout' && block.text) {
    const variant = block.variant ?? 'info';
    return (
      <div className={`p-3 rounded-xl border text-sm leading-relaxed ${BLOCK_VARIANT_CLASS[variant]}`}>
        <Highlight text={block.text} query={query} />
      </div>
    );
  }
  return null;
}

/** Resalta las coincidencias de la query en el texto. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.trim();
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-accent-primary/30 text-foreground rounded px-0.5">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
