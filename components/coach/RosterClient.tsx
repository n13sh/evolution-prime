'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Users, ArrowRight, Dumbbell } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatRelative } from '@/lib/utils/format';

export function RosterClient({ trainees }: { trainees: any[] }) {
  const [search, setSearch] = useState('');

  const filtered = trainees.filter(t =>
    t.display_name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Input
          placeholder="Search athletes..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
          <p className="text-[--text-muted]">{search ? 'No athletes found' : 'No athletes assigned yet'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => {
            const isActive = t.last_workout && (Date.now() / 1000 - t.last_workout) < 7 * 86400;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/coach/roster/${t.id}`}>
                  <GlassCard hover className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-crimson/20 flex items-center justify-center">
                        <span className="text-base font-bold text-crimson-light">{t.display_name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[--text-primary] truncate">{t.display_name}</p>
                        <p className="text-xs text-[--text-muted] truncate">{t.email}</p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="glass rounded-lg px-2 py-1.5">
                        <p className="text-[--text-muted]">Goal</p>
                        <p className="font-medium text-[--text-primary] capitalize">{t.goal?.replace('_', ' ') || 'Not set'}</p>
                      </div>
                      <div className="glass rounded-lg px-2 py-1.5">
                        <p className="text-[--text-muted]">Level</p>
                        <p className="font-medium text-[--text-primary] capitalize">{t.fitness_level || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[--text-muted]">
                        {t.last_workout ? formatRelative(t.last_workout) : 'No sessions'}
                      </p>
                      <Badge variant={isActive ? 'green' : 'crimson'}>
                        {isActive ? 'On Track' : 'Inactive'}
                      </Badge>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
