'use client';

import { AppHeader } from '@/components/app-header';
import { aiForecasts, products } from '@/lib/data';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Package,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  BarChart3,
} from 'lucide-react';

export default function AIInsightsPage() {
  const urgentItems = aiForecasts.filter((f) => f.recommendation === 'urgent');
  const restockItems = aiForecasts.filter((f) => f.recommendation === 'restock');
  const reduceItems = aiForecasts.filter((f) => f.recommendation === 'reduce');
  const maintainItems = aiForecasts.filter((f) => f.recommendation === 'maintain');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'decreasing':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'urgent':
        return {
          bg: 'bg-destructive/20',
          text: 'text-destructive',
          border: 'border-destructive/30',
        };
      case 'restock':
        return {
          bg: 'bg-warning/20',
          text: 'text-warning',
          border: 'border-warning/30',
        };
      case 'reduce':
        return {
          bg: 'bg-chart-5/20',
          text: 'text-chart-5',
          border: 'border-chart-5/30',
        };
      default:
        return {
          bg: 'bg-success/20',
          text: 'text-success',
          border: 'border-success/30',
        };
    }
  };

  const getConfidenceStyle = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="AI Insights" />

      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                AI-Powered Demand Forecasting
              </h2>
              <p className="text-muted-foreground">
                Smart predictions and recommendations based on your sales data, seasonal patterns, and
                market trends
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Actions</p>
                <p className="text-2xl font-bold text-destructive">{urgentItems.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <ShoppingCart className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Restock Needed</p>
                <p className="text-2xl font-bold text-warning">{restockItems.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-chart-5/30 bg-chart-5/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/20">
                <TrendingDown className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reduce Stock</p>
                <p className="text-2xl font-bold text-chart-5">{reduceItems.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Optimal Stock</p>
                <p className="text-2xl font-bold text-success">{maintainItems.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forecasts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {aiForecasts.map((forecast) => {
            const style = getRecommendationStyle(forecast.recommendation);
            return (
              <div
                key={forecast.productId}
                className={`rounded-xl border ${style.border} bg-card p-6`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{forecast.productName}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        {getTrendIcon(forecast.trend)}
                        <span className="text-sm capitalize text-muted-foreground">
                          {forecast.trend} demand
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${style.bg} ${style.text}`}
                  >
                    {forecast.recommendation}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Current Stock</p>
                    <p className="text-lg font-semibold text-foreground">
                      {forecast.currentStock} units
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Predicted Demand</p>
                    <p className="text-lg font-semibold text-foreground">
                      {forecast.predictedDemand} units
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">AI Confidence:</span>
                    <span className={`font-semibold ${getConfidenceStyle(forecast.confidenceScore)}`}>
                      {forecast.confidenceScore}%
                    </span>
                  </div>
                  {forecast.restockDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Restock by {new Date(forecast.restockDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {forecast.seasonality && (
                  <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Seasonal Insight:</span>
                      <span className="text-foreground">{forecast.seasonality}</span>
                    </div>
                  </div>
                )}

                {forecast.suggestedQuantity && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Suggested Order Quantity</span>
                    <span className="font-semibold text-foreground">
                      {forecast.suggestedQuantity} units
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
