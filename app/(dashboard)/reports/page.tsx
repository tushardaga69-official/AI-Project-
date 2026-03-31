'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  FilePdf,
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Detailed breakdown of all sales transactions',
      icon: DollarSign,
      color: 'bg-success/20 text-success',
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Current stock levels and inventory valuation',
      icon: Package,
      color: 'bg-primary/20 text-primary',
    },
    {
      id: 'profit-loss',
      name: 'Profit & Loss Report',
      description: 'Revenue, costs, and profit margins analysis',
      icon: TrendingUp,
      color: 'bg-chart-5/20 text-chart-5',
    },
    {
      id: 'turnover',
      name: 'Inventory Turnover',
      description: 'Stock movement and turnover rates',
      icon: BarChart3,
      color: 'bg-warning/20 text-warning',
    },
  ];

  const recentReports = [
    { name: 'Sales Report - March 2026', date: '2026-03-25', format: 'PDF', size: '245 KB' },
    { name: 'Inventory Report - Q1 2026', date: '2026-03-20', format: 'Excel', size: '1.2 MB' },
    { name: 'Profit & Loss - February 2026', date: '2026-03-01', format: 'PDF', size: '189 KB' },
    { name: 'Turnover Analysis - Q4 2025', date: '2026-01-15', format: 'Excel', size: '856 KB' },
  ];

  const selectedReportData = reports.find((r) => r.id === selectedReport);

  return (
    <div className="min-h-screen">
      <AppHeader title="Reports" />

      <div className="p-6">
        {/* Report Type Selection */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex flex-col items-start rounded-xl border p-6 text-left transition-colors ${
                  selectedReport === report.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${report.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground">{report.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
              </button>
            );
          })}
        </div>

        {/* Report Generator */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            {selectedReportData && (
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedReportData.color}`}>
                <selectedReportData.icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Generate {selectedReportData?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure and download your report
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Category
              </label>
              <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Lighting</option>
                <option>Accessories</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Warehouse
              </label>
              <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>All Warehouses</option>
                <option>Main Warehouse</option>
                <option>Secondary Warehouse</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Format</label>
              <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" />
              Generate Report
            </button>
            <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Reports</h2>
            <p className="text-sm text-muted-foreground">Previously generated reports</p>
          </div>

          <div className="divide-y divide-border">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {report.format === 'PDF' ? (
                      <FilePdf className="h-6 w-6 text-destructive" />
                    ) : (
                      <FileSpreadsheet className="h-6 w-6 text-success" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {report.format}
                  </span>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">Scheduled Reports</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Weekly Sales Report</p>
                  <p className="text-sm text-muted-foreground">
                    Every Monday at 9:00 AM - PDF
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                  Active
                </span>
                <button className="text-sm font-medium text-primary hover:underline">Edit</button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Monthly Inventory Report</p>
                  <p className="text-sm text-muted-foreground">
                    1st of every month at 6:00 AM - Excel
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                  Active
                </span>
                <button className="text-sm font-medium text-primary hover:underline">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
