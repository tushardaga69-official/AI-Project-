import type { Product, Order, Supplier, AIForecast, Alert, User, Category, Warehouse, SalesData } from './types';

// Sample Products
export const products: Product[] = [
  {
    id: 'PRD001',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    price: 79.99,
    costPrice: 45.00,
    quantity: 150,
    minStock: 50,
    maxStock: 300,
    supplier: 'TechSupply Co',
    warehouse: 'Main Warehouse',
    status: 'in-stock',
    lastUpdated: '2026-03-25',
  },
  {
    id: 'PRD002',
    name: 'USB-C Charging Cable 2m',
    sku: 'UCC-002',
    category: 'Electronics',
    price: 14.99,
    costPrice: 5.00,
    quantity: 25,
    minStock: 100,
    maxStock: 500,
    supplier: 'CableMaster Inc',
    warehouse: 'Main Warehouse',
    status: 'low-stock',
    lastUpdated: '2026-03-24',
  },
  {
    id: 'PRD003',
    name: 'Ergonomic Office Chair',
    sku: 'EOC-003',
    category: 'Furniture',
    price: 299.99,
    costPrice: 180.00,
    quantity: 0,
    minStock: 20,
    maxStock: 100,
    supplier: 'OfficePlus Ltd',
    warehouse: 'Secondary Warehouse',
    status: 'out-of-stock',
    lastUpdated: '2026-03-20',
  },
  {
    id: 'PRD004',
    name: 'LED Desk Lamp',
    sku: 'LDL-004',
    category: 'Lighting',
    price: 45.99,
    costPrice: 22.00,
    quantity: 85,
    minStock: 30,
    maxStock: 150,
    supplier: 'BrightLights Co',
    warehouse: 'Main Warehouse',
    status: 'in-stock',
    lastUpdated: '2026-03-26',
  },
  {
    id: 'PRD005',
    name: 'Mechanical Keyboard RGB',
    sku: 'MKR-005',
    category: 'Electronics',
    price: 129.99,
    costPrice: 75.00,
    quantity: 200,
    minStock: 40,
    maxStock: 120,
    supplier: 'TechSupply Co',
    warehouse: 'Main Warehouse',
    status: 'overstock',
    lastUpdated: '2026-03-25',
  },
  {
    id: 'PRD006',
    name: 'Wireless Mouse',
    sku: 'WM-006',
    category: 'Electronics',
    price: 34.99,
    costPrice: 15.00,
    quantity: 95,
    minStock: 50,
    maxStock: 200,
    supplier: 'TechSupply Co',
    warehouse: 'Main Warehouse',
    status: 'in-stock',
    lastUpdated: '2026-03-26',
  },
  {
    id: 'PRD007',
    name: 'Standing Desk Converter',
    sku: 'SDC-007',
    category: 'Furniture',
    price: 189.99,
    costPrice: 110.00,
    quantity: 42,
    minStock: 15,
    maxStock: 60,
    supplier: 'OfficePlus Ltd',
    warehouse: 'Secondary Warehouse',
    status: 'in-stock',
    lastUpdated: '2026-03-23',
  },
  {
    id: 'PRD008',
    name: 'Monitor Stand with USB Hub',
    sku: 'MSU-008',
    category: 'Accessories',
    price: 59.99,
    costPrice: 30.00,
    quantity: 18,
    minStock: 25,
    maxStock: 100,
    supplier: 'OfficePlus Ltd',
    warehouse: 'Main Warehouse',
    status: 'low-stock',
    lastUpdated: '2026-03-24',
  },
];

// Sample Orders
export const orders: Order[] = [
  {
    id: 'ORD001',
    type: 'sale',
    status: 'delivered',
    customer: 'John Smith',
    items: [
      { productId: 'PRD001', productName: 'Wireless Bluetooth Headphones', quantity: 2, price: 79.99, total: 159.98 },
      { productId: 'PRD004', productName: 'LED Desk Lamp', quantity: 1, price: 45.99, total: 45.99 },
    ],
    total: 205.97,
    date: '2026-03-25',
    notes: 'Express shipping requested',
  },
  {
    id: 'ORD002',
    type: 'purchase',
    status: 'pending',
    supplier: 'TechSupply Co',
    items: [
      { productId: 'PRD002', productName: 'USB-C Charging Cable 2m', quantity: 200, price: 5.00, total: 1000.00 },
    ],
    total: 1000.00,
    date: '2026-03-26',
    dueDate: '2026-04-02',
  },
  {
    id: 'ORD003',
    type: 'sale',
    status: 'shipped',
    customer: 'Sarah Johnson',
    items: [
      { productId: 'PRD005', productName: 'Mechanical Keyboard RGB', quantity: 1, price: 129.99, total: 129.99 },
      { productId: 'PRD006', productName: 'Wireless Mouse', quantity: 1, price: 34.99, total: 34.99 },
    ],
    total: 164.98,
    date: '2026-03-24',
  },
  {
    id: 'ORD004',
    type: 'return',
    status: 'confirmed',
    customer: 'Mike Wilson',
    items: [
      { productId: 'PRD001', productName: 'Wireless Bluetooth Headphones', quantity: 1, price: 79.99, total: 79.99 },
    ],
    total: 79.99,
    date: '2026-03-23',
    notes: 'Defective product - replace',
  },
  {
    id: 'ORD005',
    type: 'sale',
    status: 'pending',
    customer: 'Emily Davis',
    items: [
      { productId: 'PRD007', productName: 'Standing Desk Converter', quantity: 1, price: 189.99, total: 189.99 },
    ],
    total: 189.99,
    date: '2026-03-26',
  },
];

// Sample Suppliers
export const suppliers: Supplier[] = [
  {
    id: 'SUP001',
    name: 'TechSupply Co',
    email: 'orders@techsupply.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    products: ['PRD001', 'PRD002', 'PRD005', 'PRD006'],
    rating: 4.8,
    totalOrders: 156,
    onTimeDelivery: 98,
    status: 'active',
  },
  {
    id: 'SUP002',
    name: 'OfficePlus Ltd',
    email: 'supply@officeplus.com',
    phone: '+1 (555) 234-5678',
    address: '456 Office Blvd, New York, NY 10001',
    products: ['PRD003', 'PRD007', 'PRD008'],
    rating: 4.5,
    totalOrders: 89,
    onTimeDelivery: 94,
    status: 'active',
  },
  {
    id: 'SUP003',
    name: 'CableMaster Inc',
    email: 'sales@cablemaster.com',
    phone: '+1 (555) 345-6789',
    address: '789 Cable Lane, Austin, TX 78701',
    products: ['PRD002'],
    rating: 4.2,
    totalOrders: 45,
    onTimeDelivery: 88,
    status: 'active',
  },
  {
    id: 'SUP004',
    name: 'BrightLights Co',
    email: 'info@brightlights.com',
    phone: '+1 (555) 456-7890',
    address: '321 Light Ave, Miami, FL 33101',
    products: ['PRD004'],
    rating: 4.6,
    totalOrders: 67,
    onTimeDelivery: 96,
    status: 'active',
  },
];

// Sample AI Forecasts
export const aiForecasts: AIForecast[] = [
  {
    productId: 'PRD001',
    productName: 'Wireless Bluetooth Headphones',
    currentStock: 150,
    predictedDemand: 220,
    confidenceScore: 92,
    recommendation: 'restock',
    restockDate: '2026-04-05',
    suggestedQuantity: 100,
    trend: 'increasing',
    seasonality: 'Holiday season approaching',
  },
  {
    productId: 'PRD002',
    productName: 'USB-C Charging Cable 2m',
    currentStock: 25,
    predictedDemand: 180,
    confidenceScore: 95,
    recommendation: 'urgent',
    restockDate: '2026-03-28',
    suggestedQuantity: 200,
    trend: 'increasing',
    seasonality: 'Consistent demand',
  },
  {
    productId: 'PRD003',
    productName: 'Ergonomic Office Chair',
    currentStock: 0,
    predictedDemand: 35,
    confidenceScore: 88,
    recommendation: 'urgent',
    restockDate: '2026-03-27',
    suggestedQuantity: 50,
    trend: 'stable',
    seasonality: 'Q2 office refresh cycle',
  },
  {
    productId: 'PRD005',
    productName: 'Mechanical Keyboard RGB',
    currentStock: 200,
    predictedDemand: 60,
    confidenceScore: 85,
    recommendation: 'reduce',
    trend: 'decreasing',
    seasonality: 'Post-holiday slowdown',
  },
  {
    productId: 'PRD006',
    productName: 'Wireless Mouse',
    currentStock: 95,
    predictedDemand: 90,
    confidenceScore: 90,
    recommendation: 'maintain',
    trend: 'stable',
  },
  {
    productId: 'PRD008',
    productName: 'Monitor Stand with USB Hub',
    currentStock: 18,
    predictedDemand: 45,
    confidenceScore: 87,
    recommendation: 'restock',
    restockDate: '2026-04-01',
    suggestedQuantity: 50,
    trend: 'increasing',
  },
];

// Sample Alerts
export const alerts: Alert[] = [
  {
    id: 'ALT001',
    type: 'low-stock',
    severity: 'high',
    title: 'Critical Low Stock Alert',
    message: 'USB-C Charging Cable 2m is running critically low (25 units remaining)',
    productId: 'PRD002',
    productName: 'USB-C Charging Cable 2m',
    timestamp: '2026-03-27T10:30:00Z',
    read: false,
    actionRequired: true,
  },
  {
    id: 'ALT002',
    type: 'low-stock',
    severity: 'critical',
    title: 'Out of Stock',
    message: 'Ergonomic Office Chair is completely out of stock',
    productId: 'PRD003',
    productName: 'Ergonomic Office Chair',
    timestamp: '2026-03-27T09:15:00Z',
    read: false,
    actionRequired: true,
  },
  {
    id: 'ALT003',
    type: 'ai-insight',
    severity: 'medium',
    title: 'AI Demand Prediction',
    message: 'Wireless Bluetooth Headphones demand expected to increase by 40% next month',
    productId: 'PRD001',
    productName: 'Wireless Bluetooth Headphones',
    timestamp: '2026-03-27T08:00:00Z',
    read: false,
    actionRequired: false,
  },
  {
    id: 'ALT004',
    type: 'overstock',
    severity: 'low',
    title: 'Overstock Warning',
    message: 'Mechanical Keyboard RGB exceeds maximum stock level',
    productId: 'PRD005',
    productName: 'Mechanical Keyboard RGB',
    timestamp: '2026-03-26T16:45:00Z',
    read: true,
    actionRequired: false,
  },
  {
    id: 'ALT005',
    type: 'demand-spike',
    severity: 'medium',
    title: 'Demand Spike Detected',
    message: 'Standing Desk Converter showing unusual demand increase (150% above average)',
    productId: 'PRD007',
    productName: 'Standing Desk Converter',
    timestamp: '2026-03-26T14:20:00Z',
    read: true,
    actionRequired: false,
  },
];

// Sample Users
export const users: User[] = [
  {
    id: 'USR001',
    name: 'Admin User',
    email: 'admin@inventoryai.com',
    role: 'admin',
    createdAt: '2025-01-15',
  },
  {
    id: 'USR002',
    name: 'Jane Manager',
    email: 'jane@inventoryai.com',
    role: 'manager',
    createdAt: '2025-03-20',
  },
  {
    id: 'USR003',
    name: 'Bob Staff',
    email: 'bob@inventoryai.com',
    role: 'staff',
    createdAt: '2025-06-10',
  },
];

// Sample Categories
export const categories: Category[] = [
  { id: 'CAT001', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 4 },
  { id: 'CAT002', name: 'Furniture', description: 'Office and home furniture', productCount: 2 },
  { id: 'CAT003', name: 'Lighting', description: 'Lamps and lighting solutions', productCount: 1 },
  { id: 'CAT004', name: 'Accessories', description: 'Computer and desk accessories', productCount: 1 },
];

// Sample Warehouses
export const warehouses: Warehouse[] = [
  { id: 'WH001', name: 'Main Warehouse', location: 'San Francisco, CA', capacity: 10000, currentStock: 6500 },
  { id: 'WH002', name: 'Secondary Warehouse', location: 'Los Angeles, CA', capacity: 5000, currentStock: 2800 },
];

// Sample Sales Data for Analytics
export const salesData: SalesData[] = [
  { date: '2026-03-01', revenue: 12450, orders: 45, profit: 4580 },
  { date: '2026-03-02', revenue: 8920, orders: 32, profit: 3210 },
  { date: '2026-03-03', revenue: 15680, orders: 58, profit: 5890 },
  { date: '2026-03-04', revenue: 11230, orders: 41, profit: 4120 },
  { date: '2026-03-05', revenue: 9870, orders: 36, profit: 3650 },
  { date: '2026-03-06', revenue: 14560, orders: 52, profit: 5340 },
  { date: '2026-03-07', revenue: 16890, orders: 61, profit: 6280 },
  { date: '2026-03-08', revenue: 13450, orders: 48, profit: 4920 },
  { date: '2026-03-09', revenue: 10230, orders: 37, profit: 3780 },
  { date: '2026-03-10', revenue: 17890, orders: 65, profit: 6590 },
  { date: '2026-03-11', revenue: 15670, orders: 56, profit: 5780 },
  { date: '2026-03-12', revenue: 12340, orders: 44, profit: 4560 },
  { date: '2026-03-13', revenue: 18920, orders: 68, profit: 7120 },
  { date: '2026-03-14', revenue: 14560, orders: 52, profit: 5340 },
  { date: '2026-03-15', revenue: 11890, orders: 43, profit: 4380 },
  { date: '2026-03-16', revenue: 16780, orders: 60, profit: 6190 },
  { date: '2026-03-17', revenue: 19450, orders: 70, profit: 7230 },
  { date: '2026-03-18', revenue: 13670, orders: 49, profit: 5040 },
  { date: '2026-03-19', revenue: 15230, orders: 55, profit: 5620 },
  { date: '2026-03-20', revenue: 17890, orders: 64, profit: 6610 },
  { date: '2026-03-21', revenue: 20120, orders: 72, profit: 7450 },
  { date: '2026-03-22', revenue: 14560, orders: 52, profit: 5380 },
  { date: '2026-03-23', revenue: 12890, orders: 46, profit: 4760 },
  { date: '2026-03-24', revenue: 18340, orders: 66, profit: 6790 },
  { date: '2026-03-25', revenue: 21560, orders: 78, profit: 7980 },
  { date: '2026-03-26', revenue: 16780, orders: 60, profit: 6210 },
  { date: '2026-03-27', revenue: 19890, orders: 71, profit: 7360 },
];

// Helper function to get inventory metrics
export function getInventoryMetrics() {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStockItems = products.filter(p => p.status === 'low-stock').length;
  const outOfStockItems = products.filter(p => p.status === 'out-of-stock').length;
  const overstockItems = products.filter(p => p.status === 'overstock').length;
  const turnoverRate = 4.2; // Monthly average

  return {
    totalProducts,
    totalValue,
    lowStockItems,
    outOfStockItems,
    overstockItems,
    turnoverRate,
  };
}

// Helper function to get dashboard stats
export function getDashboardStats() {
  const today = salesData[salesData.length - 1];
  const yesterday = salesData[salesData.length - 2];
  const weekSales = salesData.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
  const monthSales = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return {
    todayRevenue: today.revenue,
    todayOrders: today.orders,
    weekSales,
    monthSales,
    revenueChange: ((today.revenue - yesterday.revenue) / yesterday.revenue * 100).toFixed(1),
    unreadAlerts,
    pendingOrders,
  };
}
