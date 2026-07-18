'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocalización no soportada' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Posición no disponible';
            break;
          case error.TIMEOUT:
            message = 'Tiempo de espera agotado';
            break;
          default:
            message = 'Error al obtener ubicación';
        }
        setState(prev => ({
          ...prev,
          error: message,
          loading: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, getLocation };
}
