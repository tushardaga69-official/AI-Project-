/* ================================================
   NEXSTOCK AI — DASHBOARD
   js/dashboard.js
================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  loadStats();
  initDashboardCharts();
  startAiBannerRotation();
});

/* ================================================
   STATS
================================================ */
function loadStats() {
  const stats = NexDB.getStats();
  const products = NexDB.getProducts();

  // Animate count-up
  countUp('statTotalProducts', stats.total);
  countUp('statLowStock',      stats.lowStock);
  countUp('statOverstock',     stats.overstock);

  const revenue = products.reduce((s,p) => s + p.quantity * p.price * 0.12, 0);
  document.getElementById('statRevenue').textContent = Fmt.currencyK(Math.round(revenue));
}

function countUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 900;
  const step     = 16;
  const steps    = duration / step;
  let current    = 0;
  const increment = target / steps;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, step);
}

/* ================================================
   AI BANNER ROTATION
================================================ */
const AI_MESSAGES = [
  '⚡ Predicted demand for next 7 days: 120 units · Stock available: 50 → Need to restock',
  '🔮 iPhone 15 Pro restock needed within 3 days · AI confidence: 94%',
  '📈 Protein Powder demand spike predicted next week · Pre-order 150 units',
  '⚠️ 14 products below restock threshold · AI has generated reorder suggestions',
  '🧠 ML model accuracy improved to 94.2% this week based on new training data',
];

let msgIndex = 0;
function startAiBannerRotation() {
  const el = document.getElementById('aiBannerMsg');
  if (!el) return;
  setInterval(() => {
    msgIndex = (msgIndex + 1) % AI_MESSAGES.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = AI_MESSAGES[msgIndex];
      el.style.opacity = '1';
    }, 300);
  }, 4500);
}

/* ================================================
   CHARTS
================================================ */
const salesData = {
  daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
              data:   [42, 67, 38, 82, 56, 94, 71] },
  weekly:  { labels: ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7'],
              data:   [310, 480, 395, 520, 410, 620, 540] },
  monthly: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
              data:   [1200,1800,1500,2100,1900,2500,2200,2700,2400,2900,2600,3100] },
};

let salesChart, categoryChart, forecastMiniChart, stockHealthChart;
let currentSalesMode = 'daily';

function initDashboardCharts() {
  buildSalesChart();
  buildCategoryChart();
  buildForecastMiniChart();
  buildStockHealthChart();
}

/* Sales bar */
function buildSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  const d = salesData.daily;
  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Sales Units',
        data: d.data,
        backgroundColor: 'rgba(64,220,255,0.18)',
        borderColor: '#40dcff',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(64,220,255,0.35)',
      }],
    },
    options: {
      ...chartDefaults(),
      plugins: { ...chartDefaults().plugins, legend: { display: false } },
    },
  });
}

window.updateSalesChart = function(mode, btn) {
  document.querySelectorAll('#salesRangeTabs .range-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentSalesMode = mode;
  const d = salesData[mode];
  salesChart.data.labels               = d.labels;
  salesChart.data.datasets[0].data     = d.data;
  salesChart.update();
};

/* Category doughnut */
function buildCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  const breakdown = NexDB.getCategoryBreakdown();
  const cats   = Object.keys(breakdown);
  const values = cats.map(c => Math.round(breakdown[c]));
  const colors = cats.map(c => NexDB.getCategoryColor(c));

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cats,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + '40'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#7a85a3',
            font: { family: 'DM Mono', size: 10 },
            padding: 10,
            usePointStyle: true,
          },
        },
        tooltip: chartDefaults().plugins.tooltip,
      },
    },
  });
}

/* Forecast mini line */
function buildForecastMiniChart() {
  const ctx = document.getElementById('forecastMiniChart');
  if (!ctx) return;
  const pastLabels   = Array.from({ length: 14 }, (_, i) => `D-${14 - i}`);
  const futureLabels = ['D+1','D+2','D+3','D+4','D+5','D+6','D+7'];
  const allLabels    = [...pastLabels, ...futureLabels];
  const past         = RandData.trend(38, 95, 14);
  const predicted    = RandData.trend(past[13], past[13] + 28, 7, 0.1);

  forecastMiniChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allLabels,
      datasets: [
        {
          label: 'Actual',
          data: [...past, ...Array(7).fill(null)],
          borderColor: '#40dcff',
          backgroundColor: 'rgba(64,220,255,0.06)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'AI Forecast',
          data: [...Array(14).fill(null), ...predicted],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.06)',
          borderWidth: 2,
          borderDash: [5, 3],
          pointRadius: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: chartDefaults(),
  });
}

/* Stock health stacked bar */
function buildStockHealthChart() {
  const ctx = document.getElementById('stockHealthChart');
  if (!ctx) return;
  const cats = ['Electronics','Clothing','Food','Sports','Beauty'];

  stockHealthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cats,
      datasets: [
        {
          label: 'In Stock',
          data: [62, 78, 88, 68, 72],
          backgroundColor: 'rgba(16,217,160,0.45)',
          borderColor: '#10d9a0',
          borderWidth: 1.5,
          borderRadius: 4,
        },
        {
          label: 'Low Stock',
          data: [28, 12, 6, 22, 18],
          backgroundColor: 'rgba(244,63,94,0.45)',
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 4,
        },
        {
          label: 'Overstock',
          data: [10, 10, 6, 10, 10],
          backgroundColor: 'rgba(245,158,11,0.45)',
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...chartDefaults(),
      scales: {
        x: { stacked: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } }, border: { display: false } },
        y: { stacked: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } }, border: { display: false } },
      },
    },
  });
}
