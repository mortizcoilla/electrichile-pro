export function validateNumericInput(value: string): boolean {
  return /^-?\d*\.?\d*$/.test(value);
}

export function validatePositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+?56)?9\d{8}$/.test(cleaned);
}
