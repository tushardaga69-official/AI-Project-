'use client';

import Link from 'next/link';
import { orders } from '@/lib/data';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export function RecentOrders() {
  const recentOrders = orders.slice(0, 5);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/20 text-success';
      case 'shipped':
        return 'bg-chart-5/20 text-chart-5';
      case 'confirmed':
        return 'bg-primary/20 text-primary';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-success';
      case 'purchase':
        return 'text-chart-5';
      case 'return':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest transactions</p>
          </div>
        </div>
        <Link
          href="/orders"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Order ID
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Type
              </th>
              <th className="pb-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Customer/Supplier
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">
                Amount
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="py-3 text-sm font-medium text-foreground">{order.id}</td>
                <td className={`py-3 text-sm font-medium capitalize ${getTypeStyle(order.type)}`}>
                  {order.type}
                </td>
                <td className="py-3 text-sm text-muted-foreground">
                  {order.customer || order.supplier || '-'}
                </td>
                <td className="py-3 text-right text-sm font-medium text-foreground">
                  ${order.total.toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
