'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/ui-store';

export function AdminCoachesClient({ coaches: initial }: { coaches: any[] }) {
  const [coaches, setCoaches] = useState(initial);
  const pushToast = useUIStore(s => s.pushToast);

  const approve = async (id: number) => {
    const res = await fetch(`/api/coaches/${id}/approve`, { method: 'POST' });
    if (res.ok) {
      setCoaches(prev => prev.map(c => c.id === id ? { ...c, is_approved: 1 } : c));
      pushToast({ type: 'success', title: 'Coach approved!' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4">
        {coaches.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center">
                    <span className="font-bold text-crimson-light">{c.display_name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[--text-primary]">{c.display_name}</p>
                    <p className="text-xs text-[--text-muted]">{c.email}</p>
                  </div>
                </div>
                <Badge variant={c.is_approved ? 'green' : 'crimson'}>
                  {c.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-[--text-muted] mb-4">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.trainee_count || 0} athletes</span>
              </div>
              {!c.is_approved && (
                <Button variant="primary" size="sm" onClick={() => approve(c.id)} className="w-full gap-2">
                  <CheckCircle className="w-4 h-4" /> Approve Coach
                </Button>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
