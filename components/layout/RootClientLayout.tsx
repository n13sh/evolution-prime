'use client';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { BackgroundVFX } from '@/components/ui/BackgroundVFX';
import { useSFX } from '@/lib/hooks/useSFX';
import { useEffect } from 'react';

export function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { initAudio } = useSFX();

  useEffect(() => {
    // Attempt to initialize audio on first interaction
    const handleInit = () => {
      initAudio();
      window.removeEventListener('mousedown', handleInit);
      window.removeEventListener('touchstart', handleInit);
      window.removeEventListener('keydown', handleInit);
    };

    window.addEventListener('mousedown', handleInit);
    window.addEventListener('touchstart', handleInit);
    window.addEventListener('keydown', handleInit);

    return () => {
      window.removeEventListener('mousedown', handleInit);
      window.removeEventListener('touchstart', handleInit);
      window.removeEventListener('keydown', handleInit);
    };
  }, [initAudio]);

  return (
    <>
      <DynamicBackground />
      <BackgroundVFX />
      {children}
    </>
  );
}
