'use client';

import Link from 'next/link';
import { alerts } from '@/lib/data';
import { Bell, AlertTriangle, Package, TrendingUp, Brain, ArrowRight } from 'lucide-react';

export function AlertsWidget() {
  const recentAlerts = alerts.slice(0, 4);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low-stock':
        return AlertTriangle;
      case 'overstock':
        return Package;
      case 'demand-spike':
        return TrendingUp;
      case 'ai-insight':
        return Brain;
      default:
        return Bell;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'high':
        return 'bg-destructive/20 text-destructive';
      case 'medium':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Bell className="h-5 w-5 text-primary" />
            {alerts.filter((a) => !a.read).length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                {alerts.filter((a) => !a.read).length}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Recent Alerts</h3>
            <p className="text-sm text-muted-foreground">Notifications & warnings</p>
          </div>
        </div>
        <Link
          href="/alerts"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {recentAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                alert.read ? 'border-border bg-secondary/30' : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getSeverityStyle(alert.severity)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground truncate">{alert.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
