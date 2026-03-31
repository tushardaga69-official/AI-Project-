import { AppHeader } from '@/components/app-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { InventoryStatus } from '@/components/dashboard/inventory-status';
import { AIInsightsWidget } from '@/components/dashboard/ai-insights-widget';
import { AlertsWidget } from '@/components/dashboard/alerts-widget';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { getDashboardStats, getInventoryMetrics } from '@/lib/data';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const metrics = getInventoryMetrics();

  return (
    <div className="min-h-screen">
      <AppHeader title="Dashboard" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Revenue"
            value={`$${stats.todayRevenue.toLocaleString()}`}
            change={`${Number(stats.revenueChange) > 0 ? '+' : ''}${stats.revenueChange}% from yesterday`}
            changeType={Number(stats.revenueChange) > 0 ? 'positive' : 'negative'}
            icon={DollarSign}
            iconColor="bg-success/20 text-success"
          />
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders}
            change={`${stats.pendingOrders} pending`}
            changeType="neutral"
            icon={ShoppingCart}
            iconColor="bg-primary/20 text-primary"
          />
          <StatCard
            title="Total Products"
            value={metrics.totalProducts}
            change={`$${metrics.totalValue.toLocaleString()} inventory value`}
            changeType="neutral"
            icon={Package}
            iconColor="bg-chart-5/20 text-chart-5"
          />
          <StatCard
            title="Alerts"
            value={stats.unreadAlerts}
            change={`${metrics.lowStockItems + metrics.outOfStockItems} stock alerts`}
            changeType={stats.unreadAlerts > 0 ? 'negative' : 'neutral'}
            icon={AlertTriangle}
            iconColor="bg-warning/20 text-warning"
          />
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <InventoryStatus />
        </div>

        {/* AI Insights */}
        <div className="mb-6">
          <AIInsightsWidget />
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AlertsWidget />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
