'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, UserCheck, UserCog, TrendingUp, ArrowRight, Shield, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelative } from '@/lib/utils/format';
import { useUIStore } from '@/store/ui-store';

interface Props {
  stats: { totalUsers: number; totalTrainees: number; totalCoaches: number };
  recentUsers: any[];
  coaches: any[];
}

export function AdminOverviewClient({ stats, recentUsers, coaches }: Props) {
  const pushToast = useUIStore(s => s.pushToast);

  const approveCoach = async (id: number) => {
    const res = await fetch(`/api/coaches/${id}/approve`, { method: 'POST' });
    if (res.ok) pushToast({ type: 'success', title: 'Coach approved!' });
  };

  const pendingCoaches = coaches.filter((c: any) => !c.is_approved);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 p-4 md:p-8">
      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Users, color: '#818cf8', label: 'TOTAL USERS', value: stats.totalUsers },
          { icon: UserCog, color: '#F5C518', label: 'ELITE ATHLETES', value: stats.totalTrainees },
          { icon: UserCheck, color: '#DC143C', label: 'ACTIVE COACHES', value: stats.totalCoaches },
          { icon: TrendingUp, color: '#22c55e', label: 'SYSTEM TRAFFIC', value: Math.floor(stats.totalUsers * 0.3) },
        ].map((s, i) => (
          <GlassCard key={i} className="p-6 transition-all duration-500 hover:scale-105 group border-white/5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/40 group-hover:rotate-6 transition-transform" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div className="font-display font-black text-4xl text-[--text-primary] tracking-tight">{s.value}</div>
            <div className="text-[10px] font-black text-[--text-muted]/60 mt-2 uppercase tracking-[0.2em]">{s.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent users */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-8 h-full border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight uppercase italic">User Registry</h3>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-2 text-[10px] uppercase font-black tracking-widest px-4">
                  Full Database <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:bg-white/5 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110 ${
                    u.role === 'admin' ? 'bg-indigo-500/10 border-indigo-500/20' : u.role === 'coach' ? 'bg-crimson/10 border-crimson/20' : 'bg-gold/10 border-gold/20'
                  }`}>
                    <span className="text-lg font-black">{u.display_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-[--text-primary] truncate tracking-tight uppercase">{u.display_name}</p>
                    <p className="text-[10px] font-bold text-[--text-muted]/60 uppercase tracking-wide truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={u.role === 'admin' ? 'blue' : u.role === 'coach' ? 'crimson' : 'gold'} className="px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                      {u.role}
                    </Badge>
                    {!u.is_active && <XCircle className="w-5 h-5 text-crimson animate-pulse" />}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Coach approvals */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-8 h-full border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight uppercase italic">Approvals</h3>
                {pendingCoaches.length > 0 && <Badge variant="crimson" className="px-3 py-1 font-black text-[9px] uppercase tracking-widest animate-bounce">{pendingCoaches.length} PENDING</Badge>}
              </div>
              <Link href="/admin/coaches">
                <Button variant="ghost" size="sm" className="gap-2 text-[10px] uppercase font-black tracking-widest px-4">
                  Manage Coaches <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {coaches.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                 <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto border border-white/5">
                    <Shield className="w-10 h-10 text-[--text-muted]/20" />
                 </div>
                <p className="text-sm font-black text-[--text-muted]/40 uppercase tracking-widest">No coaches registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {coaches.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-crimson/10 flex items-center justify-center shrink-0 border border-crimson/20">
                      <span className="text-lg font-black text-crimson-light">{c.display_name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-black text-[--text-primary] truncate tracking-tight uppercase">{c.display_name}</p>
                      <p className="text-[10px] font-bold text-[--text-muted]/60 uppercase tracking-wide">{c.trainee_count || 0} ATHLETES UNDER COMMAND</p>
                    </div>
                    {c.is_approved ? (
                      <Badge variant="green" className="px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        SECURED
                      </Badge>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => approveCoach(c.id)} className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold/10">GRANT ACCESS</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Platform health */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-8 border-white/5 bg-white/2">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
              <Shield className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight uppercase italic">Core System Integrity</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'DATABASE OPS', status: 'STABLE', color: '#22c55e' },
              { label: 'AUTH PROTOCOL', status: 'SECURED', color: '#22c55e' },
              { label: 'AI CORE ENGINE', status: 'PEAK PERF', color: '#F5C518' },
            ].map(item => (
              <div key={item.label} className="glass group hover:bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: item.color, boxShadow: `0 0 15px ${item.color}` }} />
                  <span className="text-[10px] font-black text-[--text-muted]/40 tracking-widest">{item.status}</span>
                </div>
                <p className="text-sm font-black text-[--text-primary] tracking-widest uppercase group-hover:translate-x-1 transition-transform">{item.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
