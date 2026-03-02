// ===================================
// 1Apportunity – Main JavaScript
// Vanilla ES6+ — no dependencies
// ===================================

// ===================================
// Mock Data
// ===================================
const mockReviews = [
  { id: 1, name: "Sarah Johnson", rating: 5, text: "1Apportunity has completely changed how I earn extra income! The tasks are simple, and the payouts are always on time. I've earned over ₹500 in just two months!", date: "2024-01-15", initials: "SJ", color: "#3b82f6" },
  { id: 2, name: "Michael Chen", rating: 5, text: "As a student, this platform has been a lifesaver. I can complete tasks during my free time and earn real money. The interface is super user-friendly!", date: "2024-01-10", initials: "MC", color: "#a855f7" },
  { id: 3, name: "Emily Rodriguez", rating: 4, text: "Great platform for passive income. I love that I can complete tasks from my phone anywhere. Would definitely recommend to anyone looking to earn extra cash!", date: "2024-01-05", initials: "ER", color: "#10b981" },
  { id: 4, name: "David Thompson", rating: 5, text: "The best part about 1Apportunity is the transparency. You always know exactly how much you'll earn for each task. Couldn't be happier!", date: "2023-12-28", initials: "DT", color: "#f59e0b" },
  { id: 5, name: "Lisa Martinez", rating: 5, text: "Simple, reliable, and actually pays! I was skeptical at first, but after my first cashout, I was convinced. This is the real deal. Highly recommended!", date: "2023-12-20", initials: "LM", color: "#ef4444" }
];

// ===================================
// Counter Animation (Stats Strip)
// ===================================
function animateCounter(element, target, prefix = '', suffix = '+') {
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  const stepDuration = duration / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = prefix + target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }
  }, stepDuration);
}

function initializeStats() {
  const stripValues = document.querySelectorAll('.strip-value[data-target]');
  if (!stripValues.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        animateCounter(el, target, prefix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  stripValues.forEach(v => observer.observe(v));
}

// ===================================
// Reviews
// ===================================
function renderReviews(reviews = mockReviews) {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  reviews.forEach(r => grid.appendChild(createReviewCard(r)));
}

function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const date = new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  card.innerHTML = `
    <div class="review-header">
      <div class="review-avatar" style="background:${review.color}">${review.initials}</div>
      <div class="review-info">
        <div class="review-name">${review.name}</div>
        <div class="review-meta">${date}</div>
      </div>
    </div>
    <div class="review-stars">${stars}</div>
    <p class="review-text">"${review.text}"</p>
  `;
  return card;
}

// ===================================
// Navbar – Scroll Shadow & Mobile Toggle
// ===================================
function initializeNavbar() {
  const nav = document.querySelector('.main-navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('primaryNav');
  if (!nav) return;

  // Shadow on scroll
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const opening = !links.classList.contains('open');
      links.classList.toggle('open', opening);
      toggle.classList.toggle('open', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      document.body.style.overflow = opening ? 'hidden' : '';
    });

    // Close when a link is clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Nav dropdowns: hover on desktop, click-toggle on mobile
  const isMobile = () => window.innerWidth <= 1024;
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      if (isMobile()) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        // close all others
        document.querySelectorAll('.nav-dropdown.open').forEach(d => {
          d.classList.remove('open');
        });
        if (!isOpen) {
          dropdown.classList.add('open');
        }
      }
      // on desktop, let the <a> navigate normally
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
}

// ===================================
// Scroll Reveal Animations
// ===================================
function initializeScrollAnimations() {
  const selectors = [
    '.feature-card', '.explore-card', '.ways-card', '.benefit-row',
    '.step-item', '.feature-pill', '.highlight-card', '.contact-item',
    '.review-card', '.featured-testimonial', '.cta-card',
    '.wtwd-card', '.hero-overview-panel', '.platform-card', '.organic-diff-banner'
  ];
  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ===================================
// Smooth Scroll for # links
// ===================================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ===================================
// Helpers
// ===================================
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

// ===================================
// Stats Charts (Chart.js)
// ===================================
function initializeStatCharts() {
  if (typeof Chart === 'undefined') return;

  // Shared: no legend, no tooltip title, transparent bg
  Chart.defaults.font.family = "'Inter', sans-serif";

  // ── Chart 1: Registered Users – Bar chart ──
  const usersCtx = document.getElementById('chart-users');
  if (usersCtx) {
    new Chart(usersCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [1850, 3480, 3120, 1310, 2150, 2850],
          backgroundColor: [
            'rgba(15,23,42,.55)',
            'rgba(15,23,42,.7)',
            'rgba(15,23,42,.65)',
            'rgba(15,23,42,.45)',
            'rgba(15,23,42,.6)',
            'rgba(194,240,226,.9)'
          ],
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: .7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,.8)',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ctx.parsed.y.toLocaleString() + ' users'
            }
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255,255,255,.55)', font: { size: 10, weight: '500' } },
            border: { display: false }
          },
          y: {
            display: false,
            beginAtZero: true
          }
        },
        animation: { duration: 1200, easing: 'easeOutQuart' }
      },
      plugins: [{
        id: 'barTopLabels',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          chart.getDatasetMeta(0).data.forEach((bar, i) => {
            const val = chart.data.datasets[0].data[i];
            const pct = Math.round((val / 3500) * 100);
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,.9)';
            ctx.font = "600 10px 'Inter', sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText(pct + '%', bar.x, bar.y - 6);
            ctx.restore();
          });
        }
      }]
    });
  }

  // ── Chart 2: Tasks Completed – Curved dashed line with 2024 highlight bar ──
  const tasksCtx = document.getElementById('chart-tasks');
  if (tasksCtx) {
    new Chart(tasksCtx, {
      type: 'line',
      data: {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        datasets: [{
          data: [18, 42, 30, 52, 48],
          borderColor: 'rgba(255,255,255,.55)',
          borderWidth: 2.5,
          borderDash: [7, 5],
          pointBackgroundColor: ['transparent','transparent','#fff','transparent','transparent'],
          pointBorderColor: ['transparent','transparent','rgba(255,255,255,.9)','transparent','transparent'],
          pointBorderWidth: [0, 0, 2.5, 0, 0],
          pointRadius: [0, 0, 7, 0, 0],
          pointHoverRadius: [0, 0, 9, 0, 0],
          pointStyle: ['circle','circle','circle','circle','circle'],
          fill: false,
          tension: .4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        clip: false,
        layout: { padding: { bottom: 36 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,.8)',
            padding: 10,
            cornerRadius: 8,
            filter: (item) => item.dataIndex === 2,
            callbacks: {
              label: ctx => ctx.parsed.y.toLocaleString() + '% growth'
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: (ctx) => ctx.tick && ctx.tick.label === '2024' ? 'transparent' : 'rgba(255,255,255,.5)',
              font: { size: 11, weight: '400' },
              padding: 8,
            },
            border: { display: false }
          },
          y: { display: false, min: 0, max: 65 }
        },
        animation: { duration: 1400, easing: 'easeOutQuart' }
      },
      plugins: [{
        id: 'highlightBar2024',
        beforeDatasetsDraw(chart) {
          const { ctx, chartArea, scales: { x } } = chart;
          const idx = 2; // 2024
          const xPos = x.getPixelForTick(idx);
          const pointMeta = chart.getDatasetMeta(0).data[idx];
          const barWidth = 32;
          const barTop = pointMeta.y;
          const barBottom = chartArea.bottom + 32;

          const grad = ctx.createLinearGradient(0, barTop, 0, barBottom);
          grad.addColorStop(0, 'rgba(20, 18, 12, .92)');
          grad.addColorStop(0.25, 'rgba(45, 38, 15, .78)');
          grad.addColorStop(0.5, 'rgba(85, 70, 20, .55)');
          grad.addColorStop(0.75, 'rgba(160, 130, 30, .35)');
          grad.addColorStop(1, 'rgba(210, 175, 50, .15)');

          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,.25)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;

          ctx.beginPath();
          ctx.roundRect(
            xPos - barWidth / 2,
            barTop,
            barWidth,
            barBottom - barTop,
            [5, 5, 0, 0]
          );
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        }
      }, {
        id: 'highlightLabel2024',
        afterDraw(chart) {
          const xAxis = chart.scales.x;
          const { ctx, chartArea } = chart;
          const idx = 2;
          const xPos = xAxis.getPixelForTick(idx);
          const yPos = chartArea.bottom + 18;

          ctx.save();
          ctx.fillStyle = 'rgba(10, 10, 8, .88)';
          ctx.beginPath();
          ctx.roundRect(xPos - 24, yPos - 11, 48, 22, 5);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.font = "700 11px 'Inter', sans-serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('2024', xPos, yPos);
          ctx.restore();
        }
      }]
    });
  }

  // ── Chart 3: Total Payouts – Area chart ──
  const payCtx = document.getElementById('chart-payouts');
  if (payCtx) {
    const gradient = payCtx.getContext('2d').createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, 'rgba(30,41,59,.6)');
    gradient.addColorStop(1, 'rgba(30,41,59,.05)');

    new Chart(payCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          data: [8500, 18200, 32400, 51800, 72300, 95600, 112000, 127845],
          borderColor: '#1e293b',
          borderWidth: 2.5,
          pointBackgroundColor: '#1e293b',
          pointBorderColor: '#d1d5db',
          pointBorderWidth: 2,
          pointRadius: [0, 0, 0, 0, 0, 0, 0, 5],
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: gradient,
          tension: .4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,.85)',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => '₹' + ctx.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(55,65,81,.65)', font: { size: 10, weight: '500' } },
            border: { display: false }
          },
          y: {
            display: false,
            beginAtZero: true
          }
        },
        animation: { duration: 1600, easing: 'easeOutQuart' }
      }
    });
  }
}

// ===================================
// Stat Card Expand/Collapse + Detail Charts
// ===================================
const detailChartInstances = {};

function initializeCardToggles() {
  document.querySelectorAll('.stat-card-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.stat-card');
      const detailId = btn.dataset.detail;
      const detailPanel = document.getElementById(detailId);
      const isExpanding = !card.classList.contains('expanded');

      // Collapse any other expanded card first
      document.querySelectorAll('.stat-card.expanded').forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
          // Reset drill-down state for collapsed card
          const otherId = c.querySelector('.stat-card-detail')?.id;
          if (otherId && window._drilldownResets && window._drilldownResets[otherId]) {
            window._drilldownResets[otherId]();
          }
        }
      });

      card.classList.toggle('expanded', isExpanding);

      // If collapsing, reset drill-down to yearly view
      if (!isExpanding && detailId && window._drilldownResets && window._drilldownResets[detailId]) {
        window._drilldownResets[detailId]();
      }

      if (isExpanding && detailPanel) {
        const onTransitionEnd = (e) => {
          if (e.propertyName === 'max-height') {
            detailPanel.removeEventListener('transitionend', onTransitionEnd);

            if (!detailChartInstances[detailId]) {
              // First expand: create the chart
              renderDetailChart(detailId);
            } else {
              // Re-expand: force Chart.js to recalculate layout & hit areas
              detailChartInstances[detailId].resize();
            }
          }
        };
        detailPanel.addEventListener('transitionend', onTransitionEnd);
      }
    });
  });
}

function renderDetailChart(detailId) {
  if (typeof Chart === 'undefined') return;

  const canvasId = 'detail-chart-' + detailId.replace('detail-', '');
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const chartKey = detailId;
  const cardType = detailId.replace('detail-', '');

  /* ═══════════════════════════════════════════════════════
     DRILL-DOWN DATA STORE
     ═══════════════════════════════════════════════════════ */
  const drillData = {
    users: {
      yearly: {
        labels: ['2022','2023','2024','2025','2026'],
        data:   [2800, 5400, 12500, 28000, 48392],
        title:  'User Signups — Yearly Overview'
      },
      monthly: {
        '2022': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[120,150,180,210,250,280,260,290,310,280,320,350], title:'User Signups — 2022 Monthly' },
        '2023': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[320,380,410,450,480,520,490,530,560,510,570,580], title:'User Signups — 2023 Monthly' },
        '2024': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[620,890,1150,1320,1480,1210,980,1050,1150,1080,1250,1320], title:'User Signups — 2024 Monthly' },
        '2025': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[1850,2180,2490,2780,3120,2950,2650,2800,3050,2900,3200,3480], title:'User Signups — 2025 Monthly' },
        '2026': { labels:['Jan','Feb'], data:[3480,3650], title:'User Signups — 2026 Monthly' }
      }
    },
    tasks: {
      yearly: {
        labels: ['2022','2023','2024','2025','2026'],
        data:   [5200, 12400, 28800, 38900, 48392],
        title:  'Tasks Completed — Yearly Overview'
      },
      monthly: {
        '2022': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[280,320,380,420,460,510,450,490,520,480,530,560], title:'Tasks Completed — 2022 Monthly' },
        '2023': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[680,780,920,1050,1180,1280,1120,1200,1350,1250,1380,1450], title:'Tasks Completed — 2023 Monthly' },
        '2024': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[1680,1920,2250,2480,2750,3020,2680,2850,3100,2950,3200,3420], title:'Tasks Completed — 2024 Monthly' },
        '2025': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[2850,3100,3380,3520,3750,3920,3450,3600,3850,3700,3980,4200], title:'Tasks Completed — 2025 Monthly' },
        '2026': { labels:['Jan','Feb'], data:[4100,4350], title:'Tasks Completed — 2026 Monthly' }
      }
    },
    payouts: {
      yearly: {
        labels: ['2022','2023','2024','2025','2026'],
        data:   [18500, 42000, 95600, 167000, 208400],
        title:  'Payouts — Yearly Overview'
      },
      monthly: {
        '2022': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[800,950,1200,1450,1680,1850,1620,1750,1900,1780,1950,2100], title:'Payouts — 2022 Monthly' },
        '2023': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[2250,2600,3100,3500,3850,4200,3700,3950,4300,4050,4400,4700], title:'Payouts — 2023 Monthly' },
        '2024': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[5200,6100,7400,8500,9200,10100,8800,9500,10400,9800,10600,11200], title:'Payouts — 2024 Monthly' },
        '2025': { labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], data:[11800,13200,14500,15800,16900,18100,16200,17300,18500,17800,19200,20500], title:'Payouts — 2025 Monthly' },
        '2026': { labels:['Jan','Feb'], data:[20800,22100], title:'Payouts — 2026 Monthly' }
      }
    }
  };

  // Generate weekly breakdown from a monthly total
  function genWeekly(monthTotal, weeks) {
    const parts = [];
    let remaining = monthTotal;
    for (let i = 0; i < weeks; i++) {
      if (i === weeks - 1) { parts.push(remaining); }
      else {
        const v = Math.round(remaining * (0.2 + Math.random() * 0.15));
        parts.push(v);
        remaining -= v;
      }
    }
    return parts;
  }

  /* ═══════════════════════════════════════════════════════
     DRILL-DOWN STATE
     ═══════════════════════════════════════════════════════ */
  const state = { level: 'yearly', year: null, month: null };
  const store = drillData[cardType];
  const isLight = (cardType === 'payouts');
  const titleEl  = document.getElementById('detail-title-' + cardType);
  const breadEl  = document.getElementById('breadcrumb-' + cardType);

  // ── Breadcrumb ──
  function updateBreadcrumb() {
    let html = '<button class="breadcrumb-btn' + (state.level === 'yearly' ? ' active' : '') + '" data-level="yearly">All Years</button>';
    if (state.year) {
      html += '<span class="breadcrumb-sep">\u203A</span>';
      html += '<button class="breadcrumb-btn' + (state.level === 'monthly' ? ' active' : '') + '" data-level="monthly">' + state.year + '</button>';
    }
    if (state.month) {
      html += '<span class="breadcrumb-sep">\u203A</span>';
      html += '<span class="breadcrumb-btn active">' + state.month + '</span>';
    }
    breadEl.innerHTML = html;

    breadEl.querySelectorAll('.breadcrumb-btn[data-level]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = btn.dataset.level;
        if (target === 'yearly' && state.level !== 'yearly') {
          state.level = 'yearly'; state.year = null; state.month = null;
          refreshChart();
        } else if (target === 'monthly' && state.level === 'weekly') {
          state.level = 'monthly'; state.month = null;
          refreshChart();
        }
      });
    });
  }

  // ── Data for current level ──
  function getChartData() {
    if (state.level === 'yearly') {
      return { labels: store.yearly.labels, data: store.yearly.data, title: store.yearly.title };
    }
    if (state.level === 'monthly') {
      var m = store.monthly[state.year];
      return { labels: m.labels, data: m.data, title: m.title };
    }
    // weekly
    var mData  = store.monthly[state.year];
    var mIdx   = mData.labels.indexOf(state.month);
    var mTotal = mData.data[mIdx];
    var weeks  = (state.month === 'May' || state.month === 'Dec') ? 5 : 4;
    var wLabels = [];
    for (var w = 1; w <= weeks; w++) wLabels.push('W' + w);
    var wData   = genWeekly(mTotal, weeks);
    var prefix  = cardType === 'users' ? 'User Signups' : cardType === 'tasks' ? 'Tasks Completed' : 'Payouts';
    return { labels: wLabels, data: wData, title: prefix + ' \u2014 ' + state.month + ' ' + state.year + ' Weekly' };
  }

  // ── Bar colors ──
  function barColors(count) {
    var out = [];
    for (var i = 0; i < count; i++) {
      if (isLight)
        out.push(i === count-1 ? 'rgba(30,41,59,.8)' : 'rgba(30,41,59,' + (.3 + (i/count)*.3).toFixed(2) + ')');
      else
        out.push(i === count-1 ? 'rgba(194,240,226,.9)' : 'rgba(15,23,42,' + (.4 + (i/count)*.3).toFixed(2) + ')');
    }
    return out;
  }

  // ── Build Chart.js config ──
  function buildConfig(d) {
    var txt    = isLight ? 'rgba(55,65,81,.7)' : 'rgba(255,255,255,.55)';
    var gridC  = isLight ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.06)';
    var hoverC = isLight ? 'rgba(30,41,59,.85)' : 'rgba(194,240,226,.95)';

    return {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: cardType === 'users' ? 'Signups' : cardType === 'tasks' ? 'Tasks' : 'Payout \u20B9',
          data: d.data,
          backgroundColor: barColors(d.data.length),
          hoverBackgroundColor: hoverC,
          borderRadius: 5,
          borderSkipped: false,
          barPercentage: d.labels.length <= 5 ? .5 : .6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: function(evt, elements) {
          if (!elements.length) return;
          var idx   = elements[0].index;
          var label = d.labels[idx];
          if (state.level === 'yearly' && store.monthly[label]) {
            state.level = 'monthly'; state.year = label; refreshChart();
          } else if (state.level === 'monthly') {
            state.level = 'weekly'; state.month = label; refreshChart();
          }
        },
        onHover: function(evt, elements) {
          var el = evt.native ? evt.native.target : evt.chart.canvas;
          el.style.cursor = (state.level !== 'weekly' && elements.length) ? 'pointer' : 'default';
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,.85)', padding: 10, cornerRadius: 8,
            callbacks: {
              label: function(c) {
                var v = c.parsed.y.toLocaleString();
                return cardType === 'payouts' ? '\u20B9' + v : v + (cardType === 'users' ? ' users' : ' tasks');
              },
              afterLabel: function() { return state.level !== 'weekly' ? '  Click to drill down \u2193' : ''; }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: txt, font: { size: d.labels.length > 8 ? 9 : 11, weight: '500' } },
            border: { display: false }
          },
          y: {
            grid: { color: gridC },
            ticks: {
              color: txt, font: { size: 10 },
              callback: function(v) {
                if (cardType === 'payouts') return '\u20B9' + (v >= 1000 ? Math.round(v/1000) + 'k' : v);
                return v >= 1000 ? (v/1000) + 'k' : v;
              }
            },
            border: { display: false }
          }
        },
        animation: { duration: 600, easing: 'easeOutQuart' }
      },
      plugins: [{
        id: 'barTopLabels_' + cardType,
        afterDatasetsDraw: function(chart) {
          if (state.level === 'weekly') return;
          var ctx2 = chart.ctx;
          ctx2.save();
          ctx2.fillStyle = isLight ? 'rgba(55,65,81,.55)' : 'rgba(255,255,255,.7)';
          ctx2.font = "600 9px 'Inter', sans-serif";
          ctx2.textAlign = 'center';
          chart.getDatasetMeta(0).data.forEach(function(bar, i) {
            var val = chart.data.datasets[0].data[i];
            var disp = val >= 1000 ? Math.round(val/100)/10 + 'k' : val;
            ctx2.fillText(disp, bar.x, bar.y - 5);
          });
          ctx2.restore();
        }
      }]
    };
  }

  // ── Update stats row ──
  function updateStatsRow(d) {
    var panel    = document.getElementById(detailId);
    var statsRow = panel ? panel.querySelector('.detail-stats-row') : null;
    if (!statsRow) return;

    var total     = d.data.reduce(function(a, b) { return a + b; }, 0);
    var avg       = Math.round(total / d.data.length);
    var peak      = Math.max.apply(null, d.data);
    var peakLabel = d.labels[d.data.indexOf(peak)];
    var pre       = cardType === 'payouts' ? '\u20B9' : '';
    var fmt       = function(v) { return pre + v.toLocaleString(); };
    var perName   = state.level === 'yearly' ? '/ Year' : state.level === 'monthly' ? '/ Month' : '/ Week';

    statsRow.innerHTML =
      '<div class="detail-stat"><span class="detail-stat-value">' + fmt(total) + '</span><span class="detail-stat-label">Total</span></div>' +
      '<div class="detail-stat"><span class="detail-stat-value">' + fmt(avg) + '</span><span class="detail-stat-label">Avg ' + perName + '</span></div>' +
      '<div class="detail-stat"><span class="detail-stat-value">' + fmt(peak) + '</span><span class="detail-stat-label">Peak (' + peakLabel + ')</span></div>';
  }

  // ── Refresh (update chart in place) ──
  function refreshChart() {
    var d = getChartData();
    if (titleEl) titleEl.textContent = d.title;
    updateBreadcrumb();
    updateStatsRow(d);

    var existing = detailChartInstances[chartKey];
    if (existing) {
      var cfg = buildConfig(d);
      existing.data    = cfg.data;
      existing.options = cfg.options;
      existing.config._config.plugins = cfg.plugins;
      existing.update('active');
    }
  }

  // Expose reset so card-collapse can call it
  if (!window._drilldownResets) window._drilldownResets = {};
  window._drilldownResets[detailId] = function() {
    state.level = 'yearly'; state.year = null; state.month = null;
    refreshChart();
  };

  /* ═══════════════════════════════════════════════════════
     INITIAL RENDER
     ═══════════════════════════════════════════════════════ */
  var initData = getChartData();
  if (titleEl) titleEl.textContent = initData.title;
  updateBreadcrumb();
  updateStatsRow(initData);

  detailChartInstances[chartKey] = new Chart(canvas, buildConfig(initData));
}

// ===================================
// Checkout Popup Modal — Single Column
// ===================================

var checkoutPopup = (function() {

  var platforms = {
    youtube:   { name: 'YouTube',   color: '#c4302b', accent: '#ff4444', gradient: 'linear-gradient(135deg, #c4302b, #ff0000)', icon: '▶' },
    instagram: { name: 'Instagram', color: '#E1306C', accent: '#fd1d1d', gradient: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', icon: '📸' },
    facebook:  { name: 'Facebook',  color: '#1877f2', accent: '#42a5f5', gradient: 'linear-gradient(135deg, #1877f2, #42a5f5)', icon: '👍' },
    amazon:    { name: 'Amazon',    color: '#ff9900', accent: '#ffb347', gradient: 'linear-gradient(135deg, #ff9900, #ffb347)', icon: '🛒' },
    google:    { name: 'Google',    color: '#4285f4', accent: '#34a853', gradient: 'linear-gradient(135deg, #4285f4, #34a853)', icon: '⭐' },
    imdb:      { name: 'IMDB',      color: '#f5c518', accent: '#e8b708', gradient: 'linear-gradient(135deg, #f5c518, #e8b708)', icon: '🎬' },
    twitter:   { name: 'Twitter-X', color: '#000',    accent: '#555',    gradient: 'linear-gradient(135deg, #272727, #555)', icon: '𝕏' }
  };

  var overlayEl = null;
  var currentData = {};

  // ---- Build modal HTML ----
  function buildModalHTML() {
    return '' +
    '<div class="cpop-overlay" id="cpopOverlay">' +
      '<div class="cpop-modal">' +
        '<button class="cpop-close" id="cpopClose" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +

        '<div class="cpop-body">' +
          // TITLE
          '<div class="cpop-header">' +
            '<div class="cpop-title">Highly Secured Checkout</div>' +
            '<div class="cpop-secure-badge">' +
              '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>' +
              'End-to-end encrypted &amp; secured' +
            '</div>' +
          '</div>' +

          // FORM
          '<div class="cpop-form">' +
            '<div class="cpop-input-group">' +
              '<div class="cpop-input-icon"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg></div>' +
              '<input class="cpop-input" type="text" placeholder="Full Name" id="cpopName">' +
            '</div>' +
            '<div class="cpop-form-row">' +
              '<div class="cpop-input-group">' +
                '<div class="cpop-phone-prefix"><span>🇮🇳</span> +91</div>' +
                '<input class="cpop-input" type="tel" placeholder="Phone number" id="cpopPhone">' +
              '</div>' +
              '<div class="cpop-input-group">' +
                '<div class="cpop-input-icon"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg></div>' +
                '<input class="cpop-input" type="email" placeholder="Email address" id="cpopEmail">' +
              '</div>' +
            '</div>' +
          '</div>' +

          // CHECKBOXES
          '<div class="cpop-checkboxes">' +
            '<label class="cpop-checkbox"><input type="checkbox"> Create an account?</label>' +
            '<label class="cpop-checkbox"><input type="checkbox"> GET GST Invoice</label>' +
            '<label class="cpop-checkbox"><input type="checkbox"> Have coupon?</label>' +
            '<label class="cpop-checkbox"><input type="checkbox"> Donate for charity</label>' +
          '</div>' +

          '<div class="cpop-divider"></div>' +

          // SERVICE & SUBTOTAL
          '<div class="cpop-summary-section">' +
            '<div class="cpop-section-label">Service &amp; Subtotal</div>' +
            '<div class="cpop-service-row">' +
              '<div class="cpop-service-info">' +
                '<div class="cpop-service-icon" id="cpopServiceIcon"></div>' +
                '<div class="cpop-service-detail">' +
                  '<div class="cpop-service-name" id="cpopServiceName"></div>' +
                  '<div class="cpop-service-meta" id="cpopServiceMeta"></div>' +
                '</div>' +
              '</div>' +
              '<div class="cpop-service-price" id="cpopSubtotal"></div>' +
            '</div>' +
          '</div>' +

          // TOTAL TO PAY
          '<div class="cpop-total-bar">' +
            '<span>Total to Pay</span>' +
            '<span class="cpop-total-amount" id="cpopTotal"></span>' +
          '</div>' +

          '<div class="cpop-divider"></div>' +

          // PAYMENT METHODS
          '<div class="cpop-pay-section">' +
            '<div class="cpop-section-label">Choose a payment method</div>' +
            '<div class="cpop-pay-tabs">' +
              '<button class="cpop-pay-tab selected" data-method="card">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' +
                'Card' +
              '</button>' +
              '<button class="cpop-pay-tab" data-method="qr">' +
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h2v2H3v-2zm0-4h2v2H3V7zm4 4h2v2H7v-2zm0-4h2v2H7V7zm-4-4h6v6H3V3zm2 4h2V5H5v2zm8-4h6v6h-6V3zm2 4h2V5h-2v2zM3 13h6v6H3v-6zm2 4h2v-2H5v2zm8 0h2v2h-2v-2zm0-4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm0-8h2v2h-2V9zm-4 0h2v2h-2V9zm-4 8h2v2h-2v-2z"/></svg>' +
                'QR Code' +
              '</button>' +
              '<button class="cpop-pay-tab" data-method="upi">' +
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' +
                'UPI' +
              '</button>' +
            '</div>' +

            // CARD PANEL
            '<div class="cpop-pay-panel" id="cpopPanelCard">' +
              '<div class="cpop-card-form">' +
                '<div class="cpop-input-group">' +
                  '<div class="cpop-input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>' +
                  '<input class="cpop-input" type="text" placeholder="Card Number" maxlength="19" id="cpopCardNum">' +
                '</div>' +
                '<div class="cpop-form-row">' +
                  '<div class="cpop-input-group">' +
                    '<input class="cpop-input" type="text" placeholder="MM / YY" maxlength="7" id="cpopCardExp">' +
                  '</div>' +
                  '<div class="cpop-input-group">' +
                    '<input class="cpop-input" type="text" placeholder="CVV" maxlength="4" id="cpopCardCvv">' +
                  '</div>' +
                '</div>' +
                '<div class="cpop-card-brands">' +
                  '<span>Visa</span><span>Mastercard</span><span>RuPay</span>' +
                '</div>' +
              '</div>' +
              '<button type="button" class="cpop-submit-btn" data-pay="card">' +
                'Pay <span class="cpop-btn-price" id="cpopBtnPriceCard"></span>' +
              '</button>' +
            '</div>' +

            // QR PANEL
            '<div class="cpop-pay-panel" id="cpopPanelQr" style="display:none">' +
              '<div class="cpop-qr-area">' +
                '<div class="cpop-qr-logos">' +
                  '<span class="cpop-qr-logo-g"><span style="color:#4285F4">G</span> <span style="color:#5f6368">Pay</span></span>' +
                  '<span class="cpop-qr-logo-p" style="color:#5F259F">PhonePe</span>' +
                '</div>' +
                '<div class="cpop-qr-box" id="cpopQrBox">' +
                  '<div class="cpop-qr-placeholder">' +
                    '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                      '<rect width="200" height="200" rx="12" fill="white"/>' +
                      '<g fill="#1a1a2e">' +
                        '<rect x="20" y="20" width="60" height="60" rx="4"/>' +
                        '<rect x="28" y="28" width="44" height="44" rx="2" fill="white"/>' +
                        '<rect x="36" y="36" width="28" height="28" rx="2" fill="#1a1a2e"/>' +
                        '<rect x="120" y="20" width="60" height="60" rx="4"/>' +
                        '<rect x="128" y="28" width="44" height="44" rx="2" fill="white"/>' +
                        '<rect x="136" y="36" width="28" height="28" rx="2" fill="#1a1a2e"/>' +
                        '<rect x="20" y="120" width="60" height="60" rx="4"/>' +
                        '<rect x="28" y="128" width="44" height="44" rx="2" fill="white"/>' +
                        '<rect x="36" y="136" width="28" height="28" rx="2" fill="#1a1a2e"/>' +
                        '<rect x="90" y="90" width="20" height="20" rx="2"/>' +
                        '<rect x="120" y="90" width="12" height="12" rx="1"/>' +
                        '<rect x="140" y="90" width="12" height="12" rx="1"/>' +
                        '<rect x="160" y="90" width="12" height="12" rx="1"/>' +
                        '<rect x="90" y="120" width="12" height="12" rx="1"/>' +
                        '<rect x="90" y="140" width="12" height="12" rx="1"/>' +
                        '<rect x="90" y="160" width="12" height="12" rx="1"/>' +
                        '<rect x="120" y="120" width="20" height="20" rx="2"/>' +
                        '<rect x="150" y="120" width="12" height="12" rx="1"/>' +
                        '<rect x="120" y="150" width="12" height="12" rx="1"/>' +
                        '<rect x="150" y="150" width="30" height="30" rx="2"/>' +
                        '<rect x="158" y="158" width="14" height="14" rx="1" fill="white"/>' +
                      '</g>' +
                    '</svg>' +
                  '</div>' +
                '</div>' +
                '<div class="cpop-qr-amount">Amount: <strong id="cpopQrAmount"></strong></div>' +
                '<div class="cpop-qr-hint">Scan with any UPI app to pay</div>' +
              '</div>' +
              '<button type="button" class="cpop-submit-btn" data-pay="qr">' +
                'I\'ve completed the payment' +
              '</button>' +
            '</div>' +

            // UPI PANEL
            '<div class="cpop-pay-panel" id="cpopPanelUpi" style="display:none">' +
              '<div class="cpop-upi-form">' +
                '<div class="cpop-input-group cpop-upi-input-wrap">' +
                  '<div class="cpop-input-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>' +
                  '<input class="cpop-input" type="text" placeholder="Enter your UPI ID (e.g. name@upi)" id="cpopUpiId">' +
                '</div>' +
                '<div class="cpop-upi-hint">We\'ll send a collect request to your UPI ID for ₹<span id="cpopUpiAmount"></span></div>' +
              '</div>' +
              '<button type="button" class="cpop-submit-btn" data-pay="upi">' +
                'Proceed to Pay <span class="cpop-btn-price" id="cpopBtnPriceUpi"></span>' +
              '</button>' +
            '</div>' +

          '</div>' +

          // SECURED FOOTER
          '<div class="cpop-secured-footer">' +
            '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.68.056-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' +
            '256-bit SSL Encrypted &middot; PCI DSS Compliant' +
          '</div>' +

        '</div>' + // end cpop-body
      '</div>' + // end cpop-modal
    '</div>' + // end cpop-overlay

    // SUCCESS CELEBRATION OVERLAY
    '<div class="cpop-success-overlay" id="cpopSuccessOverlay">' +
      '<div class="cpop-success-card">' +
        '<div class="cpop-success-confetti" id="cpopConfetti"></div>' +
        '<div class="cpop-success-icon">' +
          '<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" stroke-width="2"/><path fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="cpop-success-check"/></svg>' +
        '</div>' +
        '<div class="cpop-success-title">Payment Successful!</div>' +
        '<div class="cpop-success-subtitle">Your Organic Campaign Has Started 🚀</div>' +
        '<div class="cpop-success-details">' +
          '<div class="cpop-success-row"><span>Order ID</span><span id="cpopSuccessOrder"></span></div>' +
          '<div class="cpop-success-row"><span>Service</span><span id="cpopSuccessService"></span></div>' +
          '<div class="cpop-success-row"><span>Amount Paid</span><span id="cpopSuccessAmount"></span></div>' +
        '</div>' +
        '<div class="cpop-success-msg">' +
          '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>' +
          'Campaign tracking details have been sent to your email' +
        '</div>' +
        '<div class="cpop-success-eta">' +
          '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>' +
          'Your campaign will begin delivering within a few hours' +
        '</div>' +
        '<button class="cpop-success-btn" id="cpopSuccessClose">Done</button>' +
      '</div>' +
    '</div>';
  }

  // ---- Inject into DOM ----
  function inject() {
    if (document.getElementById('cpopOverlay')) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildModalHTML();
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
    overlayEl = document.getElementById('cpopOverlay');
    bindEvents();
  }

  // ---- Event Bindings ----
  function bindEvents() {
    // Close
    document.getElementById('cpopClose').addEventListener('click', close);
    overlayEl.addEventListener('click', function(e) { if (e.target === overlayEl) close(); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (document.getElementById('cpopSuccessOverlay').classList.contains('open')) {
          closeSuccess();
        } else if (overlayEl.classList.contains('open')) {
          close();
        }
      }
    });

    // Payment tab switching
    overlayEl.querySelectorAll('.cpop-pay-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        overlayEl.querySelectorAll('.cpop-pay-tab').forEach(function(t) { t.classList.remove('selected'); });
        this.classList.add('selected');
        var method = this.getAttribute('data-method');
        document.getElementById('cpopPanelCard').style.display = method === 'card' ? '' : 'none';
        document.getElementById('cpopPanelQr').style.display = method === 'qr' ? '' : 'none';
        document.getElementById('cpopPanelUpi').style.display = method === 'upi' ? '' : 'none';
      });
    });

    // Card number formatting
    var cardInput = document.getElementById('cpopCardNum');
    cardInput.addEventListener('input', function() {
      var v = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = v.replace(/(.{4})/g, '$1 ').trim();
    });

    // Expiry formatting
    var expInput = document.getElementById('cpopCardExp');
    expInput.addEventListener('input', function() {
      var v = this.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
      this.value = v;
    });

    // All submit buttons
    overlayEl.querySelectorAll('.cpop-submit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { handleSubmit(this); });
    });

    // Success close
    document.getElementById('cpopSuccessClose').addEventListener('click', closeSuccess);
  }

  // ---- Submit Handler ----
  function handleSubmit(btn) {
    if (btn.classList.contains('processing')) return;

    // Validate form
    var name = document.getElementById('cpopName').value.trim();
    var email = document.getElementById('cpopEmail').value.trim();
    var phone = document.getElementById('cpopPhone').value.trim();

    if (!name || !email || !phone) {
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'cpopShake .4s ease';
      setTimeout(function() { btn.style.animation = ''; }, 500);
      [['cpopName', name], ['cpopEmail', email], ['cpopPhone', phone]].forEach(function(pair) {
        if (!pair[1]) {
          var g = document.getElementById(pair[0]).closest('.cpop-input-group');
          g.style.borderColor = '#ef4444';
          g.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
          setTimeout(function() { g.style.borderColor = ''; g.style.boxShadow = ''; }, 2000);
        }
      });
      return;
    }

    // Payment-specific validation
    var payType = btn.getAttribute('data-pay');
    if (payType === 'card') {
      var cardNum = document.getElementById('cpopCardNum').value.replace(/\s/g, '');
      var cardExp = document.getElementById('cpopCardExp').value;
      var cardCvv = document.getElementById('cpopCardCvv').value;
      if (cardNum.length < 12 || !cardExp || !cardCvv) {
        [['cpopCardNum', cardNum.length >= 12], ['cpopCardExp', !!cardExp], ['cpopCardCvv', !!cardCvv]].forEach(function(pair) {
          if (!pair[1]) {
            var g = document.getElementById(pair[0]).closest('.cpop-input-group');
            g.style.borderColor = '#ef4444';
            g.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
            setTimeout(function() { g.style.borderColor = ''; g.style.boxShadow = ''; }, 2000);
          }
        });
        return;
      }
    }
    if (payType === 'upi') {
      var upiId = document.getElementById('cpopUpiId').value.trim();
      if (!upiId || !upiId.includes('@')) {
        var upiG = document.getElementById('cpopUpiId').closest('.cpop-input-group');
        upiG.style.borderColor = '#ef4444';
        upiG.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
        setTimeout(function() { upiG.style.borderColor = ''; upiG.style.boxShadow = ''; }, 2000);
        return;
      }
    }

    // Processing state
    btn.classList.add('processing');
    var origHTML = btn.innerHTML;
    btn.innerHTML = '<div class="cpop-spinner"></div> Processing...';

    // Simulate payment delay
    setTimeout(function() {
      btn.classList.remove('processing');
      btn.innerHTML = origHTML;
      // Close checkout, show success
      close();
      showSuccess();
    }, 2000);
  }

  // ---- Show Success Celebration ----
  function showSuccess() {
    var p = platforms[currentData.platform] || platforms.youtube;
    var orderId = '1APP-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('cpopSuccessOrder').textContent = orderId;
    document.getElementById('cpopSuccessService').textContent = currentData.qty + ' ' + p.name + ' ' + currentData.unit;
    document.getElementById('cpopSuccessAmount').textContent = '₹' + currentData.price;

    var successOverlay = document.getElementById('cpopSuccessOverlay');
    successOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Spawn confetti
    spawnConfetti();
  }

  function closeSuccess() {
    var successOverlay = document.getElementById('cpopSuccessOverlay');
    successOverlay.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('cpopConfetti').innerHTML = '';
  }

  function spawnConfetti() {
    var container = document.getElementById('cpopConfetti');
    container.innerHTML = '';
    var colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#f368e0', '#ff9f43', '#22c55e'];
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.className = 'cpop-confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      var size = 6 + Math.random() * 6;
      piece.style.width = size + 'px';
      piece.style.height = size * (Math.random() > .5 ? 1 : 2.5) + 'px';
      piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      container.appendChild(piece);
    }
  }

  // ---- Open ----
  function open(data) {
    inject();
    currentData = data;
    var p = platforms[data.platform] || platforms.youtube;

    document.documentElement.style.setProperty('--co-accent', p.color);
    document.documentElement.style.setProperty('--co-accent-light', p.accent);
    document.documentElement.style.setProperty('--co-gradient', p.gradient);

    // Service info
    var iconEl = document.getElementById('cpopServiceIcon');
    iconEl.textContent = p.icon;
    iconEl.style.background = p.gradient;
    document.getElementById('cpopServiceName').textContent = data.qty + ' ' + p.name + ' ' + data.unit;
    document.getElementById('cpopServiceMeta').textContent = data.per || '';

    // Prices
    var priceStr = '₹' + data.price;
    document.getElementById('cpopSubtotal').textContent = priceStr;
    document.getElementById('cpopTotal').textContent = priceStr;
    document.getElementById('cpopBtnPriceCard').textContent = priceStr;
    document.getElementById('cpopBtnPriceUpi').textContent = priceStr;
    document.getElementById('cpopQrAmount').textContent = priceStr;
    document.getElementById('cpopUpiAmount').textContent = data.price;

    // Reset form
    ['cpopName', 'cpopEmail', 'cpopPhone', 'cpopCardNum', 'cpopCardExp', 'cpopCardCvv', 'cpopUpiId'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
    overlayEl.querySelectorAll('.cpop-checkbox input').forEach(function(cb) { cb.checked = false; });

    // Reset to card tab
    overlayEl.querySelectorAll('.cpop-pay-tab').forEach(function(t, i) { t.classList.toggle('selected', i === 0); });
    document.getElementById('cpopPanelCard').style.display = '';
    document.getElementById('cpopPanelQr').style.display = 'none';
    document.getElementById('cpopPanelUpi').style.display = 'none';

    // Reset processing state
    overlayEl.querySelectorAll('.cpop-submit-btn').forEach(function(btn) { btn.classList.remove('processing'); });

    overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ---- Close ----
  function close() {
    if (!overlayEl) return;
    overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { open: open, close: close, inject: inject };
})();


// ===================================
// Wire pricing CTAs → Popup
// ===================================
function initializeCheckoutLinks() {
  var ctaPlatformMap = {
    'pricing-cta-yt': 'youtube',
    'pricing-cta-ig': 'instagram',
    'pricing-cta-fb': 'facebook',
    'pricing-cta-amazon': 'amazon',
    'pricing-cta-google': 'google',
    'pricing-cta-imdb': 'imdb',
    'pricing-cta-twitter': 'twitter',
    'pricing-cta-more': null
  };

  var sectionPlatformMap = {
    'amazon': 'amazon', 'google': 'google',
    'imdb': 'imdb', 'twitter': 'twitter'
  };

  document.querySelectorAll('.pricing-cta').forEach(function(cta) {
    var card = cta.closest('.pricing-card');
    if (!card) return;

    var qty = (card.querySelector('.pricing-qty') || {}).textContent || '';
    var unit = (card.querySelector('.pricing-unit') || {}).textContent || '';
    var priceEl = card.querySelector('.pricing-price');
    var priceText = priceEl ? priceEl.textContent.replace('₹', '').trim() : '';
    var perText = (card.querySelector('.pricing-per') || {}).textContent || '';

    // Determine platform
    var platform = 'youtube';
    var classList = cta.className;
    for (var cls in ctaPlatformMap) {
      if (classList.indexOf(cls) !== -1) {
        platform = ctaPlatformMap[cls];
        break;
      }
    }
    if (platform === null) {
      var section = cta.closest('.service-section');
      if (section && section.id) {
        platform = sectionPlatformMap[section.id] || 'amazon';
      } else {
        platform = 'amazon';
      }
    }

    // Build checkout URL (goes to confirmation page)
    var params = new URLSearchParams();
    params.set('platform', platform);
    params.set('service', unit);
    params.set('qty', qty);
    params.set('price', priceText);
    if (perText) params.set('per', perText);
    cta.href = 'checkout.html?' + params.toString();
  });

  // Banner CTAs
  document.querySelectorAll('.service-organic-banner .btn').forEach(function(btn) {
    if (btn.getAttribute('href') === 'contact.html') {
      var firstCta = document.querySelector('.pricing-cta');
      var platform = 'youtube';
      if (firstCta) {
        if (firstCta.classList.contains('pricing-cta-ig')) platform = 'instagram';
        else if (firstCta.classList.contains('pricing-cta-fb')) platform = 'facebook';
        else if (firstCta.classList.contains('pricing-cta-amazon')) platform = 'amazon';
        else if (firstCta.classList.contains('pricing-cta-google')) platform = 'google';
        else if (firstCta.classList.contains('pricing-cta-imdb')) platform = 'imdb';
        else if (firstCta.classList.contains('pricing-cta-twitter')) platform = 'twitter';
        else if (firstCta.classList.contains('pricing-cta-more')) platform = 'amazon';
      }
      btn.href = 'checkout.html?platform=' + platform + '&service=Campaign&qty=Custom&price=Contact+Us';
    }
  });
}

// ===================================
// Init
// ===================================
function init() {
  initializeNavbar();
  initializeStats();
  initializeStatCharts();
  initializeCardToggles();
  renderReviews();
  initializeScrollAnimations();
  initializeSmoothScroll();
  initializeCheckoutLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
