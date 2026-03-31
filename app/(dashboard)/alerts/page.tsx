'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { alerts } from '@/lib/data';
import {
  Bell,
  AlertTriangle,
  Package,
  TrendingUp,
  Brain,
  Check,
  CheckCheck,
  Filter,
  Trash2,
  Clock,
} from 'lucide-react';

export default function AlertsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [alertList, setAlertList] = useState(alerts);

  const filteredAlerts = alertList.filter((alert) => {
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesType && matchesSeverity;
  });

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
        return {
          bg: 'bg-destructive/20',
          text: 'text-destructive',
          border: 'border-destructive/30',
        };
      case 'high':
        return {
          bg: 'bg-destructive/20',
          text: 'text-destructive',
          border: 'border-destructive/30',
        };
      case 'medium':
        return {
          bg: 'bg-warning/20',
          text: 'text-warning',
          border: 'border-warning/30',
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          border: 'border-border',
        };
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'low-stock':
        return 'bg-destructive/20 text-destructive';
      case 'overstock':
        return 'bg-warning/20 text-warning';
      case 'demand-spike':
        return 'bg-chart-5/20 text-chart-5';
      case 'ai-insight':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const markAsRead = (id: string) => {
    setAlertList(
      alertList.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlertList(alertList.map((alert) => ({ ...alert, read: true })));
  };

  const unreadCount = alertList.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen">
      <AppHeader title="Alerts & Notifications" />

      <div className="p-6">
        {/* Header Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                {unreadCount} Unread Alerts
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="low-stock">Low Stock</option>
              <option value="overstock">Overstock</option>
              <option value="demand-spike">Demand Spike</option>
              <option value="ai-insight">AI Insight</option>
              <option value="expiry">Expiry</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="h-10 rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={markAllAsRead}
              className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const severityStyle = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`rounded-xl border ${
                  alert.read ? 'border-border bg-card' : `${severityStyle.border} bg-card`
                } p-6 transition-colors`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${severityStyle.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${severityStyle.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3
                            className={`font-semibold ${
                              alert.read ? 'text-muted-foreground' : 'text-card-foreground'
                            }`}
                          >
                            {alert.title}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getTypeStyle(
                              alert.type
                            )}`}
                          >
                            {alert.type.replace('-', ' ')}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${severityStyle.bg} ${severityStyle.text}`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
                        {alert.productName && (
                          <p className="mt-2 text-sm">
                            <span className="text-muted-foreground">Product: </span>
                            <span className="font-medium text-foreground">{alert.productName}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!alert.read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                      {alert.actionRequired && (
                        <span className="rounded-full bg-warning/20 px-2 py-0.5 text-warning">
                          Action Required
                        </span>
                      )}
                      {!alert.read && (
                        <span className="flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">No alerts found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {"There are no alerts matching your filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
