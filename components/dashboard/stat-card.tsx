import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-primary/20 text-primary',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  changeType === 'positive'
                    ? 'text-success'
                    : changeType === 'negative'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
