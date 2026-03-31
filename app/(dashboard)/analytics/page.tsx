'use client';

import { AppHeader } from '@/components/app-header';
import { salesData, products, orders, getInventoryMetrics } from '@/lib/data';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = getInventoryMetrics();

  // Prepare chart data
  const revenueData = salesData.slice(-14).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: d.revenue,
    profit: d.profit,
    orders: d.orders,
  }));

  const categoryData = [
    { name: 'Electronics', value: 4, color: 'oklch(0.65 0.2 265)' },
    { name: 'Furniture', value: 2, color: 'oklch(0.7 0.18 145)' },
    { name: 'Lighting', value: 1, color: 'oklch(0.75 0.15 85)' },
    { name: 'Accessories', value: 1, color: 'oklch(0.7 0.15 200)' },
  ];

  const stockStatusData = [
    { name: 'In Stock', value: products.filter((p) => p.status === 'in-stock').length },
    { name: 'Low Stock', value: products.filter((p) => p.status === 'low-stock').length },
    { name: 'Out of Stock', value: products.filter((p) => p.status === 'out-of-stock').length },
    { name: 'Overstock', value: products.filter((p) => p.status === 'overstock').length },
  ];

  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = salesData.reduce((sum, d) => sum + d.profit, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const currentWeekRevenue = salesData.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
  const previousWeekRevenue = salesData.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0);
  const revenueGrowth = ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue * 100).toFixed(1);

  return (
    <div className="min-h-screen">
      <AppHeader title="Analytics" />

      <div className="p-6">
        {/* Summary Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold text-card-foreground">
                  ${(totalRevenue / 1000).toFixed(1)}k
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">+{revenueGrowth}%</span>
                  <span className="text-sm text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="mt-2 text-3xl font-bold text-card-foreground">
                  ${(totalProfit / 1000).toFixed(1)}k
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {((totalProfit / totalRevenue) * 100).toFixed(1)}% margin
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="mt-2 text-3xl font-bold text-card-foreground">{totalOrders}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    ${avgOrderValue.toFixed(2)} avg value
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/20">
                <ShoppingCart className="h-6 w-6 text-chart-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="mt-2 text-3xl font-bold text-card-foreground">
                  ${(metrics.totalValue / 1000).toFixed(1)}k
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {metrics.totalProducts} products
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
                <Package className="h-6 w-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Revenue & Profit</h3>
              <p className="text-sm text-muted-foreground">Last 14 days performance</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.2 265)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.2 265)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.01 260)',
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                      color: 'oklch(0.98 0 0)',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.65 0.2 265)" strokeWidth={2} fill="url(#revenueGrad)" />
                  <Area type="monotone" dataKey="profit" stroke="oklch(0.7 0.18 145)" strokeWidth={2} fill="url(#profitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Daily Orders</h3>
              <p className="text-sm text-muted-foreground">Order volume trend</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.65 0 0)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.01 260)',
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                      color: 'oklch(0.98 0 0)',
                    }}
                  />
                  <Bar dataKey="orders" fill="oklch(0.65 0.2 265)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Category Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Products by Category</h3>
              <p className="text-sm text-muted-foreground">Distribution overview</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.01 260)',
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                      color: 'oklch(0.98 0 0)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Stock Status</h3>
              <p className="text-sm text-muted-foreground">Inventory health</p>
            </div>
            <div className="space-y-4">
              {stockStatusData.map((status, index) => {
                const colors = ['oklch(0.7 0.18 145)', 'oklch(0.75 0.15 85)', 'oklch(0.6 0.2 25)', 'oklch(0.7 0.15 200)'];
                const percentage = (status.value / products.length) * 100;
                return (
                  <div key={status.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{status.name}</span>
                      <span className="text-sm text-muted-foreground">{status.value} items</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: colors[index] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Top Products</h3>
              <p className="text-sm text-muted-foreground">By inventory value</p>
            </div>
            <div className="space-y-4">
              {products
                .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{product.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(product.price * product.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
