/* ================================================
   NEXSTOCK AI — RECOMMENDATIONS
   js/recommendations.js
================================================ */

const BEST_SELLERS = [
  { name: 'Protein Powder',   category: 'Food',        units: 320, revenue: '$18,880', trend: '+24%', emoji: '💪' },
  { name: 'iPhone 15 Pro',    category: 'Electronics', units: 290, revenue: '$289,710', trend: '+18%', emoji: '📱' },
  { name: 'Nike Air Max',     category: 'Clothing',    units: 255, revenue: '$37,995',  trend: '+12%', emoji: '👟' },
  { name: 'AirPods Pro',      category: 'Electronics', units: 210, revenue: '$52,290',  trend: '+9%',  emoji: '🎧' },
  { name: 'Serum Vitamin C',  category: 'Beauty',      units: 190, revenue: '$5,510',   trend: '+7%',  emoji: '✨' },
  { name: 'Multivitamin',     category: 'Food',        units: 175, revenue: '$5,075',   trend: '+5%',  emoji: '💊' },
  { name: 'Hoodie Classic',   category: 'Clothing',    units: 162, revenue: '$11,178',  trend: '+4%',  emoji: '👘' },
];

const SLOW_MOVERS = [
  { name: 'Tennis Racket',   category: 'Sports',      units: 8,  revenue: '$1,272', trend: '-15%', emoji: '🎾' },
  { name: 'Cycling Helmet',  category: 'Sports',      units: 11, revenue: '$1,419', trend: '-11%', emoji: '🪖' },
  { name: 'Green Tea Pack',  category: 'Food',        units: 14, revenue: '$266',   trend: '-8%',  emoji: '🍵' },
  { name: 'Denim Jacket',    category: 'Clothing',    units: 15, revenue: '$1,335', trend: '-5%',  emoji: '🧥' },
  { name: 'Football Pro',    category: 'Sports',      units: 18, revenue: '$1,602', trend: '-3%',  emoji: '⚽' },
];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderBestSellers();
  renderSlowMovers();
  buildRecsBarChart();
  buildRecsTrendChart();
});

/* ================================================
   RENDER LISTS
================================================ */
function renderBestSellers() {
  const container = document.getElementById('bestSellersList');
  if (!container) return;
  container.innerHTML = BEST_SELLERS.map((p, i) => buildRecRow(p, i, true)).join('');
}

function renderSlowMovers() {
  const container = document.getElementById('slowMoversList');
  if (!container) return;
  container.innerHTML = SLOW_MOVERS.map((p, i) => buildRecRow(p, i, false)).join('');
}

function buildRecRow(p, i, isBest) {
  const color  = NexDB.getCategoryColor(p.category);
  const bg     = NexDB.getCategoryBg(p.category);
  const tColor = isBest ? 'var(--accent-emerald)' : 'var(--accent-rose)';
  return `
    <div class="rec-row" style="animation-delay:${i * 0.06}s">
      <span class="rec-rank">#${i + 1}</span>
      <div class="product-icon" style="background:${bg};width:30px;height:30px;font-size:13px;border-radius:7px;flex-shrink:0">${p.emoji}</div>
      <div class="rec-info">
        <div class="rec-name">${p.name}</div>
        <div class="rec-units">${p.units} units · ${p.revenue}</div>
      </div>
      <span class="badge" style="background:${bg};color:${color};font-size:10px">${p.category}</span>
      <span class="rec-trend" style="color:${tColor}">${p.trend}</span>
    </div>`;
}

/* ================================================
   CHARTS
================================================ */
function buildRecsBarChart() {
  const ctx = document.getElementById('recsBarChart');
  if (!ctx) return;

  const cats   = ['Electronics','Food','Clothing','Beauty','Sports'];
  const vals   = [420, 190, 155, 90, 68];
  const colors = cats.map(c => NexDB.getCategoryColor(c));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cats,
      datasets: [{
        label: 'Revenue ($K)',
        data: vals,
        backgroundColor: colors.map(c => c + '40'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      ...chartDefaults(),
      plugins: { ...chartDefaults().plugins, legend: { display: false } },
    },
  });
}

function buildRecsTrendChart() {
  const ctx = document.getElementById('recsTrendChart');
  if (!ctx) return;

  const weeks = ['W1','W2','W3','W4','W5','W6','W7','W8'];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks,
      datasets: BEST_SELLERS.slice(0, 3).map((p, i) => {
        const colors = ['#40dcff', '#8b5cf6', '#10d9a0'];
        const base   = [180, 140, 100][i];
        return {
          label: p.name,
          data: RandData.trend(base - 20, base + 30, 8, 0.12),
          borderColor: colors[i],
          backgroundColor: colors[i] + '10',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.42,
          fill: false,
        };
      }),
    },
    options: chartDefaults(),
  });
}
