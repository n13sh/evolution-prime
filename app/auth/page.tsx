'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, User, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', displayName: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pushToast = useUIStore(s => s.pushToast);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!form.email || !form.password) {
      setErrors({ email: !form.email ? 'Email required' : '', password: !form.password ? 'Password required' : '' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requiresVerification) {
          pushToast({ type: 'warning', title: 'Verify your email first' });
          handleSendOTP();
          return;
        }
        pushToast({ type: 'error', title: data.error || 'Login failed' });
        return;
      }
      pushToast({ type: 'success', title: 'Welcome back!' });
      router.push(data.user.role === 'coach' ? '/coach' : '/trainee');
    } catch {
      pushToast({ type: 'error', title: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    if (!form.email) {
      setErrors({ email: 'Email required' });
      return;
    }
    if (mode === 'register') {
      if (!form.displayName) {
        setErrors({ displayName: 'Name required' });
        return;
      }
      if (!form.password || form.password.length < 6) {
        setErrors({ password: 'Password must be at least 6 characters' });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        sessionStorage.setItem('evo_reg_data', JSON.stringify({
          password: form.password,
        }));
      }

      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        pushToast({ type: 'error', title: data.error || 'Failed to send OTP' });
        return;
      }

      if (data.devMode) {
        pushToast({ type: 'info', title: 'Dev Mode: Check terminal for access code' });
      } else {
        pushToast({ type: 'success', title: '📨 Access code sent to your email!' });
      }

      const params = new URLSearchParams({
        email: form.email,
        role: mode === 'register' ? role : '',
        name: mode === 'register' ? form.displayName : '',
      });
      router.push(`/auth/verify?${params.toString()}`);
    } catch {
      pushToast({ type: 'error', title: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,197,24,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md my-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,197,24,0.3)]">
              <Zap className="w-5 h-5 text-black" fill="black" />
            </div>
            <span className="font-display font-bold text-xl">Evolution<span className="text-gradient-gold">Prime</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-[--text-primary] mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Start Your Evolution'}
          </h1>
          <p className="text-sm text-[--text-muted]">
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Create an account to begin'}
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-white/5">
          <div className="flex glass rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === m ? 'bg-gold text-black' : 'text-[--text-muted] hover:text-[--text-primary]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-5"
              >
                <p className="text-xs text-[--text-muted] mb-2 font-medium">I am a...</p>
                <div className="flex gap-3">
                  {([
                    { value: 'trainee', label: 'Athlete', emoji: '🏋️' },
                    { value: 'coach', label: 'Coach', emoji: '🎯' },
                  ] as const).map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex-1 glass py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                        role === r.value
                          ? 'border-gold/40 text-gold bg-gold/8'
                          : 'border-white/5 text-[--text-muted] hover:text-[--text-primary]'
                      }`}
                    >
                      <span className="mr-2">{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={mode === 'login' ? handlePasswordLogin : handleSendOTP} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="Your name"
                icon={<User className="w-4 h-4" />}
                value={form.displayName}
                onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                error={errors.displayName}
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<KeyRound className="w-4 h-4" />}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              error={errors.password}
            />

            {mode === 'login' ? (
              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" variant="primary" loading={loading} className="w-full h-12 uppercase tracking-[0.1em] font-bold">
                  Login with Password
                </Button>
                <Button type="button" onClick={handleSendOTP} variant="outline" disabled={loading} className="w-full h-12 uppercase tracking-[0.1em] font-bold border-gold/20 text-gold hover:bg-gold/10">
                  Send OTP Instead
                </Button>
              </div>
            ) : (
              <Button type="submit" variant="primary" loading={loading} className="w-full h-12 mt-2 font-black uppercase tracking-[0.15em] shadow-xl shadow-gold/10">
                Register & Verify Email
              </Button>
            )}
          </form>
          
          {mode === 'register' && (
            <p className="text-center mt-5 text-[10px] text-[--text-muted] font-medium leading-relaxed">
              For your security, we require email verification via OTP before your account is fully created.
            </p>
          )}
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
