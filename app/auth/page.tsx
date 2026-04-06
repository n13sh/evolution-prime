'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [role, setRole] = useState<'trainee' | 'coach'>(
    searchParams.get('role') === 'coach' ? 'coach' : 'trainee'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setUser = useAuthStore(s => s.setUser);
  const pushToast = useUIStore(s => s.pushToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        pushToast({ type: 'error', title: data.error || 'Identity Challenge Failed' });
        return;
      }

      pushToast({ type: 'success', title: 'Neural Signal Sent (Check Email)' });
      
      // Store draft profile in session/query for verification step
      const params = new URLSearchParams({
        email: form.email,
        role,
        name: form.displayName || '',
      });
      router.push(`/auth/verify?${params.toString()}`);
    } catch {
      pushToast({ type: 'error', title: 'Network sequence interrupted.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,197,24,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" fill="black" />
            </div>
            <span className="font-display font-bold text-xl">
              Evolution<span className="text-gradient-gold">Prime</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-[--text-primary] mb-1">
            {mode === 'login' ? 'Identity Authentication' : 'Begin Evolution'}
          </h1>
          <p className="text-sm text-[--text-muted]">
            {mode === 'login' ? 'Secure entrance via neural signal' : 'Create your unique signature in the elite'}
          </p>
        </div>

        {/* Card */}
        <div
          className="glass rounded-3xl p-8 shadow-2xl border-white/5"
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'register' && (
              <Input
                label="Signature (Name)"
                placeholder="Ex: John Proto"
                icon={<User className="w-4 h-4" />}
                value={form.displayName}
                onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                error={errors.displayName}
                required
              />
            )}
            <Input
              label="Neural ID (Email)"
              type="email"
              placeholder="id@evolution.prime"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              required
            />

            {/* Mode toggle embedded below for cleaner look */}
            <div className="flex items-center justify-between px-1">
              <button 
                type="button" 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[10px] font-black uppercase tracking-widest text-[--text-muted] hover:text-gold transition-colors"
              >
                {mode === 'login' ? 'No Signature? Register' : 'Already Linked? Login'}
              </button>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full h-14 uppercase tracking-[0.2em] font-black shadow-gold/5">
              {loading ? 'Dispatching Signal...' : 'Send Access Key'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
