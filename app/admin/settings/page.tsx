import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Shield, Database, Zap, Globe } from 'lucide-react';

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth');

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Platform Settings" subtitle="Global system configuration" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="grid gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Globe className="w-5 h-5 text-gold" />
              <h3 className="font-semibold text-[--text-primary]">Platform Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Platform Name', value: 'Evolution Prime' },
                { label: 'Version', value: '1.0.0' },
                { label: 'Environment', value: process.env.NODE_ENV || 'development' },
                { label: 'Database', value: 'SQLite (WAL)' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-[--glass-border] last:border-0">
                  <span className="text-[--text-muted]">{item.label}</span>
                  <span className="text-[--text-primary] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-[--text-primary]">Security Settings</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: 'JWT Authentication', status: true },
                { label: 'HttpOnly Cookies', status: true },
                { label: 'Role-Based Access Control', status: true },
                { label: 'Password Hashing (bcrypt)', status: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-[--text-muted]">{item.label}</span>
                  <Badge variant={item.status ? 'green' : 'crimson'}>{item.status ? 'Enabled' : 'Disabled'}</Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
