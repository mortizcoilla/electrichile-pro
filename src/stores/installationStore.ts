import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Installation, MaterialItem, Calculation } from '@/types';
import { generateCertificateNumber } from '@/utils/formatters';

interface InstallationState {
  installations: Installation[];
  currentInstallation: Partial<Installation>;
  setInstallations: (installations: Installation[]) => void;
  setCurrentInstallation: (data: Partial<Installation>) => void;
  resetCurrentInstallation: () => void;
  addMaterial: (material: MaterialItem) => void;
  removeMaterial: (id: string) => void;
  updateMaterial: (id: string, changes: Partial<MaterialItem>) => void;
  addCalculation: (calc: Calculation) => void;
  setSignature: (signature: string) => void;
  buildInstallation: () => Installation;
}

const emptyInstallation = (): Partial<Installation> => ({
  clientName: '',
  clientRut: '',
  address: '',
  commune: '',
  region: '',
  type: 'nueva',
  photos: [],
  technicalNotes: '',
  materials: [],
  calculations: [],
  certificateNumber: generateCertificateNumber(),
  status: 'draft',
});

export const useInstallationStore = create<InstallationState>()(
  persist(
    (set, get) => ({
      installations: [],
      currentInstallation: emptyInstallation(),
      setInstallations: (installations) => set({ installations }),
      setCurrentInstallation: (data) =>
        set((state) => ({
          currentInstallation: { ...state.currentInstallation, ...data },
        })),
      resetCurrentInstallation: () => set({ currentInstallation: emptyInstallation() }),
      addMaterial: (material) =>
        set((state) => ({
          currentInstallation: {
            ...state.currentInstallation,
            materials: [...(state.currentInstallation.materials || []), material],
          },
        })),
      removeMaterial: (id) =>
        set((state) => ({
          currentInstallation: {
            ...state.currentInstallation,
            materials: (state.currentInstallation.materials || []).filter((m) => m.id !== id),
          },
        })),
      updateMaterial: (id, changes) =>
        set((state) => ({
          currentInstallation: {
            ...state.currentInstallation,
            materials: (state.currentInstallation.materials || []).map((m) =>
              m.id === id ? { ...m, ...changes } : m
            ),
          },
        })),
      addCalculation: (calc) =>
        set((state) => ({
          currentInstallation: {
            ...state.currentInstallation,
            calculations: [...(state.currentInstallation.calculations || []), calc],
          },
        })),
      setSignature: (signature) =>
        set((state) => ({
          currentInstallation: { ...state.currentInstallation, signature },
        })),
      buildInstallation: () => {
        const state = get();
        return {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          clientName: state.currentInstallation.clientName || '',
          clientRut: state.currentInstallation.clientRut || '',
          address: state.currentInstallation.address || '',
          commune: state.currentInstallation.commune || '',
          region: state.currentInstallation.region || '',
          type: state.currentInstallation.type || 'nueva',
          photos: state.currentInstallation.photos || [],
          location: state.currentInstallation.location,
          technicalNotes: state.currentInstallation.technicalNotes || '',
          materials: state.currentInstallation.materials || [],
          calculations: state.currentInstallation.calculations || [],
          signature: state.currentInstallation.signature,
          certificateNumber: state.currentInstallation.certificateNumber || generateCertificateNumber(),
          status: 'completed' as const,
        };
      },
    }),
    {
      name: 'electrichile-installations',
      partialize: (state) => ({
        currentInstallation: { ...state.currentInstallation, photos: [] },
      }),
    }
  )
);
