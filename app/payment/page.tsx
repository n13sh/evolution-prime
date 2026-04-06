'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSFX } from '@/lib/hooks/useSFX';

const PRICING: Record<string, Record<string, number>> = {
  moderate: { monthly: 999, yearly: 9999 },
  pro: { monthly: 1999, yearly: 19999 },
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { playSFX } = useSFX();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending' | 'active'>('none');

  const plan = searchParams.get('plan') || 'moderate';
  const cycle = searchParams.get('cycle') || 'monthly';
  const price = PRICING[plan]?.[cycle] || PRICING.moderate.monthly;

  const phone = "8848952240";
  const upiId = `${phone}@ybl`;
  const upiLink = `upi://pay?pa=${upiId}&pn=EvolutionPrime&cu=INR&am=${price}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}&bgcolor=FFFFFF&color=000000`;

  const handleManualVerify = async () => {
    setVerifying(true);
    playSFX('click');
    setTimeout(() => {
      setVerifying(false);
      setStatus('pending');
      playSFX('success');
    }, 1500);
  };

  const handlePayDirect = () => {
    playSFX('transition');
    window.location.href = upiLink;
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crimson/3 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative">
        <GlassCard className="p-8 md:p-12 border-gold/10 overflow-hidden">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block p-3 bg-gold/10 rounded-2xl mb-6 border border-gold/20"
            >
              <Zap className="w-8 h-8 text-gold" fill="currentColor" />
            </motion.div>
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter uppercase mb-4">
              Evolution <span className="text-gold">Prime</span> Access
            </h1>
            <p className="text-sm text-[--text-muted] uppercase tracking-[0.2em] font-bold">
              Join the <span className="text-gold">{plan}</span> Elite for <span className="text-white">₹{price.toLocaleString()}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <button
                  onClick={handlePayDirect}
                  className="w-full group glass glass-hover p-5 rounded-2xl flex items-center gap-5 border-white/5 hover:border-gold/30 transition-all text-left"
                >
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-gold/10 transition-colors">
                    <Smartphone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Pay via GPay / UPI</h3>
                    <p className="text-[10px] text-[--text-muted] uppercase tracking-widest mt-1">Direct Secure Link</p>
                  </div>
                </button>

                <div className="glass p-5 rounded-2xl border-white/5 flex items-center gap-5 opacity-60">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <CreditCard className="w-6 h-6 text-[--text-muted]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Credit/Debit Card</h3>
                    <p className="text-[10px] text-[--text-muted] uppercase tracking-widest mt-1">Coming Soon</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-gold/60 mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure Evolution Network</span>
                </div>
                
                {status === 'none' ? (
                  <Button 
                    onClick={handleManualVerify} 
                    loading={verifying}
                    variant="ghost" 
                    className="w-full h-14 border-white/10 hover:border-gold/30 uppercase tracking-[0.2em] text-[10px] font-black"
                  >
                    I have completed payment
                  </Button>
                ) : (
                  <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl flex items-center gap-4">
                    <Loader2 className="w-5 h-5 text-gold animate-spin" />
                    <div>
                      <p className="text-xs font-bold text-gold uppercase tracking-widest">Verification Pending</p>
                      <p className="text-[10px] text-gold/60 uppercase tracking-tighter">Admin will secure your access within 1hr.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold to-crimson rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative glass bg-white rounded-[2rem] p-8 aspect-square flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-4 bg-black/5 text-center">
                  <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">Scan to Evolutionize</p>
                </div>
                <img 
                  src={qrUrl}
                  alt="Payment QR"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/5 text-center">
                  <p className="text-[10px] font-black text-black tracking-widest">{phone}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-4 mt-8 px-4">
          {[
            { icon: QrCode, label: 'Instant Plan' },
            { icon: CheckCircle2, label: 'Coach Access' },
            { icon: ShieldCheck, label: 'Secured Data' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center opacity-40">
              <item.icon className="w-5 h-5 text-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
