'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw, Mail, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSFX } from '@/lib/hooks/useSFX';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || 'trainee';
  const displayName = searchParams.get('name') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { playSFX } = useSFX();
  const router = useRouter();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: fullCode, role, displayName }),
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
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) throw new Error('Failed to dispatch signal');
      
      setTimer(60);
      playSFX('success', 0.1);
    } catch (err) {
      setError('Signal dispatch failed');
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-base flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background matching AuthPage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,197,24,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="verify-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md relative z-10"
          >
            {/* Logo Header */}
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,197,24,0.3)]">
                  <Zap className="w-5 h-5 text-black" fill="black" />
                </div>
                <span className="font-display font-bold text-xl">
                  Evolution<span className="text-gradient-gold">Prime</span>
                </span>
              </Link>
            </div>

            <GlassCard className="p-8 md:p-12 border-gold/20 shadow-[0_32px_100px_rgba(0,0,0,0.8)] relative">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gold/20 shadow-inner"
                >
                  <ShieldCheck className="w-8 h-8 text-gold" />
                </motion.div>

                <h1 className="font-display font-black text-3xl tracking-tighter uppercase mb-3">
                  Identity <span className="text-gold">Verification</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted] mb-8 leading-relaxed max-w-[280px] mx-auto">
                  Neural access key dispatched to:<br/>
                  <span className="text-white break-all">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="flex justify-between gap-2.5">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoCapitalize="off"
                        autoComplete="one-time-code"
                        value={digit}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-11 h-14 md:w-14 md:h-18 glass-input text-center text-2xl font-black text-gold focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all rounded-xl outline-none"
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 py-2 bg-crimson/5 border border-crimson/20 rounded-lg"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-crimson">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading || code.some(d => !d)}
                    className="w-full h-14 uppercase tracking-[0.3em] font-black shadow-xl shadow-gold/5 hover:shadow-gold/10 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <span className="flex items-center gap-3">
                        Establish Connection
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-10 pt-10 border-t border-white/5">
                  <button
                    onClick={handleResend}
                    disabled={timer > 0 || resending}
                    className="group flex flex-col items-center gap-4 mx-auto disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted] group-hover:text-gold transition-colors">
                      <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin text-gold' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                      {timer > 0 ? `Resend Signal (${timer}s)` : 'Request New Signal'}
                    </div>
                  </button>
                </div>
              </div>
            </GlassCard>
            
            <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[--text-muted] opacity-40">
              Encrypted Channel: Base-64-OTP-V1
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_80px_rgba(245,197,24,0.6)]">
              <ShieldCheck className="w-12 h-12 text-black" strokeWidth={3} />
            </div>
            <h2 className="font-display font-black text-5xl tracking-tighter uppercase mb-4 text-white">
              Identity <span className="text-gold">Secured</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60 animate-pulse">
              Bridging Synapse Node...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-surface-base flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-10 h-10 text-gold animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/40">Loading Secure Terminal...</p>
         </div>
       </div>
     }>
      <VerifyContent />
    </Suspense>
  );
}
