export const KW_TO_HP = 1.34102;
export const HP_TO_KW = 0.746;

export const AWG_TABLE: Record<number, string> = {
  1.5: '16', 2.5: '14', 4: '12', 6: '10', 10: '8', 16: '6',
  25: '4', 35: '2', 50: '1/0', 70: '2/0', 95: '3/0', 120: '4/0',
  150: '300 MCM', 185: '350 MCM', 240: '500 MCM', 300: '600 MCM',
};

export function kwToHp(kw: number): number {
  return kw * KW_TO_HP;
}

export function hpToKw(hp: number): number {
  return hp * HP_TO_KW;
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function mm2ToAwg(mm2: number): string {
  return AWG_TABLE[mm2] ?? 'N/A';
}

export function kwToAmps(kw: number, voltage: number, powerFactor: number = 0.85, isThreePhase: boolean = false): number {
  return (kw * 1000) / (voltage * (isThreePhase ? Math.sqrt(3) : 1) * powerFactor);
}

export function ampsToKw(amps: number, voltage: number, powerFactor: number = 0.85, isThreePhase: boolean = false): number {
  return (amps * voltage * (isThreePhase ? Math.sqrt(3) : 1) * powerFactor) / 1000;
}

export function kwhToClp(kwh: number, rate: number): number {
  return kwh * rate;
}
