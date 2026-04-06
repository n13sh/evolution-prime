'use client';
import { useCallback, useRef } from 'react';

type SFXType = 'click' | 'hover' | 'transition' | 'success' | 'alert';

export function useSFX() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSFX = useCallback((type: SFXType, volume = 0.05) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click':
        // Short, crisp metallic click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        break;

      case 'hover':
        // Extremely subtle high-pitched blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
        break;

      case 'transition':
        // Low muffled hum for dashboard transitions
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(volume * 2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;

      case 'success':
        // Two ascending blips
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        break;

      case 'alert':
        // Slightly dissonant warning
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
    }
  }, [initAudio]);

  return { playSFX, initAudio };
}
