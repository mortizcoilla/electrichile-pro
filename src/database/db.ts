import Dexie, { Table } from 'dexie';
import { Installation, CalculationHistory, ElectricianProfile, Quote, TE1Declaration } from '@/types';

class ElectriChileDB extends Dexie {
  installations!: Table<Installation>;
  history!: Table<CalculationHistory>;
  profile!: Table<ElectricianProfile & { id: string }>;
  quotes!: Table<Quote>;
  te1Declarations!: Table<TE1Declaration>;

  constructor() {
    super('ElectriChileDB');
    this.version(1).stores({
      installations: 'id, createdAt, status, commune',
      history: 'id, type, timestamp, favorite',
      profile: 'id',
    });
    this.version(2).stores({
      installations: 'id, createdAt, status, commune',
      history: 'id, type, timestamp, favorite',
      profile: 'id',
      quotes: 'id, number, createdAt, status, clientRut',
      te1Declarations: 'id, number, createdAt, clientRut',
    });
  }
}

export const db = new ElectriChileDB();

export async function addInstallation(installation: Installation) {
  return db.installations.add(installation);
}

export async function updateInstallation(id: string, changes: Partial<Installation>) {
  return db.installations.update(id, { ...changes, updatedAt: new Date() });
}

export async function deleteInstallation(id: string) {
  return db.installations.delete(id);
}

export async function getInstallation(id: string) {
  return db.installations.get(id);
}

export async function getAllInstallations() {
  return db.installations.orderBy('createdAt').reverse().toArray();
}

export async function addCalculationHistory(history: CalculationHistory) {
  return db.history.add(history);
}

export async function getCalculationHistory(type?: string) {
  if (type) {
    const results = await db.history.where('type').equals(type).sortBy('timestamp');
    return results.reverse();
  }
  return db.history.orderBy('timestamp').reverse().toArray();
}

export async function toggleFavorite(id: string) {
  const item = await db.history.get(id);
  if (item) {
    await db.history.update(id, { favorite: !item.favorite });
  }
}

export async function saveProfile(profile: ElectricianProfile) {
  return db.profile.put({ ...profile, id: 'default' });
}

export async function getProfile() {
  return db.profile.get('default');
}

export async function clearAllData() {
  await db.installations.clear();
  await db.history.clear();
  await db.profile.clear();
  await db.quotes.clear();
  await db.te1Declarations.clear();
}

// ─── Quotes ────────────────────────────────────────────────────────────────

export async function addQuote(quote: Quote) {
  return db.quotes.add(quote);
}

export async function updateQuote(id: string, changes: Partial<Quote>) {
  return db.quotes.update(id, { ...changes, updatedAt: new Date() });
}

export async function deleteQuote(id: string) {
  return db.quotes.delete(id);
}

export async function getQuote(id: string) {
  return db.quotes.get(id);
}

export async function getAllQuotes() {
  return db.quotes.orderBy('createdAt').reverse().toArray();
}

export async function getNextQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const all = await db.quotes.toArray();
  const yearQuotes = all.filter((q) => q.number.startsWith(`COT-${year}-`));
  const next = yearQuotes.length + 1;
  return `COT-${year}-${String(next).padStart(3, '0')}`;
}

// ─── TE1 ───────────────────────────────────────────────────────────────────

export async function addTE1(declaration: TE1Declaration) {
  return db.te1Declarations.add(declaration);
}

export async function updateTE1(id: string, changes: Partial<TE1Declaration>) {
  return db.te1Declarations.update(id, { ...changes });
}

export async function deleteTE1(id: string) {
  return db.te1Declarations.delete(id);
}

export async function getTE1(id: string) {
  return db.te1Declarations.get(id);
}

export async function getAllTE1() {
  return db.te1Declarations.orderBy('createdAt').reverse().toArray();
}

export async function getNextTE1Number(): Promise<string> {
  const year = new Date().getFullYear();
  const all = await db.te1Declarations.toArray();
  const yearDecls = all.filter((t) => t.number.startsWith(`TE1-${year}-`));
  const next = yearDecls.length + 1;
  return `TE1-${year}-${String(next).padStart(3, '0')}`;
}
