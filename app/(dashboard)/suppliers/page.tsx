'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { suppliers } from '@/lib/data';
import {
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  Truck,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  Clock,
} from 'lucide-react';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen">
      <AppHeader title="Suppliers" />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-secondary">
              <button
                onClick={() => setViewMode('grid')}
                className={`h-10 px-4 text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground rounded-l-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`h-10 px-4 text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary text-primary-foreground rounded-r-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Table
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Suppliers Grid */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{supplier.name}</h3>
                      <span
                        className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusStyle(
                          supplier.status
                        )}`}
                      >
                        {supplier.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{supplier.address}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-3 flex items-center gap-1">{getRatingStars(supplier.rating)}</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-card-foreground">
                        {supplier.totalOrders}
                      </p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-card-foreground">
                        {supplier.products.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-success">{supplier.onTimeDelivery}%</p>
                      <p className="text-xs text-muted-foreground">On-time</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-muted-foreground">
                      Supplier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-muted-foreground">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase text-muted-foreground">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase text-muted-foreground">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase text-muted-foreground">
                      On-Time %
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Truck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{supplier.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.products.length} products
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">{supplier.email}</p>
                        <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {getRatingStars(supplier.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
                        {supplier.totalOrders}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-success">
                          {supplier.onTimeDelivery}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                            supplier.status
                          )}`}
                        >
                          {supplier.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
