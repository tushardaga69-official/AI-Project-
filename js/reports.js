/* ================================================
   NEXSTOCK AI — REPORTS
   js/reports.js
================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  buildReportsChart();
  buildCategoryReportChart();
});

/* ================================================
   CHARTS
================================================ */
function buildReportsChart() {
  const ctx = document.getElementById('reportsBarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Actual Revenue ($K)',
          data: [28,32,29,41,38,52,47,58,51,62,58,71],
          backgroundColor: 'rgba(64,220,255,0.22)',
          borderColor: '#40dcff',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'AI Forecast ($K)',
          data: [30,35,31,43,40,54,50,60,54,65,62,75],
          backgroundColor: 'rgba(139,92,246,0.18)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          borderRadius: 6,
          borderDash: [4, 2],
        },
      ],
    },
    options: chartDefaults(),
  });
}

function buildCategoryReportChart() {
  const ctx = document.getElementById('categoryReportChart');
  if (!ctx) return;

  const breakdown = NexDB.getCategoryBreakdown();
  const cats   = Object.keys(breakdown);
  const vals   = cats.map(c => Math.round(breakdown[c] / 1000));
  const colors = cats.map(c => NexDB.getCategoryColor(c));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cats,
      datasets: [{
        label: 'Inventory Value ($K)',
        data: vals,
        backgroundColor: colors.map(c => c + '40'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: {
      ...chartDefaults(),
      plugins: { ...chartDefaults().plugins, legend: { display: false } },
      indexAxis: 'y',
    },
  });
}

/* ================================================
   DOWNLOAD — CSV
================================================ */
window.downloadCSV = function(type) {
  const products = NexDB.getProducts();
  let rows, headers;

  if (type === 'inventory') {
    headers = ['ID','Name','Category','Quantity','Price','Status','Threshold'];
    rows    = products.map(p => [
      p.id, p.name, p.category, p.quantity,
      p.price, NexDB.getStatus(p), p.threshold,
    ]);
  } else if (type === 'sales') {
    headers = ['Month','Actual ($K)','Forecast ($K)','Variance ($K)'];
    const actual   = [28,32,29,41,38,52,47,58,51,62,58,71];
    const forecast = [30,35,31,43,40,54,50,60,54,65,62,75];
    const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    rows = months.map((m, i) => [m, actual[i], forecast[i], (actual[i] - forecast[i]).toFixed(1)]);
  } else {
    headers = ['Product','Predicted 7d','Predicted 30d','Confidence'];
    rows    = products.slice(0, 10).map(p => [
      p.name,
      NexDB.getForecastUnits(p),
      NexDB.getForecastUnits(p) * 4,
      (88 + Math.random() * 10).toFixed(1) + '%',
    ]);
  }

  const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `nexstock-${type}-report-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  Toast.show(`📊 ${capitalize(type)} CSV report downloaded`, 'success');
};

/* ================================================
   DOWNLOAD — PDF
================================================ */
window.downloadPDF = function(type) {
  // Use jsPDF if available
  if (!window.jspdf) {
    // Fallback: open print dialog with a summary page
    Toast.show(`📄 Opening print dialog for ${type} report…`, 'info');
    window.print();
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const products = NexDB.getProducts();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(64, 220, 255);
    doc.text('NexStock AI', 20, 22);
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.text(capitalize(type) + ' Report', 20, 32);
    doc.setFontSize(9);
    doc.setTextColor(100, 110, 140);
    doc.text('Generated: ' + new Date().toLocaleString(), 20, 40);
    doc.text('Total Products: ' + products.length, 20, 46);

    // Line
    doc.setDrawColor(64, 220, 255);
    doc.setLineWidth(0.3);
    doc.line(20, 50, 190, 50);

    let y = 58;

    if (type === 'inventory') {
      doc.setFontSize(10);
      doc.setTextColor(60, 70, 100);
      const cols = ['Name', 'Category', 'Qty', 'Price', 'Status'];
      const colX = [20, 75, 115, 135, 158];
      cols.forEach((c, i) => doc.text(c, colX[i], y));
      y += 6;
      doc.setDrawColor(50, 60, 90);
      doc.line(20, y, 190, y);
      y += 5;

      doc.setFontSize(9);
      doc.setTextColor(80, 90, 120);
      products.slice(0, 22).forEach(p => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(p.name.substring(0,20), colX[0], y);
        doc.text(p.category,            colX[1], y);
        doc.text(String(p.quantity),    colX[2], y);
        doc.text('$' + p.price,         colX[3], y);
        doc.text(NexDB.getStatus(p),    colX[4], y);
        y += 6;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(80, 90, 120);
      const lines = [
        'Summary Statistics',
        `Total SKUs: ${products.length}`,
        `Low Stock Items: ${products.filter(p=>NexDB.getStatus(p)==='Low Stock').length}`,
        `Overstock Items: ${products.filter(p=>NexDB.getStatus(p)==='Overstock').length}`,
        `Total Inventory Value: ${Fmt.currencyK(Math.round(products.reduce((s,p)=>s+p.quantity*p.price,0)))}`,
        '',
        `AI Forecast Accuracy: 94.2%`,
        `Forecast Range: 7 / 14 / 30 day models active`,
        `Last Model Training: ${new Date(Date.now()-86400000).toLocaleDateString()}`,
      ];
      lines.forEach(line => { doc.text(line, 20, y); y += 8; });
    }

    doc.save(`nexstock-${type}-report-${new Date().toISOString().slice(0,10)}.pdf`);
    Toast.show(`📄 ${capitalize(type)} PDF report downloaded`, 'success');
  } catch(e) {
    console.error(e);
    Toast.show('PDF generation failed — try CSV instead', 'error');
  }
};

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
