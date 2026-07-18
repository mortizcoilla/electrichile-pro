/**
 * Generador de PDF para la Declaración de Instalación Eléctrica (TE1)
 * según RIC N°18 "Presentación de Proyectos" y N°19 "Puesta en Servicio".
 *
 * Documento que el instalador electricista presenta a la empresa distribuidora
 * para que energice la instalación, junto al protocolo de pruebas.
 *
 * Esta es una versión simplificada que cubre los campos esenciales para
 * una declaración tipo residencial/comercial.
 */

import jsPDF from 'jspdf';
import type { TE1Declaration, ElectricianProfile } from '@/types';
import { formatDate, formatNumber } from './formatters';

export function generateTE1PDF(declaration: TE1Declaration, profile?: ElectricianProfile | null): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // ── Header ─────────────────────────────────────────────────────────────
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DECLARACIÓN DE INSTALACIÓN ELÉCTRICA', pageW / 2, 13, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('TE1 — Según RIC N°18 y N°19 (SEC)', pageW / 2, 21, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`N° ${declaration.number}`, pageW / 2, 27, { align: 'center' });

  // Logo del electricista (si existe)
  if (profile?.logo) {
    try {
      doc.addImage(profile.logo, 'PNG', pageW - margin - 18, 4, 16, 16);
    } catch { /* ignore */ }
  }

  y = 40;

  // ── Sección 1: Instalador ─────────────────────────────────────────────
  drawSectionHeader(doc, '1. INSTALADOR ELÉCTRICO', margin, y, pageW);
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const inst = declaration;
  y = drawKV(doc, [
    ['Nombre', inst.installerName],
    ['RUT', inst.installerRut],
    ['N° de registro SEC', inst.installerSecNumber],
    ['Teléfono', inst.installerPhone],
    ['Dirección', inst.installerAddress],
  ], margin, y);

  y += 4;
  // ── Sección 2: Cliente / ubicación ─────────────────────────────────────
  drawSectionHeader(doc, '2. CLIENTE Y UBICACIÓN DE LA INSTALACIÓN', margin, y, pageW);
  y += 8;
  y = drawKV(doc, [
    ['Cliente', inst.clientName],
    ['RUT', inst.clientRut],
    ['Dirección', inst.address],
    ['Comuna', inst.commune],
    ['Región', inst.region],
  ], margin, y);

  y += 4;
  // ── Sección 3: Tipo de instalación ─────────────────────────────────────
  drawSectionHeader(doc, '3. CARACTERÍSTICAS DE LA INSTALACIÓN', margin, y, pageW);
  y += 8;
  const typeLabel = { nueva: 'Nueva', ampliacion: 'Ampliación', modificacion: 'Modificación', reparacion: 'Reparación' }[inst.installationType];
  const destLabel = { vivienda: 'Vivienda', oficina: 'Oficina', local: 'Local comercial', industrial: 'Industrial', otro: 'Otro' }[inst.installationDest];
  y = drawKV(doc, [
    ['Tipo', typeLabel],
    ['Destino', destLabel],
    ['Superficie', `${formatNumber(inst.installationArea, 1)} m²`],
    ['Empalme', `${inst.empalmeType} (${inst.empalmeCapacity} A)`],
    ['Fases', `${inst.phasesCount} × fase(s)`],
  ], margin, y);

  y += 4;
  // ── Sección 4: Datos eléctricos ────────────────────────────────────────
  drawSectionHeader(doc, '4. CARACTERÍSTICAS ELÉCTRICAS', margin, y, pageW);
  y += 8;
  y = drawKV(doc, [
    ['Potencia instalada', `${formatNumber(inst.installedPowerKW, 2)} kW`],
    ['Total circuitos', String(inst.totalCircuits)],
    ['Circuitos iluminación', String(inst.lightingCircuits)],
    ['Circuitos enchufes', String(inst.outletCircuits)],
    ['Circuitos dedicados', String(inst.dedicatedCircuits)],
  ], margin, y);

  y += 4;
  // ── Sección 5: Conductores y protecciones ──────────────────────────────
  drawSectionHeader(doc, '5. CONDUCTORES Y PROTECCIONES', margin, y, pageW);
  y += 8;
  y = drawKV(doc, [
    ['Conductor principal', `${inst.mainConductorSection} mm² ${inst.mainConductorMaterial.toUpperCase()} (${inst.mainConductorType})`],
    ['Protección general', `${inst.mainBreakerIn} A curva ${inst.mainBreakerCurve} · PdC ${inst.mainBreakerPdc} kA`],
    ['Protección diferencial', inst.hasDifferential ? `Sí (${inst.differentialSensitivity} mA)` : 'No'],
    ['Puesta a tierra', inst.hasGrounding ? `Sí (R = ${inst.groundingResistance} Ω)` : 'No'],
  ], margin, y);

  y += 4;
  // ── Sección 6: Declaración ─────────────────────────────────────────────
  drawSectionHeader(doc, '6. DECLARACIÓN', margin, y, pageW);
  y += 8;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const declaracion = `El instalador eléctrico que suscribe, registrado en la Superintendencia de Electricidad y Combustibles (SEC) bajo el N° ${inst.installerSecNumber || '____'}, declara que la instalación eléctrica descrita en el presente documento ha sido ejecutada de acuerdo al Reglamento de Seguridad de las Instalaciones de Consumo de Energía Eléctrica (RIC), cumple con las exigencias de los Pliegos Técnicos Normativos RIC N°01 a N°19, y se encuentra en condiciones de ser energizada.`;
  const lines = doc.splitTextToSize(declaracion, pageW - 2 * margin);
  doc.text(lines, margin, y);
  y += lines.length * 4 + 4;

  if (inst.observations) {
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    const obs = doc.splitTextToSize(inst.observations, pageW - 2 * margin);
    doc.text(obs, margin, y);
    y += obs.length * 4;
  }

  // ── Sección 7: Firmas ─────────────────────────────────────────────────
  y += 10;
  if (y > 230) { doc.addPage(); y = margin + 20; }
  drawSectionHeader(doc, '7. FIRMAS', margin, y, pageW);
  y += 20;
  const sigW = (pageW - 2 * margin - 20) / 2;
  // Caja firma instalador
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, sigW, 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma del instalador', margin + 2, y + 28);
  if (inst.installerSignature) {
    try {
      doc.addImage(inst.installerSignature, 'PNG', margin + 2, y + 2, sigW - 4, 21);
    } catch { /* ignore */ }
  }
  // Caja firma cliente
  doc.rect(margin + sigW + 20, y, sigW, 25);
  doc.text('Firma del cliente', margin + sigW + 22, y + 28);
  if (inst.clientSignature) {
    try {
      doc.addImage(inst.clientSignature, 'PNG', margin + sigW + 22, y + 2, sigW - 4, 21);
    } catch { /* ignore */ }
  }
  y += 35;

  doc.setFontSize(8);
  doc.text(`Instalador: ${inst.installerName} · RUT ${inst.installerRut}`, margin, y);
  y += 4;
  doc.text(`Cliente: ${inst.clientName} · RUT ${inst.clientRut}`, margin, y);

  // ── Footer ────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(`Documento generado el ${formatDate(new Date())} por ElectriChile Pro`, pageW / 2, pageH - 8, { align: 'center' });

  return doc.output('blob');
}

export function downloadTE1PDF(declaration: TE1Declaration, profile?: ElectricianProfile | null) {
  const blob = generateTE1PDF(declaration, profile);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${declaration.number}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function drawSectionHeader(doc: jsPDF, title: string, x: number, y: number, pageW: number) {
  doc.setFillColor(241, 245, 249);
  doc.rect(x, y, pageW - 2 * x, 6, 'F');
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(title, x + 2, y + 4);
  doc.setTextColor(20, 20, 20);
}

function drawKV(doc: jsPDF, rows: [string, string][], x: number, y: number): number {
  const colW = 50;
  doc.setFont('helvetica', 'bold');
  for (const [k] of rows) {
    doc.setFontSize(8.5);
    doc.text(k, x, y);
  }
  doc.setFont('helvetica', 'normal');
  for (const [, v] of rows) {
    doc.text(v, x + colW, y);
  }
  return y + 6;
}
