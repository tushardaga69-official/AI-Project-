/* ================================================
   NEXSTOCK AI — SMART ALERTS
   js/alerts.js
================================================ */

const ALERTS_DATA = [
  {
    id: 1, type: 'critical', icon: '🚨',
    title: 'Critical Stock: iPhone 15 Pro',
    desc:  'Only 8 units remaining. Average daily demand is 12 units. Will stock out in <1 day.',
    ai:    '🤖 AI suggests: Order 80 units immediately from Supplier A (lead time: 2 days)',
    time:  '2m ago',
  },
  {
    id: 2, type: 'critical', icon: '🚨',
    title: 'Critical Stock: Lipstick Set',
    desc:  'Only 3 units remaining. Below minimum threshold of 15. High demand season upcoming.',
    ai:    '🤖 AI suggests: Order 60 units to maintain 30-day coverage buffer',
    time:  '5m ago',
  },
  {
    id: 3, type: 'critical', icon: '🚨',
    title: 'Critical Stock: Football Pro',
    desc:  '7 units remaining. AI forecasts demand of 35 units over next 14 days (season spike).',
    ai:    '🤖 AI suggests: Order 50 units ASAP — sports season demand spike in 3 days',
    time:  '12m ago',
  },
  {
    id: 4, type: 'critical', icon: '🚨',
    title: 'Critical Stock: Cycling Helmet',
    desc:  '11 units left. Summer cycling season starts next week. Historical demand: 40 units/week.',
    ai:    '🤖 AI suggests: Emergency restock of 100 units before seasonal demand peaks',
    time:  '18m ago',
  },
  {
    id: 5, type: 'warning', icon: '⚡',
    title: 'Overstock Alert: Samsung TV 55"',
    desc:  '340 units in stock. Typical monthly demand is only 25 units. Capital tied up: $271,460.',
    ai:    '🤖 AI suggests: Run a 15% promotional discount — estimated to clear 80 units/month',
    time:  '32m ago',
  },
  {
    id: 6, type: 'warning', icon: '⚡',
    title: 'Overstock Alert: Green Tea Pack',
    desc:  '400 units with slow turnover of ~8 units/week. Shelf-life risk in 45 days.',
    ai:    '🤖 AI suggests: Bundle with Protein Powder orders or reduce reorder qty by 60%',
    time:  '1h ago',
  },
  {
    id: 7, type: 'warning', icon: '⚡',
    title: 'Low Stock Warning: Yoga Mat Pro',
    desc:  '22 units remaining, just below the threshold of 25. Forecast: 40 units in 14 days.',
    ai:    '🤖 AI suggests: Order 50 units within 3 days to prevent stockout during peak period',
    time:  '2h ago',
  },
  {
    id: 8, type: 'info', icon: '💡',
    title: 'Demand Spike Predicted: Protein Powder',
    desc:  'ML model detects 25% demand increase over next 30 days based on seasonal trends.',
    ai:    '🤖 AI suggests: Pre-order 120 units at current price before demand-driven price increase',
    time:  '3h ago',
  },
  {
    id: 9, type: 'info', icon: '📊',
    title: 'Reorder Point Reached: iPad Mini',
    desc:  '9 units remaining (threshold: 8). Forecast predicts 20 units needed in 7 days.',
    ai:    '🤖 AI suggests: Schedule reorder of 25 units — supplier lead time is 4 days',
    time:  '4h ago',
  },
  {
    id: 10, type: 'info', icon: '📈',
    title: 'Price Optimization Opportunity: AirPods Pro',
    desc:  'Competitor pricing analysis shows room to increase price by $20 with no demand impact.',
    ai:    '🤖 AI suggests: Increase price from $249 to $269 — estimated +$420/month revenue',
    time:  '6h ago',
  },
];

let visibleAlerts = [...ALERTS_DATA];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderAlerts();
  bindAlertFilters();
});

/* ================================================
   RENDER
================================================ */
function renderAlerts() {
  // Update summary counts
  const critical = visibleAlerts.filter(a => a.type === 'critical').length;
  const warning  = visibleAlerts.filter(a => a.type === 'warning').length;
  const info     = visibleAlerts.filter(a => a.type === 'info').length;

  updateCount('countCritical', critical);
  updateCount('countWarning',  warning);
  updateCount('countInfo',     info);
  updateCount('countTotal',    visibleAlerts.length);

  const list = document.getElementById('alertsList');
  if (!list) return;

  if (visibleAlerts.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
        <div style="font-size:40px;margin-bottom:14px">✅</div>
        <div style="font-size:16px;font-weight:600;color:var(--text-secondary)">All clear — no active alerts</div>
        <div style="font-size:13px;margin-top:6px">AI is continuously monitoring your inventory</div>
      </div>`;
    return;
  }

  list.innerHTML = visibleAlerts.map((a, idx) => `
    <div class="alert-item ${a.type}" style="animation-delay:${idx * 0.05}s">
      <div class="alert-icon-wrap">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-ai-chip">${a.ai}</div>
      </div>
      <div class="alert-meta">
        <span class="alert-time">${a.time}</span>
        <button class="alert-dismiss" onclick="dismissAlert(${a.id})" title="Dismiss">✕</button>
      </div>
    </div>`).join('');
}

function updateCount(id, n) {
  const el = document.getElementById(id);
  if (el) el.textContent = n;
}

/* ================================================
   FILTER
================================================ */
function bindAlertFilters() {
  document.querySelectorAll('[data-alert-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-alert-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.alertFilter;
      visibleAlerts = filter === 'all' ? [...ALERTS_DATA] : ALERTS_DATA.filter(a => a.type === filter);
      renderAlerts();
    });
  });
}

/* ================================================
   DISMISS / CLEAR
================================================ */
window.dismissAlert = function(id) {
  visibleAlerts = visibleAlerts.filter(a => a.id !== id);
  renderAlerts();
  Toast.show('Alert dismissed', 'info');
};

window.clearAllAlerts = function() {
  visibleAlerts = [];
  renderAlerts();
  Toast.show('All alerts cleared', 'info');
};
