/**
 * Helpers para compartir cotizaciones y declaraciones TE1 vía WhatsApp.
 * Usa la API wa.me que abre la app móvil o web de WhatsApp con un mensaje prearmado.
 */

import type { Quote, TE1Declaration, ElectricianProfile } from '@/types';
import { formatCurrency, formatDate } from './formatters';

/** Limpia el teléfono para wa.me (solo dígitos, con código de país). */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/** Abre WhatsApp con un mensaje prearmado a un número (o sin número, al chat general). */
export function openWhatsApp(phone: string | undefined, message: string) {
  const url = phone
    ? `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ─── Cotización ───────────────────────────────────────────────────────────

export function buildQuoteMessage(quote: Quote, profile: ElectricianProfile | null): string {
  const lines: string[] = [];
  lines.push(`*Cotización ${quote.number}*`);
  if (profile?.name) lines.push(`${profile.name}${profile.secNumber ? ` · SEC N° ${profile.secNumber}` : ''}`);
  lines.push('');
  if (quote.clientName) lines.push(`*Cliente:* ${quote.clientName}`);
  if (quote.address) lines.push(`*Dirección:* ${quote.address}, ${quote.commune}`);
  lines.push(`*Válida hasta:* ${formatDate(quote.validUntil)}`);
  lines.push('');
  lines.push('*Items:*');
  for (const it of quote.items) {
    lines.push(`• ${it.quantity} ${it.unit} — ${it.description}: ${formatCurrency(it.total)}`);
  }
  if (quote.labor.hours > 0) {
    lines.push(`• ${quote.labor.hours} h mano de obra: ${formatCurrency(quote.labor.total)}`);
  }
  lines.push('');
  lines.push(`*Subtotal:* ${formatCurrency(quote.subtotalMaterials + quote.subtotalLabor)}`);
  lines.push(`*IVA (${quote.taxPct}%):* ${formatCurrency(quote.taxAmount)}`);
  lines.push(`*TOTAL:* ${formatCurrency(quote.total)}`);
  if (quote.notes) {
    lines.push('');
    lines.push(`_Notas:_ ${quote.notes}`);
  }
  lines.push('');
  lines.push('— Cotización generada por ElectriChile Pro');
  return lines.join('\n');
}

export function shareQuoteViaWhatsApp(quote: Quote, profile: ElectricianProfile | null) {
  openWhatsApp(quote.clientPhone, buildQuoteMessage(quote, profile));
}

// ─── TE1 ──────────────────────────────────────────────────────────────────

export function buildTE1Message(decl: TE1Declaration): string {
  const lines: string[] = [];
  lines.push(`*Declaración TE1 ${decl.number}*`);
  lines.push('');
  lines.push(`*Cliente:* ${decl.clientName}`);
  lines.push(`*RUT:* ${decl.clientRut}`);
  lines.push(`*Dirección:* ${decl.address}, ${decl.commune}`);
  lines.push('');
  const typeLabel = { nueva: 'Nueva', ampliacion: 'Ampliación', modificacion: 'Modificación', reparacion: 'Reparación' }[decl.installationType];
  lines.push(`*Tipo:* ${typeLabel}`);
  lines.push(`*Empalme:* ${decl.empalmeType} ${decl.empalmeCapacity} A`);
  lines.push(`*Potencia instalada:* ${decl.installedPowerKW} kW`);
  lines.push(`*Circuitos:* ${decl.totalCircuits}`);
  lines.push('');
  lines.push(`*Instalador:* ${decl.installerName} · SEC ${decl.installerSecNumber}`);
  lines.push('');
  lines.push('Adjunto encontrarás el PDF con la declaración completa para energización ante la empresa distribuidora.');
  lines.push('');
  lines.push('— Generado por ElectriChile Pro');
  return lines.join('\n');
}

export function shareTE1ViaWhatsApp(decl: TE1Declaration) {
  openWhatsApp(decl.installerPhone, buildTE1Message(decl));
}
