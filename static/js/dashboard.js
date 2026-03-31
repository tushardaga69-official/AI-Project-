let trendChart, pieChart, barChart;
let apiDataCache = null;

function getThemeColors() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const isMidnight = document.documentElement.getAttribute("data-theme") === "midnight";
    const isOcean = document.documentElement.getAttribute("data-theme") === "ocean";
    const isCyberpunk = document.documentElement.getAttribute("data-theme") === "cyberpunk";
    const isWarmLight = document.documentElement.getAttribute("data-theme") === "warm-light";
    const isCloud = document.documentElement.getAttribute("data-theme") === "cloud";
    const isMint = document.documentElement.getAttribute("data-theme") === "mint";
    
    // Light Defaults
    let colors = {
        grid: 'rgba(0,0,0,0.05)', text: '#6b7280', bg: '#ffffff', line: '#2563eb',
        fill: 'rgba(37,99,235,0.1)', pieColors: ['#f43f5e', '#3b82f6', '#f59e0b']
    };
    
    if (isCyberpunk) {
        colors = {
            grid: 'rgba(255, 0, 85, 0.2)', text: '#f0c8ff', bg: '#1f0840', line: '#00ffcc',
            fill: 'rgba(0, 255, 204, 0.15)', pieColors: ['#ff0055', '#00ffcc', '#ffaa00']
        };
    } else if (isOcean) {
        colors = {
            grid: 'rgba(255, 255, 255, 0.05)', text: '#a5f3fc', bg: '#0e3d51', line: '#22d3ee',
            fill: 'rgba(34, 211, 238, 0.15)', pieColors: ['#fda4af', '#22d3ee', '#6ee7b7']
        };
    } else if (isMidnight) {
        colors = {
            grid: 'rgba(255, 255, 255, 0.05)', text: '#8b9bb4', bg: '#131722', line: '#38bdf8',
            fill: 'rgba(56, 189, 248, 0.15)', pieColors: ['#f43f5e', '#6366f1', '#10b981']
        };
    } else if (isDark) {
        colors = {
            grid: 'rgba(255, 255, 255, 0.05)', text: '#a1a1aa', bg: '#000000', line: '#3b82f6',
            fill: 'rgba(59, 130, 246, 0.1)', pieColors: ['#f87171', '#60a5fa', '#34d399']
        };
    } else if (isWarmLight) {
        colors = {
            grid: 'rgba(0,0,0,0.05)', text: '#7f7461', bg: '#f3f0e8', line: '#d97757',
            fill: 'rgba(217, 119, 87, 0.1)', pieColors: ['#fb7185', '#d97757', '#a3e635']
        };
    } else if (isCloud) {
        colors = {
            grid: 'rgba(0,0,0,0.05)', text: '#64748b', bg: '#f1f5f9', line: '#0ea5e9',
            fill: 'rgba(14, 165, 233, 0.1)', pieColors: ['#f43f5e', '#0ea5e9', '#10b981']
        };
    } else if (isMint) {
        colors = {
            grid: 'rgba(0,0,0,0.05)', text: '#166534', bg: '#e6f9ed', line: '#059669',
            fill: 'rgba(5, 150, 105, 0.1)', pieColors: ['#fb7185', '#10b981', '#60a5fa']
        };
    }
    
    return colors;
}

async function fetchStatsAndDraw() {
    try {
        const res = await fetch("/api/dashboard-stats");
        const data = await res.json();
        
        if (!data.has_data) {
            document.getElementById("charts-container").style.display = "none";
            document.getElementById("no-data-msg").style.display = "block";
            return;
        }

        document.getElementById("charts-container").style.display = "grid";
        document.getElementById("no-data-msg").style.display = "none";
        
        drawCharts(data);
    } catch (e) {
        console.error("Dashboard Stats Error:", e);
    }
}

function drawCharts(data) {
    if (data) apiDataCache = data;
    else data = apiDataCache;
    if (!data) return;

    const colors = getThemeColors();

    const commonOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: colors.text, font: {family: "'Inter', sans-serif"} } },
            tooltip: { backgroundColor: colors.bg, titleColor: colors.text, bodyColor: colors.line, borderColor: colors.grid, borderWidth: 1 }
        }
    };

    // 1. Trend Line Chart
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(document.getElementById("trendChart").getContext("2d"), {
        type: 'line',
        data: {
            labels: data.trend.labels,
            datasets: [{
                label: "Forecast Volume", data: data.trend.data,
                borderColor: colors.line, backgroundColor: colors.fill,
                fill: true, tension: 0.1, pointBackgroundColor: colors.bg, pointBorderColor: colors.line,
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                x: { grid: { display: false }, ticks: { color: colors.text } },
                y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
            }
        }
    });

    // 2. Risk Distribution Pie
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(document.getElementById("pieChart").getContext("2d"), {
        type: 'doughnut',
        data: {
            labels: data.pie.labels,
            datasets: [{ data: data.pie.data, backgroundColor: colors.pieColors, borderWidth: 0, hoverOffset: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: colors.text, padding: 15 } },
                tooltip: { backgroundColor: colors.bg, titleColor: colors.text, bodyColor: '#fff', borderColor: colors.grid, borderWidth: 1 }
            }
        }
    });

    // 3. Volume Histogram Bar
    if (barChart) barChart.destroy();
    barChart = new Chart(document.getElementById("barChart").getContext("2d"), {
        type: 'bar',
        data: {
            labels: data.histogram.labels,
            datasets: [{
                label: "Forecast Frequency", data: data.histogram.data,
                backgroundColor: colors.line, borderRadius: 4
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                x: { grid: { display: false }, ticks: { color: colors.text } },
                y: { grid: { color: colors.grid }, ticks: { color: colors.text, stepSize: 1 } }
            }
        }
    });
}

function updateChartTheme() {
    drawCharts();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchStatsAndDraw();
});