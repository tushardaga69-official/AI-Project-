/* ================================================
   NEXSTOCK AI — DATA STORE
   js/data.js
   Shared data layer with localStorage persistence
================================================ */

const NexDB = (() => {

  /* ---------- Seed products ---------- */
  const SEED_PRODUCTS = [
    { id:1,  name:'iPhone 15 Pro',    category:'Electronics', quantity:8,   price:999,  threshold:20, emoji:'📱' },
    { id:2,  name:'Nike Air Max',     category:'Clothing',     quantity:34,  price:149,  threshold:30, emoji:'👟' },
    { id:3,  name:'Protein Powder',   category:'Food',         quantity:150, price:59,   threshold:40, emoji:'💪' },
    { id:4,  name:'Samsung TV 55"',   category:'Electronics',  quantity:340, price:799,  threshold:20, emoji:'📺' },
    { id:5,  name:'Yoga Mat Pro',     category:'Sports',       quantity:22,  price:49,   threshold:25, emoji:'🧘' },
    { id:6,  name:'Lipstick Set',     category:'Beauty',       quantity:3,   price:39,   threshold:15, emoji:'💄' },
    { id:7,  name:'MacBook Air M3',   category:'Electronics',  quantity:12,  price:1299, threshold:10, emoji:'💻' },
    { id:8,  name:'Running Shoes',    category:'Clothing',     quantity:55,  price:129,  threshold:20, emoji:'👞' },
    { id:9,  name:'Whey Isolate',     category:'Food',         quantity:89,  price:79,   threshold:30, emoji:'🥤' },
    { id:10, name:'Football Pro',     category:'Sports',       quantity:7,   price:89,   threshold:15, emoji:'⚽' },
    { id:11, name:'Serum Vitamin C',  category:'Beauty',       quantity:200, price:29,   threshold:30, emoji:'✨' },
    { id:12, name:'AirPods Pro',      category:'Electronics',  quantity:28,  price:249,  threshold:15, emoji:'🎧' },
    { id:13, name:'Denim Jacket',     category:'Clothing',     quantity:15,  price:89,   threshold:20, emoji:'🧥' },
    { id:14, name:'Green Tea Pack',   category:'Food',         quantity:400, price:19,   threshold:50, emoji:'🍵' },
    { id:15, name:'Tennis Racket',    category:'Sports',       quantity:18,  price:159,  threshold:10, emoji:'🎾' },
    { id:16, name:'Foundation SPF',   category:'Beauty',       quantity:45,  price:49,   threshold:25, emoji:'🌟' },
    { id:17, name:'iPad Mini',        category:'Electronics',  quantity:9,   price:499,  threshold:8,  emoji:'📱' },
    { id:18, name:'Hoodie Classic',   category:'Clothing',     quantity:80,  price:69,   threshold:20, emoji:'👘' },
    { id:19, name:'Multivitamin',     category:'Food',         quantity:260, price:29,   threshold:40, emoji:'💊' },
    { id:20, name:'Cycling Helmet',   category:'Sports',       quantity:11,  price:129,  threshold:10, emoji:'🪖' },
  ];

  /* ---------- Category config ---------- */
  const CATEGORIES = {
    Electronics: { color: '#40dcff', bg: 'rgba(64,220,255,0.12)'  },
    Clothing:    { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
    Food:        { color: '#10d9a0', bg: 'rgba(16,217,160,0.12)'  },
    Sports:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
    Beauty:      { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'   },
  };

  /* ---------- Storage helpers ---------- */
  const KEYS = {
    PRODUCTS:  'nexstock_products',
    NEXT_ID:   'nexstock_next_id',
    THEME:     'nexstock_theme',
    USER:      'nexstock_user',
  };

  function loadProducts() {
    try {
      const raw = localStorage.getItem(KEYS.PRODUCTS);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    // First load — seed
    saveProducts(SEED_PRODUCTS);
    return SEED_PRODUCTS.map(p => ({ ...p }));
  }

  function saveProducts(products) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  }

  function getNextId() {
    const n = parseInt(localStorage.getItem(KEYS.NEXT_ID) || '21');
    localStorage.setItem(KEYS.NEXT_ID, n + 1);
    return n;
  }

  /* ---------- Product helpers ---------- */
  function getStatus(p) {
    if (p.quantity === 0)                        return 'Out of Stock';
    if (p.quantity < p.threshold)                return 'Low Stock';
    if (p.quantity > p.threshold * 10)           return 'Overstock';
    return 'In Stock';
  }

  function getForecastUnits(p) {
    // Simulated AI demand value
    const base = Math.round(p.threshold * 2.5 + Math.random() * 20);
    return base;
  }

  /* ---------- Public API ---------- */
  return {
    CATEGORIES,

    /* Products */
    getProducts()          { return loadProducts(); },
    saveProducts,
    getNextId,
    getStatus,
    getForecastUnits,

    getCategoryColor(cat)  { return CATEGORIES[cat]?.color || '#7a85a3'; },
    getCategoryBg(cat)     { return CATEGORIES[cat]?.bg    || 'rgba(122,133,163,0.12)'; },

    /* Aggregate stats */
    getStats() {
      const products = loadProducts();
      const lowStock  = products.filter(p => getStatus(p) === 'Low Stock');
      const overstock = products.filter(p => getStatus(p) === 'Overstock');
      const totalQty  = products.reduce((s,p) => s + p.quantity, 0);
      const totalVal  = products.reduce((s,p) => s + p.quantity * p.price, 0);
      return { total: products.length, totalQty, totalVal, lowStock: lowStock.length, overstock: overstock.length };
    },

    /* Category breakdown for pie chart */
    getCategoryBreakdown() {
      const products = loadProducts();
      const cats = {};
      products.forEach(p => {
        cats[p.category] = (cats[p.category] || 0) + (p.quantity * p.price);
      });
      return cats;
    },

    /* Theme */
    getTheme() { return localStorage.getItem(KEYS.THEME) || 'dark'; },
    setTheme(t){ localStorage.setItem(KEYS.THEME, t); },

    /* User session */
    getUser()  {
      try { return JSON.parse(localStorage.getItem(KEYS.USER)); } catch(e) { return null; }
    },
    setUser(u) { localStorage.setItem(KEYS.USER, JSON.stringify(u)); },
    clearUser(){ localStorage.removeItem(KEYS.USER); },
    isLoggedIn(){ return !!localStorage.getItem(KEYS.USER); },
  };
})();
