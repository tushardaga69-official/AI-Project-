'use client';

import { products } from '@/lib/data';
import { Package, AlertTriangle, XCircle, ArrowUpCircle } from 'lucide-react';

export function InventoryStatus() {
  const statusCounts = {
    inStock: products.filter((p) => p.status === 'in-stock').length,
    lowStock: products.filter((p) => p.status === 'low-stock').length,
    outOfStock: products.filter((p) => p.status === 'out-of-stock').length,
    overstock: products.filter((p) => p.status === 'overstock').length,
  };

  const total = products.length;

  const statuses = [
    {
      label: 'In Stock',
      count: statusCounts.inStock,
      percentage: ((statusCounts.inStock / total) * 100).toFixed(0),
      icon: Package,
      color: 'bg-success/20 text-success',
      barColor: 'bg-success',
    },
    {
      label: 'Low Stock',
      count: statusCounts.lowStock,
      percentage: ((statusCounts.lowStock / total) * 100).toFixed(0),
      icon: AlertTriangle,
      color: 'bg-warning/20 text-warning',
      barColor: 'bg-warning',
    },
    {
      label: 'Out of Stock',
      count: statusCounts.outOfStock,
      percentage: ((statusCounts.outOfStock / total) * 100).toFixed(0),
      icon: XCircle,
      color: 'bg-destructive/20 text-destructive',
      barColor: 'bg-destructive',
    },
    {
      label: 'Overstock',
      count: statusCounts.overstock,
      percentage: ((statusCounts.overstock / total) * 100).toFixed(0),
      icon: ArrowUpCircle,
      color: 'bg-chart-5/20 text-chart-5',
      barColor: 'bg-chart-5',
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Inventory Status</h3>
        <p className="text-sm text-muted-foreground">Current stock distribution</p>
      </div>

      <div className="space-y-4">
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.label} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{status.label}</span>
                  <span className="text-sm text-muted-foreground">{status.count} items</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${status.barColor}`}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
