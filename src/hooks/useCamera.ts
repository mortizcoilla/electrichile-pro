'use client';

import { useState, useCallback, useRef } from 'react';

interface CameraState {
  photo: string | null;
  error: string | null;
  loading: boolean;
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    photo: null,
    error: null,
    loading: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const takePhoto = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: 'El archivo debe ser una imagen' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const reader = new FileReader();
    reader.onload = () => {
      setState({
        photo: reader.result as string,
        error: null,
        loading: false,
      });
    };
    reader.onerror = () => {
      setState(prev => ({ ...prev, error: 'Error al leer archivo', loading: false }));
    };
    reader.readAsDataURL(file);
  }, []);

  const clearPhoto = useCallback(() => {
    setState({ photo: null, error: null, loading: false });
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return { ...state, takePhoto, clearPhoto, inputRef, handleFileChange };
}
