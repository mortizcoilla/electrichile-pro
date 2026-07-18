/**
 * Generador de PDF para cotizaciones.
 * Usa jsPDF (ya instalado) para crear un PDF profesional con:
 *   - Header con datos del electricista
 *   - Datos del cliente
 *   - Tabla de items con subtotales
 *   - Mano de obra
 *   - Totales (subtotal, descuento, IVA, total)
 *   - Validez
 *   - Notas al pie
 *
 * Devuelve un Blob URL para descarga directa.
 */

import jsPDF from 'jspdf';
import type { Quote, ElectricianProfile } from '@/types';
import { formatCurrency, formatDate } from './formatters';

export function generateQuotePDF(quote: Quote, profile: ElectricianProfile | null): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // ── Header ─────────────────────────────────────────────────────────────
  doc.setFillColor(245, 158, 11); // accent-primary
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('COTIZACIÓN', margin, 14);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${quote.number}`, margin, 21);
  doc.setFontSize(9);
  doc.text(`Emitida: ${formatDate(quote.createdAt)}`, pageW - margin, 14, { align: 'right' });
  doc.text(`Válida hasta: ${formatDate(quote.validUntil)}`, pageW - margin, 21, { align: 'right' });

  // Logo del electricista (si existe)
  if (profile?.logo) {
    try {
      doc.addImage(profile.logo, 'PNG', pageW - margin - 22, 4, 20, 20);
    } catch { /* ignore */ }
  }

  y = 38;

  // ── Datos del electricista ─────────────────────────────────────────────
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTALADOR', margin, y);
  doc.setFont('helvetica', 'normal');
  if (profile) {
    y += 5;
    doc.text(profile.name || '—', margin, y);
    y += 4;
    if (profile.rut) { doc.text(`RUT: ${profile.rut}`, margin, y); y += 4; }
    if (profile.secNumber) { doc.text(`SEC N°: ${profile.secNumber}`, margin, y); y += 4; }
    if (profile.phone) { doc.text(`Tel: ${profile.phone}`, margin, y); y += 4; }
  } else {
    y += 5;
    doc.text('Configura tu perfil en la app', margin, y);
    y += 4;
  }

  // ── Datos del cliente ─────────────────────────────────────────────────
  const clienteX = pageW / 2 + 5;
  let cy = 38;
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE', clienteX, cy);
  doc.setFont('helvetica', 'normal');
  cy += 5;
  doc.text(quote.clientName || '—', clienteX, cy); cy += 4;
  if (quote.clientRut) { doc.text(`RUT: ${quote.clientRut}`, clienteX, cy); cy += 4; }
  if (quote.clientPhone) { doc.text(`Tel: ${quote.clientPhone}`, clienteX, cy); cy += 4; }
  if (quote.address) { doc.text(quote.address, clienteX, cy); cy += 4; }
  if (quote.commune || quote.region) {
    doc.text(`${quote.commune}, ${quote.region}`, clienteX, cy); cy += 4;
  }

  y = Math.max(y, cy) + 6;

  // ── Tabla de items ────────────────────────────────────────────────────
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageW - 2 * margin, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESCRIPCIÓN', margin + 2, y + 5.5);
  doc.text('CANT.', margin + 95, y + 5.5);
  doc.text('UNIDAD', margin + 110, y + 5.5);
  doc.text('P. UNIT.', margin + 130, y + 5.5);
  doc.text('DESC%', margin + 150, y + 5.5);
  doc.text('TOTAL', pageW - margin - 2, y + 5.5, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  for (const item of quote.items) {
    if (y > 250) { doc.addPage(); y = margin; }
    doc.text(item.description.slice(0, 50), margin + 2, y + 5);
    doc.text(String(item.quantity), margin + 95, y + 5);
    doc.text(item.unit, margin + 110, y + 5);
    doc.text(formatCurrency(item.unitPrice), margin + 130, y + 5);
    doc.text(`${item.discountPct}%`, margin + 150, y + 5);
    doc.text(formatCurrency(item.total), pageW - margin - 2, y + 5, { align: 'right' });
    y += 7;
  }

  // ── Mano de obra ──────────────────────────────────────────────────────
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('MANO DE OBRA', margin, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`${quote.labor.hours} h × ${formatCurrency(quote.labor.hourlyRate)}/h (factor ${quote.labor.difficultyFactor})`,
    margin, y);
  y += 7;

  // ── Totales ────────────────────────────────────────────────────────────
  const totX = pageW - margin - 60;
  doc.setDrawColor(220, 220, 220);
  doc.line(totX, y, pageW - margin, y); y += 5;
  doc.setFontSize(9);
  doc.text('Subtotal materiales:', totX, y);
  doc.text(formatCurrency(quote.subtotalMaterials), pageW - margin, y, { align: 'right' }); y += 5;
  doc.text('Subtotal mano de obra:', totX, y);
  doc.text(formatCurrency(quote.subtotalLabor), pageW - margin, y, { align: 'right' }); y += 5;
  if (quote.discountPct > 0) {
    doc.text(`Descuento global (${quote.discountPct}%):`, totX, y);
    const descAmount = Math.round((quote.subtotalMaterials + quote.subtotalLabor) * quote.discountPct / 100);
    doc.text(`- ${formatCurrency(descAmount)}`, pageW - margin, y, { align: 'right' }); y += 5;
  }
  doc.text(`IVA (${quote.taxPct}%):`, totX, y);
  doc.text(formatCurrency(quote.taxAmount), pageW - margin, y, { align: 'right' }); y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setFillColor(245, 158, 11);
  doc.rect(totX - 5, y - 5, 65, 10, 'F');
  doc.setTextColor(20, 20, 20);
  doc.text('TOTAL:', totX, y + 2);
  doc.text(formatCurrency(quote.total), pageW - margin, y + 2, { align: 'right' });
  y += 14;

  // ── Notas ─────────────────────────────────────────────────────────────
  if (quote.notes) {
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('NOTAS:', margin, y); y += 5;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(quote.notes, pageW - 2 * margin);
    doc.text(lines, margin, y);
  }

  // ── Firma del cliente ──────────────────────────────────────────────────
  if (quote.clientSignature) {
    if (y > 230) { doc.addPage(); y = margin; }
    y += 10;
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ACEPTACIÓN DEL CLIENTE', margin, y);
    y += 6;
    try {
      doc.addImage(quote.clientSignature, 'PNG', margin, y, 60, 25);
    } catch { /* ignore */ }
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y + 27, margin + 60, y + 27);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(quote.clientName || 'Cliente', margin, y + 32);
    if (quote.clientRut) doc.text(`RUT: ${quote.clientRut}`, margin, y + 36);
  }

  // ── Footer ────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('Documento generado por ElectriChile Pro · Cotización no constituye orden de compra', pageW / 2, pageH - 8, { align: 'center' });

  return doc.output('blob');
}

export function downloadQuotePDF(quote: Quote, profile: ElectricianProfile | null) {
  const blob = generateQuotePDF(quote, profile);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${quote.number}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
