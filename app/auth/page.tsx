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
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, displayName: form.displayName, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else pushToast({ type: 'error', title: data.error || 'Authentication failed' });
        return;
      }

      setUser(data.user);
      pushToast({ type: 'success', title: `Welcome${mode === 'register' ? ' to Evolution Prime' : ' back'}, ${data.user.displayName}!` });

      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        const dashboards = { admin: '/admin', coach: '/coach', trainee: '/trainee' };
        router.push(dashboards[data.user.role as keyof typeof dashboards] || '/');
      }
    } catch {
      pushToast({ type: 'error', title: 'Network error. Please try again.' });
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
            {mode === 'login' ? 'Welcome Back' : 'Start Your Evolution'}
          </h1>
          <p className="text-sm text-[--text-muted]">
            {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account and join the elite'}
          </p>
        </div>

        {/* Card */}
        <div
          className="glass rounded-3xl p-8"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }}
        >
          {/* Mode toggle */}
          <div className="flex glass rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === m
                    ? 'bg-gold text-black'
                    : 'text-[--text-muted] hover:text-[--text-primary]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Role selector (register only) */}
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
                      onClick={() => setRole(r.value)}
                      className={`flex-1 glass py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        role === r.value
                          ? 'border-gold/40 text-gold bg-gold/8'
                          : 'text-[--text-muted] hover:text-[--text-primary]'
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="Your name"
                icon={<User className="w-4 h-4" />}
                value={form.displayName}
                onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                error={errors.displayName}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[--text-muted]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'}
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  minLength={mode === 'register' ? 8 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-primary]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-crimson-light">{errors.password}</p>}
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              {mode === 'login' ? 'Enter the Arena' : `Join as ${role === 'coach' ? 'Coach' : 'Athlete'}`}
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
