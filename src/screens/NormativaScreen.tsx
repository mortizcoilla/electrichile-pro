'use client';

import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { RIC_PLIEGOS, type RicArticle } from '@/data/ricRegulations';

interface Props {
  onBack: () => void;
}

export default function NormativaScreen({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Normativa RIC" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        <div className="card space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-secondary" />
            <h2 className="text-lg font-semibold text-foreground">Reglamento de Instalaciones de Consumo</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            El RIC (Resolución Exenta SEC N° 33.877, 30/12/2020) es la normativa eléctrica vigente en Chile,
            dictada en el marco del Reglamento de Seguridad de las Instalaciones de Consumo (Decreto N°8, 2019, Ministerio de Energía).
          </p>
          <p className="text-xs text-muted-foreground">
            Sólo se listan aquí los artículos directamente referenciados por las calculadoras de la app.
          </p>
        </div>

        {RIC_PLIEGOS.map((pliego) => (
          <PliegoBlock key={pliego.id} pliego={pliego} />
        ))}
      </div>
    </div>
  );
}

function PliegoBlock({ pliego }: { pliego: typeof RIC_PLIEGOS[number] }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="card space-y-3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-accent-secondary font-semibold">
            RIC N°{pliego.number}
          </p>
          <p className="text-base font-semibold text-foreground">{pliego.title}</p>
          <p className="text-xs text-muted mt-0.5">{pliego.summary}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-border">
          {pliego.articles.map((a) => (
            <ArticleRow key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleRow({ article }: { article: RicArticle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-surface/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-2 p-3 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-accent-secondary">
              pto {article.article}
            </span>
            <span className="text-sm font-medium text-foreground">{article.title}</span>
          </div>
          <p className="text-xs text-muted mt-1">{article.summary}</p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted shrink-0 mt-0.5" />
        )}
      </button>
      {open && article.quote && (
        <blockquote className="px-3 pb-3 text-xs italic text-muted-foreground border-t border-border/50 pt-2 mx-3">
          “{article.quote}”
        </blockquote>
      )}
    </div>
  );
}
