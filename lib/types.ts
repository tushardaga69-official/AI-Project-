// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  warehouse: string;
  expiryDate?: string;
  batchNumber?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  lastUpdated: string;
}

// Order Types
export interface Order {
  id: string;
  type: 'sale' | 'purchase' | 'return';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customer?: string;
  supplier?: string;
  items: OrderItem[];
  total: number;
  date: string;
  dueDate?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  rating: number;
  totalOrders: number;
  onTimeDelivery: number;
  status: 'active' | 'inactive';
}

// AI Forecast Types
export interface AIForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  confidenceScore: number;
  recommendation: 'restock' | 'reduce' | 'maintain' | 'urgent';
  restockDate?: string;
  suggestedQuantity?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality?: string;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'low-stock' | 'overstock' | 'expiry' | 'demand-spike' | 'ai-insight';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
}

// Analytics Types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface InventoryMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  turnoverRate: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

// Warehouse Types
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
}
