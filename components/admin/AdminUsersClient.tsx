'use client';
import { useState } from 'react';
import { Search, UserX, UserCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/format';
import { useUIStore } from '@/store/ui-store';

export function AdminUsersClient({ users: initialUsers, total }: { users: any[]; total: number }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const pushToast = useUIStore(s => s.pushToast);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.email.includes(search) || u.display_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = async (userId: number, isActive: number) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: isActive ? 0 : 1 } : u));
      pushToast({ type: 'success', title: isActive ? 'User suspended' : 'User activated' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search users..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
        <div className="flex gap-2">
          {['all', 'trainee', 'coach', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-gold text-black' : 'glass text-[--text-muted] hover:text-[--text-primary]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[--glass-border]">
              <tr className="text-[--text-muted] text-xs">
                <th className="text-left px-6 py-4 font-medium">User</th>
                <th className="text-left px-6 py-4 font-medium">Role</th>
                <th className="text-left px-6 py-4 font-medium">Joined</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--glass-border]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        u.role === 'admin' ? 'bg-indigo-500/25 text-indigo-400' : u.role === 'coach' ? 'bg-crimson/25 text-crimson-light' : 'bg-gold/25 text-gold'
                      }`}>{u.display_name[0]}</div>
                      <div>
                        <p className="font-medium text-[--text-primary]">{u.display_name}</p>
                        <p className="text-xs text-[--text-muted]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'admin' ? 'blue' : u.role === 'coach' ? 'crimson' : 'gold'}>{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-[--text-muted]">{formatDate(u.created_at)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.is_active ? 'green' : 'crimson'}>{u.is_active ? 'Active' : 'Suspended'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(u.id, u.is_active)} className="gap-1.5">
                      {u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      {u.is_active ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
