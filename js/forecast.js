/* ================================================
   NEXSTOCK AI — AI FORECAST
   js/forecast.js
================================================ */

let forecastChart  = null;
let forecastRange  = 7;
let forecastRunning = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  buildForecastChart();
  bindForecastControls();
});

/* ================================================
   CONTROLS
================================================ */
function bindForecastControls() {
  // Range tabs
  document.querySelectorAll('.range-tab[data-range]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.range-tab[data-range]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      forecastRange = parseInt(tab.dataset.range);
    });
  });

  // Predict button
  document.getElementById('predictBtn')?.addEventListener('click', runForecast);
}

/* ================================================
   FORECAST CHART (initial blank state)
================================================ */
function buildForecastChart() {
  const ctx = document.getElementById('forecastChart');
  if (!ctx) return;

  const pastLabels   = Array.from({ length: 14 }, (_, i) => `D-${14 - i}`);
  const futureDummy  = ['D+1','D+2','D+3','D+4','D+5','D+6','D+7'];
  const past         = RandData.trend(40, 90, 14);

  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...pastLabels, ...futureDummy],
      datasets: [
        {
          label: 'Past Sales',
          data: [...past, ...Array(7).fill(null)],
          borderColor: '#40dcff',
          backgroundColor: 'rgba(64,220,255,0.07)',
          borderWidth: 2.5,
          pointRadius: 3,
          tension: 0.42,
          fill: true,
        },
        {
          label: 'AI Predicted',
          data: Array(21).fill(null),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.07)',
          borderWidth: 2.5,
          borderDash: [6, 4],
          pointRadius: 4,
          pointBackgroundColor: '#8b5cf6',
          tension: 0.42,
          fill: true,
        },
      ],
    },
    options: {
      ...chartDefaults(),
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false },
          ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false },
          ticks: { color: '#3d4660', font: { family: 'DM Mono', size: 10 } },
          border: { display: false },
        },
      },
    },
  });
}

/* ================================================
   RUN FORECAST
================================================ */
function runForecast() {
  if (forecastRunning) return;
  forecastRunning = true;

  const btn     = document.getElementById('predictBtn');
  const spinner = document.getElementById('predictSpinner');
  const bannerMsg = document.getElementById('forecastBannerMsg');

  if (btn)     btn.classList.add('loading');
  if (spinner) spinner.style.display = 'block';
  if (bannerMsg) {
    bannerMsg.textContent = '🔄 AI model running… Analyzing 90-day sales patterns and seasonal trends…';
  }

  // Simulate ML processing delay
  const steps = [
    { delay: 400,  msg: '🔄 Fetching historical sales data…' },
    { delay: 900,  msg: '🧠 Running LSTM demand prediction model…' },
    { delay: 1500, msg: '📊 Applying seasonal adjustment factors…' },
    { delay: 2000, msg: '✅ Forecast complete!' },
  ];

  steps.forEach(({ delay, msg }) => {
    setTimeout(() => {
      if (bannerMsg) bannerMsg.textContent = msg;
    }, delay);
  });

  setTimeout(() => {
    generateForecastResults();
    forecastRunning = false;
    if (btn)     btn.classList.remove('loading');
    if (spinner) spinner.style.display = 'none';
  }, 2200);
}

function generateForecastResults() {
  const productName = document.getElementById('forecastProduct')?.value || 'All Products';
  const demand      = Math.round(65 + forecastRange * 4.5 + Math.random() * 25);
  const reorder     = Math.round(demand * 0.68);
  const conf        = (88 + Math.random() * 9).toFixed(1);
  const trend       = Math.random() > 0.3 ? 'up' : 'down';
  const trendPct    = (3 + Math.random() * 18).toFixed(1);

  // Update metric cards
  setMetric('metricDemand',   demand + ' units',   `Next ${forecastRange} days · ${productName}`);
  setMetric('metricReorder',  reorder + ' units',  'Suggested reorder quantity');
  setMetric('metricConf',     conf + '%',           'ML model confidence score');

  // Update banner
  const bannerMsg = document.getElementById('forecastBannerMsg');
  if (bannerMsg) {
    bannerMsg.textContent =
      `⚡ Predicted demand for next ${forecastRange} days: ${demand} units · ` +
      `Recommend ordering ${reorder} units · Trend: ${trend === 'up' ? '📈' : '📉'} ${trendPct}%`;
  }

  // Rebuild chart
  const past         = RandData.trend(38, 92, 14);
  const predicted    = RandData.trend(past[13], past[13] + (trend === 'up' ? 20 : -10), forecastRange, 0.12);
  const pastLabels   = Array.from({ length: 14 }, (_, i) => `D-${14 - i}`);
  const futureLabels = Array.from({ length: forecastRange }, (_, i) => `D+${i + 1}`);

  forecastChart.data.labels              = [...pastLabels, ...futureLabels];
  forecastChart.data.datasets[0].data    = [...past, ...Array(forecastRange).fill(null)];
  forecastChart.data.datasets[1].data    = [...Array(14).fill(null), ...predicted];
  forecastChart.update();

  Toast.show(`🤖 Forecast generated — ${demand} units predicted over ${forecastRange} days`, 'success');
}

function setMetric(id, value, sub) {
  const el    = document.getElementById(id);
  const subEl = document.getElementById(id + 'Sub');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = value; el.style.opacity = '1'; }, 150);
  }
  if (subEl) subEl.textContent = sub;
}
