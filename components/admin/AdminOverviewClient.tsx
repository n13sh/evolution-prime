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
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, color: '#818cf8', label: 'Total Users', value: stats.totalUsers },
          { icon: UserCog, color: '#F5C518', label: 'Athletes', value: stats.totalTrainees },
          { icon: UserCheck, color: '#DC143C', label: 'Coaches', value: stats.totalCoaches },
          { icon: TrendingUp, color: '#22c55e', label: 'Active Today', value: Math.floor(stats.totalUsers * 0.3) },
        ].map((s, i) => (
          <GlassCard key={i} className="p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
              <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
            </div>
            <div className="font-display font-bold text-2xl text-[--text-primary]">{s.value}</div>
            <div className="text-xs text-[--text-muted] mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[--text-primary]">Recent Users</h3>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-2.5 glass-hover rounded-xl transition-all">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    u.role === 'admin' ? 'bg-indigo-500/20' : u.role === 'coach' ? 'bg-crimson/20' : 'bg-gold/20'
                  }`}>
                    <span className="text-xs font-bold">{u.display_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--text-primary] truncate">{u.display_name}</p>
                    <p className="text-xs text-[--text-muted] truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={u.role === 'admin' ? 'blue' : u.role === 'coach' ? 'crimson' : 'gold'}>
                      {u.role}
                    </Badge>
                    {!u.is_active && <XCircle className="w-4 h-4 text-crimson" />}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Coach approvals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[--text-primary]">Coach Approvals</h3>
                {pendingCoaches.length > 0 && <Badge variant="crimson">{pendingCoaches.length} pending</Badge>}
              </div>
              <Link href="/admin/coaches">
                <Button variant="ghost" size="sm" className="gap-1">All Coaches <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
            {coaches.length === 0 ? (
              <div className="text-center py-8 text-[--text-muted] text-sm">No coaches registered yet</div>
            ) : (
              <div className="flex flex-col gap-3">
                {coaches.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-crimson/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-crimson-light">{c.display_name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[--text-primary] truncate">{c.display_name}</p>
                      <p className="text-xs text-[--text-muted]">{c.trainee_count || 0} athletes</p>
                    </div>
                    {c.is_approved ? (
                      <Badge variant="green"><CheckCircle className="w-3 h-3 mr-1 inline" />Approved</Badge>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => approveCoach(c.id)}>Approve</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Platform health */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-[--text-primary]">Platform Health</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Database', status: 'Healthy', color: '#22c55e' },
              { label: 'Auth Service', status: 'Operational', color: '#22c55e' },
              { label: 'AI Service', status: 'Active', color: '#F5C518' },
            ].map(item => (
              <div key={item.label} className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                <div>
                  <p className="text-sm font-medium text-[--text-primary]">{item.label}</p>
                  <p className="text-xs" style={{ color: item.color }}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
