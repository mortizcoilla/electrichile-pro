'use client';

import { BookOpen, ExternalLink } from 'lucide-react';
import { findRicArticle, getArticlesForCalculator, getPliego, type RicArticle } from '@/data/ricRegulations';

interface RegulationRefProps {
  /** id estable del artículo, ej: "ric-03-5-1-3" */
  articleId: string;
  /** Variante visual: pill compacto o bloque expandido */
  variant?: 'pill' | 'card';
  /** Mostrar la cita textual del pliego */
  showQuote?: boolean;
}

/**
 * Muestra una referencia al RIC (Reglamento de Instalaciones de Consumo).
 */
export default function RegulationRef({
  articleId,
  variant = 'pill',
  showQuote = false,
}: RegulationRefProps) {
  const article = findRicArticle(articleId);
  if (!article) return null;
  const pliego = getPliego(article.ric);

  if (variant === 'pill') {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/30 px-2.5 py-1 text-xs text-accent-secondary"
        title={`${pliego?.shortTitle ?? ''} — ${article.title}`}
      >
        <BookOpen className="w-3 h-3" />
        <span className="font-semibold">RIC N°{article.ric}</span>
        <span className="opacity-70">pto {article.article}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-accent-secondary/30 bg-accent-secondary/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-accent-secondary" />
        <span className="text-sm font-semibold text-accent-secondary">
          RIC N°{article.ric}, pto {article.article}
        </span>
        {pliego && (
          <span className="text-xs text-muted-foreground">— {pliego.shortTitle}</span>
        )}
      </div>
      <p className="text-sm text-foreground">{article.title}</p>
      <p className="text-xs text-muted leading-relaxed">{article.summary}</p>
      {showQuote && article.quote && (
        <blockquote className="text-xs italic text-muted-foreground border-l-2 border-accent-secondary/40 pl-3 mt-1">
          “{article.quote}”
        </blockquote>
      )}
    </div>
  );
}

/** Lista de todos los artículos RIC asociados a una calculadora. */
export function RegulationRefList({ calculatorId }: { calculatorId: string }) {
  const articles: RicArticle[] = getArticlesForCalculator(calculatorId);
  if (articles.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted uppercase tracking-wide">Normativa aplicable</p>
      <div className="space-y-2">
        {articles.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border border-border bg-surface/50 p-2.5 text-xs space-y-1"
          >
            <div className="flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3 text-accent-secondary" />
              <span className="font-semibold text-accent-secondary">
                RIC N°{a.ric}, pto {a.article}
              </span>
              <span className="text-muted-foreground">— {a.title}</span>
            </div>
            <p className="text-muted leading-relaxed">{a.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
