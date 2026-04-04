import { GlassCard } from '@/components/ui/GlassCard';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage change
  sublabel?: string;
}

export function MetricCard({ icon: Icon, iconColor, label, value, unit, trend, sublabel }: MetricCardProps) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? 'text-[--text-muted]' : trend > 0 ? 'text-green-400' : 'text-crimson-light';

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}25` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display font-bold text-2xl text-[--text-primary]">{value}</span>
        {unit && <span className="text-sm text-[--text-muted]">{unit}</span>}
      </div>
      <p className="text-sm text-[--text-muted] mt-1">{label}</p>
      {sublabel && <p className="text-xs text-[--text-muted]/70 mt-0.5">{sublabel}</p>}
    </GlassCard>
  );
}
