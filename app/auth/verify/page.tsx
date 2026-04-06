'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSFX } from '@/lib/hooks/useSFX';

export default function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { playSFX } = useSFX();
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    playSFX('hover', 0.03);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setLoading(true);
    setError(null);
    playSFX('transition');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      playSFX('success');
      setTimeout(() => {
        router.push(data.user.role === 'coach' ? '/coach' : '/trainee');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      playSFX('alert');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    // In a real app, call resend API
    setTimeout(() => {
      setResending(false);
      setTimer(60);
      playSFX('success', 0.1);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence>
        {!success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <GlassCard className="text-center p-8 md:p-12 border-gold/20 shadow-2xl">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gold/20"
              >
                <ShieldCheck className="w-8 h-8 text-gold" />
              </motion.div>

              <h1 className="font-display font-black text-3xl tracking-tighter uppercase mb-4">
                Verify Your <span className="text-gold">Evolution</span>
              </h1>
              <p className="text-sm text-[--text-muted] mb-10 leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest font-bold">
                We sent a 6-digit access code to your secure terminal.
              </p>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="flex justify-between gap-2 md:gap-3">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={e => handleChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="w-12 h-16 md:w-14 md:h-20 glass text-center text-2xl font-black text-gold border-white/5 focus:border-gold/50 focus:ring-0 transition-all rounded-xl outline-none"
                    />
                  ))}
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-widest text-crimson"
                  >
                    {error}
                  </motion.p>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || code.some(d => !d)}
                  className="w-full h-14 uppercase tracking-[0.2em] font-black shadow-xl shadow-gold/10"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Secure Entrance
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 pt-10 border-t border-white/5">
                <button
                  onClick={handleResend}
                  disabled={timer > 0 || resending}
                  className="group flex items-center justify-center gap-3 mx-auto text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted] hover:text-gold transition-colors disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin text-gold' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  {timer > 0 ? `Resend Signal in ${timer}s` : 'Request New Signal'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(245,197,24,0.4)]">
              <ShieldCheck className="w-12 h-12 text-black" />
            </div>
            <h2 className="font-display font-black text-4xl tracking-tighter uppercase mb-4">Identity <span className="text-gold">Secured</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[--text-muted]">Initiating Bio-Metrics Sync...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
