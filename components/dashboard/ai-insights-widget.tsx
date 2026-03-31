'use client';

import Link from 'next/link';
import { aiForecasts } from '@/lib/data';
import { Brain, TrendingUp, TrendingDown, Minus, ArrowRight, AlertCircle } from 'lucide-react';

export function AIInsightsWidget() {
  const topInsights = aiForecasts.slice(0, 4);

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'urgent':
        return 'bg-destructive/20 text-destructive';
      case 'restock':
        return 'bg-warning/20 text-warning';
      case 'reduce':
        return 'bg-chart-5/20 text-chart-5';
      default:
        return 'bg-success/20 text-success';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Smart recommendations</p>
          </div>
        </div>
        <Link
          href="/ai-insights"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {topInsights.map((insight) => (
          <div
            key={insight.productId}
            className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{insight.productName}</p>
              <div className="mt-1 flex items-center gap-2">
                {getTrendIcon(insight.trend)}
                <span className="text-sm text-muted-foreground">
                  Predicted demand: {insight.predictedDemand} units
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {insight.confidenceScore}% confidence
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getRecommendationStyle(
                  insight.recommendation
                )}`}
              >
                {insight.recommendation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
