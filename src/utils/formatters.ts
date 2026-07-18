export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
      : Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, '0');
  return `CERT-${year}-${random}`;
}

export function validateRut(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = sum % 11;
  const expected = remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder);
  return dv === expected;
}

export function formatRut(rut: string): string {
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length < 2) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}
