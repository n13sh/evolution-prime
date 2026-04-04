'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trophy, TrendingUp, Dumbbell, BarChart3, Plus, X } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/ui-store';

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#F5C518', back: '#DC143C', legs: '#6366f1',
  shoulders: '#22c55e', arms: '#f97316', core: '#a855f7', glutes: '#ec4899',
};

interface Props {
  metrics: any[];
  prs: any[];
  muscleVolume: any[];
  weeklyVolume: any[];
  sessions: any[];
  traineeId: number;
}

export function VaultClient({ metrics, prs, muscleVolume, weeklyVolume, sessions, traineeId }: Props) {
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [metricForm, setMetricForm] = useState({ weight_kg: '', body_fat_pct: '', waist_cm: '', bicep_cm: '' });
  const [saving, setSaving] = useState(false);
  const pushToast = useUIStore(s => s.pushToast);

  const weightData = metrics.map(m => ({
    date: formatDate(m.measured_at).split(',')[0],
    weight: m.weight_kg,
    bodyFat: m.body_fat_pct,
  })).filter(m => m.weight);

  const volumeData = weeklyVolume.map(w => ({
    week: `W${(w.week as string).split('-')[1]}`,
    volume: Math.round((w.volume as number) / 1000) || 0,
    sessions: w.sessions,
  }));

  const pieData = muscleVolume.map(m => ({
    name: m.muscle_group,
    value: Math.round(m.volume as number) || 0,
  })).filter(m => m.value > 0);

  const handleLogMetric = async () => {
    setSaving(true);
    try {
      const body: Record<string, number> = {};
      if (metricForm.weight_kg) body.weight_kg = parseFloat(metricForm.weight_kg);
      if (metricForm.body_fat_pct) body.body_fat_pct = parseFloat(metricForm.body_fat_pct);
      if (metricForm.waist_cm) body.waist_cm = parseFloat(metricForm.waist_cm);
      if (metricForm.bicep_cm) body.bicep_cm = parseFloat(metricForm.bicep_cm);

      const res = await fetch('/api/body-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        pushToast({ type: 'success', title: 'Metrics logged!' });
        setShowMetricForm(false);
        setMetricForm({ weight_kg: '', body_fat_pct: '', waist_cm: '', bicep_cm: '' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top row stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Dumbbell, color: '#F5C518', label: 'Total Sessions', value: sessions.length },
          { icon: Trophy, color: '#DC143C', label: 'Personal Records', value: prs.length },
          { icon: TrendingUp, color: '#6366f1', label: 'Current Weight', value: metrics[metrics.length - 1]?.weight_kg ? `${metrics[metrics.length - 1].weight_kg}kg` : '--' },
          { icon: BarChart3, color: '#22c55e', label: 'Weeks Tracked', value: weeklyVolume.length },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}18` }}>
              <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
            </div>
            <div className="font-display font-bold text-2xl text-[--text-primary]">{stat.value}</div>
            <div className="text-xs text-[--text-muted] mt-1">{stat.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Weight chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[--text-primary]">Body Weight History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMetricForm(!showMetricForm)}
              className="gap-2"
            >
              {showMetricForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showMetricForm ? 'Cancel' : 'Log Metrics'}
            </Button>
          </div>

          {showMetricForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 glass rounded-xl"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="Weight (kg)" type="number" placeholder="75.5" value={metricForm.weight_kg} onChange={e => setMetricForm(p => ({ ...p, weight_kg: e.target.value }))} />
                <Input label="Body Fat (%)" type="number" placeholder="18" value={metricForm.body_fat_pct} onChange={e => setMetricForm(p => ({ ...p, body_fat_pct: e.target.value }))} />
                <Input label="Waist (cm)" type="number" placeholder="82" value={metricForm.waist_cm} onChange={e => setMetricForm(p => ({ ...p, waist_cm: e.target.value }))} />
                <Input label="Bicep (cm)" type="number" placeholder="36" value={metricForm.bicep_cm} onChange={e => setMetricForm(p => ({ ...p, bicep_cm: e.target.value }))} />
              </div>
              <Button variant="primary" size="sm" onClick={handleLogMetric} loading={saving}>Save Measurement</Button>
            </motion.div>
          )}

          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="weight" stroke="#F5C518" strokeWidth={2.5} dot={{ fill: '#F5C518', r: 4 }} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[--text-muted] text-sm">
              No measurements yet. Log your first body metrics!
            </div>
          )}
        </GlassCard>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Volume */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6 h-full">
            <h3 className="font-semibold text-[--text-primary] mb-5">Weekly Training Volume</h3>
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={volumeData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Bar dataKey="volume" fill="#DC143C" radius={[6, 6, 0, 0]} name="Volume (ton)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-[--text-muted] text-sm">
                Complete workouts to see volume trends
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Muscle split */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 h-full">
            <h3 className="font-semibold text-[--text-primary] mb-5">Muscle Split (30d)</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={MUSCLE_COLORS[entry.name] || '#888'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }} />
                  <Legend formatter={(v) => <span style={{ color: '#8888A0', fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-[--text-muted] text-sm">
                Complete workouts to see muscle split
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* PRs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-[--text-primary]">Personal Records</h3>
            <Badge variant="gold">{prs.length} PRs</Badge>
          </div>
          {prs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[--text-muted] text-xs border-b border-[--glass-border]">
                    <th className="text-left pb-3 font-medium">Exercise</th>
                    <th className="text-left pb-3 font-medium">Muscle</th>
                    <th className="text-right pb-3 font-medium">Weight</th>
                    <th className="text-right pb-3 font-medium">Reps</th>
                    <th className="text-right pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--glass-border]">
                  {prs.map((pr, i) => (
                    <tr key={i} className="text-[--text-primary]">
                      <td className="py-3 font-medium">{pr.exercise_name}</td>
                      <td className="py-3">
                        <Badge variant="default" className="capitalize">{pr.muscle_group}</Badge>
                      </td>
                      <td className="py-3 text-right text-gold font-bold">{pr.max_weight}kg</td>
                      <td className="py-3 text-right">{pr.reps}</td>
                      <td className="py-3 text-right text-[--text-muted]">{formatDate(pr.logged_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-[--text-muted] text-sm">
              No PRs yet. Start training to set your first records!
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
