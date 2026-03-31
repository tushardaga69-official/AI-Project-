'use client';

import { Bell, Search, User } from 'lucide-react';
import { alerts } from '@/lib/data';

export function AppHeader({ title }: { title: string }) {
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-foreground hover:bg-muted transition-colors">
          <Bell className="h-4 w-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* User Menu */}
        <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
