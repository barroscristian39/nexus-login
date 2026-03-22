import { useState, useEffect } from 'react';

/**
 * Hook para detectar se a viewport é mobile (< 640px)
 * Usa o breakpoint 'sm' do Tailwind
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Verificar no initial render (SSR-safe)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
