/**
 * Generador de PDF para Instalaciones.
 * Usado por InstallationFormScreen para emitir el certificado de instalación.
 *
 * NOTA: la versión actual es un placeholder que produce un PDF básico con
 * los datos de la instalación. Se puede extender más adelante.
 */

import jsPDF from 'jspdf';
import type { Installation } from '@/types';
import { formatDate } from './formatters';

export function generateInstallationPDF(installation: Installation): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageW, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE INSTALACIÓN', pageW / 2, 13, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${installation.certificateNumber}`, pageW / 2, 20, { align: 'center' });

  y = 35;
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(`Nombre: ${installation.clientName || '—'}`, margin, y); y += 5;
  if (installation.clientRut) { doc.text(`RUT: ${installation.clientRut}`, margin, y); y += 5; }
  if (installation.address) { doc.text(`Dirección: ${installation.address}`, margin, y); y += 5; }
  if (installation.commune) { doc.text(`Comuna: ${installation.commune}, ${installation.region}`, margin, y); y += 5; }
  y += 3;

  doc.setFont('helvetica', 'bold');
  doc.text('INSTALACIÓN', margin, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Tipo: ${installation.type}`, margin, y); y += 5;
  doc.text(`Estado: ${installation.status}`, margin, y); y += 5;
  doc.text(`Fecha: ${formatDate(installation.createdAt)}`, margin, y); y += 8;

  if (installation.technicalNotes) {
    doc.setFont('helvetica', 'bold');
    doc.text('NOTAS TÉCNICAS', margin, y); y += 6;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(installation.technicalNotes, pageW - 2 * margin);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  if (installation.materials.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIALES', margin, y); y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    for (const m of installation.materials) {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.text(`${m.quantity} ${m.unit} — ${m.name}`, margin, y);
      doc.text(`$${m.totalPrice.toLocaleString('es-CL')}`, pageW - margin, y, { align: 'right' });
      y += 5;
    }
  }

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado por ElectriChile Pro', pageW / 2, pageH - 8, { align: 'center' });

  return doc.output('blob');
}
