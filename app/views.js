// Views for the KNSO site. The router reads location.hash, renderView()
// returns the page HTML, and bindView() wires the controls after the HTML
// is in the document. All figures come from data.js.

import { META, YEARS, SERIES, REGIONS, AGE_GROUPS, GDP_SECTORS, EMPLOYMENT_SECTORS, CPI_COMPONENTS, TRADE_YEARS, TRADE, TRADE_PARTNERS, RELEASES, RELEASE_CALENDAR, headlineIndicators } from './data.js';
import { lineChart, barChart, hbarChart, donutChart } from './charts.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sourceNote(source) {
  return `<p class="source">Source: ${esc(source)}</p>`;
}

function changeBadge(change, favourable, suffix = '') {
  const up = change > 0;
  const arrow = up ? '▲' : change < 0 ? '▼' : '—';
  const cls = change === 0 ? 'flat' : (favourable === up ? 'good' : 'bad');
  const sign = up ? '+' : '';
  return `<span class="change ${cls}">${arrow} ${sign}${change.toFixed(1)}${suffix}</span>`;
}

function kpiCards() {
  const indicators = headlineIndicators();
  const favourable = [true, true, false, false];
  return `<div class="kpi-grid">${indicators.map((ind, i) => {
    const prevLabel = ind.label === 'Unemployment rate' ? 'pp on 2024' : ind.label === 'Annual inflation' ? 'pp on 2024' : 'on 2024';
    return `<article class="kpi"><h3>${esc(ind.label)}</h3><p class="kpi-value">${esc(ind.value)}</p><p class="kpi-meta">${changeBadge(ind.change, favourable[i], ' ' + prevLabel)}</p><p class="kpi-source">${esc(ind.source)}</p></article>`;
  }).join('')}</div>`;
}

function section(title, intro, body, source) {
  return `<section class="panel"><h2>${esc(title)}</h2>${intro ? `<p class="lede">${esc(intro)}</p>` : ''}${body}${source ? sourceNote(source) : ''}</section>`;
}

// ---------- Home ----------

function viewHome() {
  const gdpYears = YEARS.map(String);
  const releases = RELEASES.map((r) => `<li><a href="${r.route}">${esc(r.title)}</a><span class="rel-date">${esc(r.date)}</span></li>`).join('');
  return `
  <section class="hero">
    <p class="eyebrow">Official statistics · ${esc(META.updated)}</p>
    <h1>Statistics for the Republic of Kalandra</h1>
    <p class="lede">The Kalandra National Statistics Office publishes the country's population, economy, labour market and price figures — free for everyone, with every number traced to its release.</p>
    <p class="hero-links"><a class="btn" href="#/data">Explore the data</a> <a class="btn ghost" href="#/compare">Compare regions</a></p>
  </section>
  ${kpiCards()}
  <div class="two-col">
    <section class="panel">
      <h2>Gross domestic product, 2015–2025</h2>
      ${lineChart({ labels: gdpYears, values: SERIES.gdp.values, format: (v) => 'KLR ' + v.toFixed(0) + ' bn', title: 'GDP of Kalandra, 2015 to 2025' })}
      ${sourceNote(SERIES.gdp.source)}
      <p><a href="#/economy">See the economy in detail →</a></p>
    </section>
    <section class="panel">
      <h2>What the economy is made of, 2025</h2>
      ${donutChart({ items: GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })), centre: '100', format: (v) => v.toFixed(1) + '%', title: 'Share of gross value added by industry, 2025' })}
      ${sourceNote('KNSO, National Accounts 2025')}
    </section>
  </div>
  <section class="panel">
    <h2>Latest releases</h2>
    <ul class="releases">${releases}</ul>
    <p>Next release: ${esc(META.nextRelease)}.</p>
  </section>
  <section class="panel">
    <h2>At a glance</h2>
    <p>Kalandra's population reached <strong>9.87 million</strong> in 2025, up 1.4% on 2024. The economy grew <strong>7.0%</strong> in real terms, unemployment fell to <strong>5.4%</strong>, and consumer prices rose <strong>3.1%</strong> over the year. Life expectancy is <strong>78.5 years</strong> and the median monthly wage is <strong>KLR 4,450</strong>.</p>
    ${sourceNote('KNSO, National Accounts 2025; Labour Force Survey 2025; Consumer Price Index, January 2026')}
  </section>`;
}

// ---------- Population ----------

function viewPopulation() {
  const rows = YEARS.map((y, i) => `<tr><td>${y}</td><td>${SERIES.population.values[i].toFixed(2)}</td><td>${i === 0 ? '—' : '+' + ((SERIES.population.values[i] / SERIES.population.values[i - 1] - 1) * 100).toFixed(1) + '%'}</td><td>${SERIES.lifeExpectancy.values[i].toFixed(1)}</td></tr>`).join('');
  return `
  <h1>Population</h1>
  <p class="lede">9.87 million people lived in Kalandra in mid-2025. The population has grown every year since 2015, and people are living longer: life expectancy is 78.5 years, up from 76.4 in 2015.</p>
  ${section('Population, 2015–2025', '', lineChart({ labels: YEARS.map(String), values: SERIES.population.values, format: (v) => v.toFixed(2) + ' m', title: 'Population of Kalandra, 2015 to 2025' }), SERIES.population.source)}
  <div class="two-col">
    ${section('Who lives here, 2025', 'Two in five Kalandrans are aged 25–54; one in eight is 65 or older.', donutChart({ items: AGE_GROUPS.map((a) => ({ label: a.group, value: a.share })), centre: '100', format: (v) => v.toFixed(1) + '%', title: 'Population by age group, 2025' }), 'KNSO, Population Estimates 2025')}
    ${section('Where people live', 'Port Meridia holds almost a quarter of the country. Highmoor is the largest region by area and the smallest by population.', hbarChart({ items: REGIONS.map((r) => ({ label: r.name, value: r.population })), format: (v) => v.toFixed(2) + ' m', title: 'Population by region, 2025' }), 'KNSO, Population Estimates 2025')}
  </div>
  ${section('Population and life expectancy by year', '', `<div class="table-wrap"><table class="sortable"><thead><tr><th data-type="number">Year</th><th data-type="number">Population (million)</th><th data-type="number">Annual change</th><th data-type="number">Life expectancy (years)</th></tr></thead><tbody>${rows}</tbody></table></div>`, 'KNSO, Annual Population Estimates 2025; Vital Statistics 2025')}`;
}

// ---------- Economy ----------

function viewEconomy() {
  const tradeRows = TRADE_YEARS.map((y, i) => `<tr><td>${y}</td><td>${TRADE.exports.values[i].toFixed(1)}</td><td>${TRADE.imports.values[i].toFixed(1)}</td><td>${TRADE.balance.values[i] > 0 ? '+' : ''}${TRADE.balance.values[i].toFixed(1)}</td></tr>`).join('');
  const partnerRows = TRADE_PARTNERS.map((p) => `<tr><td>${esc(p.partner)}</td><td>${p.exports.toFixed(1)}</td><td>${(p.exports / TRADE.exports.values[4] * 100).toFixed(1)}%</td></tr>`).join('');
  const yearOptions = YEARS.map((y) => `<option value="${y}">${y}</option>`).join('');
  return `
  <h1>Economy</h1>
  <p class="lede">Kalandra's economy was worth KLR 664.8 billion in 2025 and grew 7.0% in real terms — the fourth straight year of growth above 6% after the 2020 contraction of 3.4%.</p>
  <section class="panel">
    <h2>Gross domestic product</h2>
    <div class="controls">
      <label>From <select id="gdp-from">${yearOptions}</select></label>
      <label>To <select id="gdp-to">${yearOptions}</select></label>
      <span class="hint">Change the years to redraw the chart.</span>
    </div>
    <div id="gdp-chart"></div>
    ${sourceNote(SERIES.gdp.source)}
  </section>
  <div class="two-col">
    ${section('Real GDP growth, 2015–2025', 'Growth rebounded sharply after 2020 and has stayed above 6% since 2022.', barChart({ labels: YEARS.map(String), values: SERIES.gdpGrowth.values, format: (v) => v.toFixed(1) + '%', title: 'Real GDP growth, 2015 to 2025' }), SERIES.gdpGrowth.source)}
    ${section('What the economy is made of, 2025', '', donutChart({ items: GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })), centre: '100', format: (v) => v.toFixed(1) + '%', title: 'Share of gross value added by industry, 2025' }), 'KNSO, National Accounts 2025')}
  </div>
  ${section('Trade in goods, 2021–2025', 'Exports passed imports for the first time in 2024, and the surplus widened to KLR 6.3 billion in 2025.', `<div class="table-wrap"><table class="sortable"><thead><tr><th data-type="number">Year</th><th data-type="number">Exports (KLR bn)</th><th data-type="number">Imports (KLR bn)</th><th data-type="number">Balance (KLR bn)</th></tr></thead><tbody>${tradeRows}</tbody></table></div>`, TRADE.exports.source)}
  ${section('Main export destinations, 2025', '', `<div class="table-wrap"><table class="sortable"><thead><tr><th>Partner</th><th data-type="number">Exports (KLR bn)</th><th data-type="number">Share of exports</th></tr></thead><tbody>${partnerRows}</tbody></table></div>`, 'KNSO, Trade in Goods, December 2025')}`;
}

// ---------- Labour ----------

function viewLabour() {
  return `
  <h1>Labour market</h1>
  <p class="lede">Unemployment fell to 5.4% in 2025, the lowest in the series, while 66.4% of people aged 15–64 were in work or looking for it. The median monthly wage reached KLR 4,450.</p>
  <div class="two-col">
    ${section('Unemployment rate, 2015–2025', '', lineChart({ labels: YEARS.map(String), values: SERIES.unemployment.values, colour: '#b4552d', format: (v) => v.toFixed(1) + '%', title: 'Unemployment rate, 2015 to 2025' }), SERIES.unemployment.source)}
    ${section('Participation and pay', '', lineChart({ labels: YEARS.map(String), values: SERIES.participation.values, format: (v) => v.toFixed(1) + '%', title: 'Labour force participation, 2015 to 2025' }), SERIES.participation.source)}
  </div>
  ${section('Where people work, 2025', 'Services employ almost two in three workers; agriculture still employs 8.4%.', hbarChart({ items: EMPLOYMENT_SECTORS.map((s) => ({ label: s.sector, value: s.share })), format: (v) => v.toFixed(1) + '%', title: 'Employment by industry, 2025' }), 'KNSO, Labour Force Survey 2025')}
  ${section('Median monthly wage, 2015–2025', 'Pay dipped in 2020, then rose every year; it is up 6.5% on 2024.', barChart({ labels: YEARS.map(String), values: SERIES.medianWage.values, colour: '#d98a1f', format: (v) => 'KLR ' + v.toLocaleString('en-US'), title: 'Median monthly wage, 2015 to 2025' }), SERIES.medianWage.source)}`;
}

// ---------- Prices ----------

function viewPrices() {
  const rows = CPI_COMPONENTS.map((c) => `<tr><td>${esc(c.component)}</td><td>${c.weight.toFixed(1)}%</td><td>${c.change > 0 ? '+' : ''}${c.change.toFixed(1)}%</td></tr>`).join('');
  return `
  <h1>Prices</h1>
  <p class="lede">Consumer prices rose 3.1% in the year to January 2026, down from 5.4% in 2022. Energy prices rose fastest in the latest year, up 4.6%; transport rose slowest, up 2.2%.</p>
  <div class="two-col">
    ${section('Consumer price index, 2015–2025', 'The index stood at 135.9 in 2025, with 2015 = 100.', lineChart({ labels: YEARS.map(String), values: SERIES.cpi.values, colour: '#3a6ea5', format: (v) => v.toFixed(1), title: 'Consumer price index, 2015 to 2025' }), SERIES.cpi.source)}
    ${section('Annual inflation, 2016–2025', 'Inflation peaked at 5.4% in 2022 and has fallen for three years running.', barChart({ labels: YEARS.slice(1).map(String), values: SERIES.inflation.values.slice(1), colour: '#3a6ea5', format: (v) => v.toFixed(1) + '%', title: 'Annual inflation, 2016 to 2025' }), SERIES.inflation.source)}
  </div>
  ${section('What is in the basket', 'Housing and food together make up just over half of what households buy. The table shows each component\'s weight in the basket and its price change in the year to January 2026.', `<div class="table-wrap"><table class="sortable"><thead><tr><th>Component</th><th data-type="number">Weight</th><th data-type="number">Annual change</th></tr></thead><tbody>${rows}</tbody></table></div>`, 'KNSO, Consumer Price Index, January 2026')}
  <section class="panel"><h2>How the CPI is measured</h2><p>Each month KNSO price collectors record around 18,000 prices in 42 towns across all eight regions. The basket is reviewed every year so it follows what households actually buy; the January 2026 basket added streaming subscriptions and removed DVD rentals. Prices are collected in the first two weeks of the month and published on the tenth working day after.</p>${sourceNote('KNSO, Consumer Price Index, January 2026')}</section>`;
}

// ---------- Regions ----------

function regionRows() {
  return REGIONS.map((r) => {
    const density = (r.population * 1000000) / r.area;
    return `<tr><td><a href="#/region/${r.slug}">${esc(r.name)}</a></td><td>${esc(r.capital)}</td><td>${r.population.toFixed(2)}</td><td>${r.area.toLocaleString('en-US')}</td><td>${density.toFixed(0)}</td><td>${r.gdpPerPerson.toLocaleString('en-US')}</td><td>${r.unemployment.toFixed(1)}%</td><td>${r.urban}%</td></tr>`;
  }).join('');
}

function viewRegions() {
  return `
  <h1>Regions</h1>
  <p class="lede">Kalandra has eight regions. Port Meridia is the richest and most urban; Highmoor is the largest, the most rural, and has the highest unemployment at 8.3%. Click a region for its detail page, or click a column header to sort.</p>
  ${section('All regions, 2025', '', `<div class="table-wrap"><table class="sortable"><thead><tr><th>Region</th><th>Capital</th><th data-type="number">Population (m)</th><th data-type="number">Area (km²)</th><th data-type="number">Density (per km²)</th><th data-type="number">GDP per person (KLR)</th><th data-type="number">Unemployment</th><th data-type="number">Urban share</th></tr></thead><tbody>${regionRows()}</tbody></table></div>`, 'KNSO, Regional GDP 2024 and Population Estimates 2025')}
  ${section('GDP per person by region, 2025', '', hbarChart({ items: [...REGIONS].sort((a, b) => b.gdpPerPerson - a.gdpPerPerson).map((r) => ({ label: r.name, value: r.gdpPerPerson })), format: (v) => 'KLR ' + v.toLocaleString('en-US'), title: 'GDP per person by region, 2025' }), 'KNSO, Regional GDP 2024')}
  ${section('Unemployment by region, 2025', '', hbarChart({ items: [...REGIONS].sort((a, b) => b.unemployment - a.unemployment).map((r) => ({ label: r.name, value: r.unemployment })), colour: '#b4552d', format: (v) => v.toFixed(1) + '%', title: 'Unemployment by region, 2025' }), 'KNSO, Labour Force Survey 2025')}`;
}

function viewRegionDetail(slug) {
  const r = REGIONS.find((x) => x.slug === slug);
  if (!r) return `<h1>Region not found</h1><p>There is no region called “${esc(slug)}”. <a href="#/regions">See all regions →</a></p>`;
  const nationalGdp = 664.8 / 9.87 * 1000;
  const density = (r.population * 1000000) / r.area;
  const share = (r.population / 9.87 * 100).toFixed(1);
  const gdpGap = ((r.gdpPerPerson / nationalGdp - 1) * 100).toFixed(0);
  return `
  <p class="crumb"><a href="#/regions">← All regions</a></p>
  <h1>${esc(r.name)}</h1>
  <p class="lede">Capital: ${esc(r.capital)}. ${esc(r.name)} is home to ${r.population.toFixed(2)} million people — ${share}% of Kalandra — across ${r.area.toLocaleString('en-US')} km².</p>
  <div class="kpi-grid">
    <article class="kpi"><h3>Population</h3><p class="kpi-value">${r.population.toFixed(2)} m</p><p class="kpi-meta">${share}% of Kalandra</p></article>
    <article class="kpi"><h3>GDP per person</h3><p class="kpi-value">KLR ${r.gdpPerPerson.toLocaleString('en-US')}</p><p class="kpi-meta">${gdpGap > 0 ? '+' : ''}${gdpGap}% vs national average</p></article>
    <article class="kpi"><h3>Unemployment</h3><p class="kpi-value">${r.unemployment.toFixed(1)}%</p><p class="kpi-meta">National: 5.4%</p></article>
    <article class="kpi"><h3>Urban share</h3><p class="kpi-value">${r.urban}%</p><p class="kpi-meta">${density.toFixed(0)} people per km²</p></article>
  </div>
  <div class="two-col">
    ${section('Against the other regions', 'GDP per person, with ' + r.name + ' highlighted in teal.', hbarChart({ items: [...REGIONS].sort((a, b) => b.gdpPerPerson - a.gdpPerPerson).map((x) => ({ label: x.name, value: x.gdpPerPerson })), format: (v) => 'KLR ' + v.toLocaleString('en-US'), title: 'GDP per person by region, 2025' }), r.source)}
    ${section('Unemployment, all regions', '', hbarChart({ items: [...REGIONS].sort((a, b) => b.unemployment - a.unemployment).map((x) => ({ label: x.name, value: x.unemployment })), format: (v) => v.toFixed(1) + '%', title: 'Unemployment by region, 2025' }), 'KNSO, Labour Force Survey 2025')}
  </div>
  <p><a href="#/compare">Compare ${esc(r.name)} with another region →</a></p>
  ${sourceNote(r.source)}`;
}

// ---------- Compare ----------

function compareTable(a, b) {
  const rows = [
    { label: 'Population (million)', av: a.population, bv: b.population, fmt: (v) => v.toFixed(2), higherBetter: null },
    { label: 'Area (km²)', av: a.area, bv: b.area, fmt: (v) => v.toLocaleString('en-US'), higherBetter: null },
    { label: 'GDP per person (KLR)', av: a.gdpPerPerson, bv: b.gdpPerPerson, fmt: (v) => v.toLocaleString('en-US'), higherBetter: true },
    { label: 'Unemployment (%)', av: a.unemployment, bv: b.unemployment, fmt: (v) => v.toFixed(1) + '%', higherBetter: false },
    { label: 'Urban share (%)', av: a.urban, bv: b.urban, fmt: (v) => v + '%', higherBetter: null },
  ];
  return `<div class="table-wrap"><table><thead><tr><th>Indicator</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th><th>Leading</th></tr></thead><tbody>${rows.map((row) => {
    const aWins = row.av !== row.bv && ((row.higherBetter === true && row.av > row.bv) || (row.higherBetter === false && row.av < row.bv) || (row.higherBetter === null && row.av > row.bv));
    const bWins = row.av !== row.bv && !aWins;
    const leader = row.av === row.bv ? 'Tie' : aWins ? a.name : b.name;
    return `<tr><td>${row.label}</td><td class="${aWins ? 'winner' : ''}">${row.fmt(row.av)}</td><td class="${bWins ? 'winner' : ''}">${row.fmt(row.bv)}</td><td>${leader}</td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function viewCompare() {
  const options = REGIONS.map((r) => `<option value="${r.slug}">${esc(r.name)}</option>`).join('');
  return `
  <h1>Compare regions</h1>
  <p class="lede">Pick any two regions and put them side by side. The leading value in each row is highlighted; for unemployment, lower leads.</p>
  <section class="panel">
    <div class="controls">
      <label>Region A <select id="compare-a">${options}</select></label>
      <button class="btn" id="compare-swap" type="button">⇄ Swap</button>
      <label>Region B <select id="compare-b">${options}</select></label>
    </div>
    <div id="compare-result"></div>
  </section>
  ${sourceNote('KNSO, Regional GDP 2024 and Population Estimates 2025; Labour Force Survey 2025')}`;
}

// ---------- Data explorer ----------

function viewData() {
  const seriesOptions = Object.keys(SERIES).map((k) => `<option value="${k}">${esc(SERIES[k].label)} — ${esc(SERIES[k].unit)}</option>`).join('');
  return `
  <h1>Data explorer</h1>
  <p class="lede">Every series the office publishes, in one place. Pick a series, search the table, and download the rows as a CSV file to use in your own work.</p>
  <section class="panel">
    <div class="controls">
      <label>Series <select id="data-series">${seriesOptions}<option value="regions">Regions, 2025 — all indicators</option></select></label>
      <label>Search <input id="data-search" type="search" placeholder="Type to filter rows…" aria-label="Search table rows"></label>
      <button class="btn" id="data-csv" type="button">Download CSV</button>
    </div>
    <div id="data-table"></div>
    <p class="hint" id="data-count"></p>
  </section>
  <section class="panel"><h2>Using KNSO data</h2><p>All figures on this site are free to reuse with attribution: “Source: Kalandra National Statistics Office”. Figures are revised when new information arrives; the release calendar on the <a href="#/about">About page</a> shows what is coming next. If a number you need is not here, write to <a href="mailto:data@knso.example">data@knso.example</a>.</p></section>`;
}

// ---------- About ----------

function viewAbout() {
  const calendar = RELEASE_CALENDAR.map((c) => `<tr><td>${esc(c.title)}</td><td>${esc(c.date)}</td></tr>`).join('');
  return `
  <h1>About the KNSO</h1>
  <p class="lede">The Kalandra National Statistics Office is the country's independent producer of official statistics. It was established by the Statistics Act 1998 and publishes population, economic, labour and price figures for the Republic of Kalandra.</p>
  <section class="panel"><h2>How we work</h2>
    <p>Figures come from three kinds of source: surveys of households and businesses, administrative records such as tax and birth registrations, and the price collectors who visit shops in 42 towns every month. Each release is checked by two statisticians before publication, and methods are published alongside the numbers so anyone can see how a figure was made.</p>
    <p>Revisions are published openly: when new information changes an earlier figure, the release notes say what changed and why. No minister or official sees a release before the public does.</p>
  </section>
  <section class="panel"><h2>Release calendar, 2026</h2>
    <div class="table-wrap"><table><thead><tr><th>Release</th><th>Date</th></tr></thead><tbody>${calendar}</tbody></table></div>
    <p>All releases are published at 09:30 Kalandra time on the day shown.</p>
  </section>
  <section class="panel"><h2>Contact</h2>
    <p>Kalandra National Statistics Office<br>1 Census Square, Port Meridia, Kalandra<br>General enquiries: <a href="mailto:info@knso.example">info@knso.example</a><br>Data requests: <a href="mailto:data@knso.example">data@knso.example</a><br>Media: <a href="mailto:press@knso.example">press@knso.example</a></p>
  </section>
  <section class="panel"><h2>Sources used on this site</h2>
    <p>National Accounts 2025 · Annual Population Estimates 2025 · Labour Force Survey 2025 · Consumer Price Index, January 2026 · Vital Statistics 2025 · Earnings Survey 2025 · Trade in Goods, December 2025 · Regional GDP 2024.</p>
    <p>All figures on this site are invented for the fictional Republic of Kalandra; any resemblance to a real country's statistics is coincidence.</p>
  </section>`;
}

// ---------- Router ----------

export function renderView(hash) {
  const path = (hash || '#/').replace(/^#/, '') || '/';
  if (path === '/' || path === '') return viewHome();
  if (path === '/population') return viewPopulation();
  if (path === '/economy') return viewEconomy();
  if (path === '/labour') return viewLabour();
  if (path === '/prices') return viewPrices();
  if (path === '/regions') return viewRegions();
  if (path.startsWith('/region/')) return viewRegionDetail(path.slice('/region/'.length));
  if (path === '/compare') return viewCompare();
  if (path === '/data') return viewData();
  if (path === '/about') return viewAbout();
  return `<h1>Page not found</h1><p>That page does not exist. <a href="#/">Back to the home page →</a></p>`;
}

// Sort every table with class "sortable" when its header is clicked.
export function makeSortable(root) {
  root.querySelectorAll('table.sortable').forEach((table) => {
    table.querySelectorAll('th').forEach((th, col) => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const type = th.dataset.type || 'text';
        const tbody = table.querySelector('tbody');
        const rows = [...tbody.querySelectorAll('tr')];
        const ascending = th.dataset.dir !== 'asc';
        table.querySelectorAll('th').forEach((h) => { delete h.dataset.dir; h.textContent = h.textContent.replace(/ [▲▼]$/, ''); });
        th.dataset.dir = ascending ? 'asc' : 'desc';
        th.textContent = th.textContent + (ascending ? ' ▲' : ' ▼');
        const key = (row) => {
          const cell = row.children[col].textContent.trim().replace(/[%,]/g, '').replace(/KLR /g, '');
          return type === 'number' ? parseFloat(cell) || 0 : cell.toLowerCase();
        };
        rows.sort((a, b) => {
          const ka = key(a), kb = key(b);
          if (ka < kb) return ascending ? -1 : 1;
          if (ka > kb) return ascending ? 1 : -1;
          return 0;
        });
        rows.forEach((row) => tbody.appendChild(row));
      });
    });
  });
}

function drawGdpChart() {
  const fromEl = document.getElementById('gdp-from');
  const toEl = document.getElementById('gdp-to');
  const box = document.getElementById('gdp-chart');
  if (!fromEl || !toEl || !box) return;
  let from = Number(fromEl.value);
  let to = Number(toEl.value);
  if (from > to) { const tmp = from; from = to; to = tmp; }
  const idx = YEARS.map((y, i) => ({ y, i })).filter((d) => d.y >= from && d.y <= to);
  box.innerHTML = lineChart({
    labels: idx.map((d) => String(d.y)),
    values: idx.map((d) => SERIES.gdp.values[d.i]),
    format: (v) => 'KLR ' + v.toFixed(0) + ' bn',
    title: 'GDP of Kalandra, ' + from + ' to ' + to,
  });
}

function drawCompare() {
  const aEl = document.getElementById('compare-a');
  const bEl = document.getElementById('compare-b');
  const box = document.getElementById('compare-result');
  if (!aEl || !bEl || !box) return;
  const a = REGIONS.find((r) => r.slug === aEl.value);
  const b = REGIONS.find((r) => r.slug === bEl.value);
  if (!a || !b) return;
  box.innerHTML = `
    <h2>${esc(a.name)} vs ${esc(b.name)}</h2>
    ${compareTable(a, b)}
    <div class="two-col">
      <div><h3>GDP per person, 2025</h3>${hbarChart({ items: [{ label: a.name, value: a.gdpPerPerson }, { label: b.name, value: b.gdpPerPerson }], format: (v) => 'KLR ' + v.toLocaleString('en-US'), title: 'GDP per person, ' + a.name + ' and ' + b.name })}</div>
      <div><h3>Unemployment, 2025</h3>${hbarChart({ items: [{ label: a.name, value: a.unemployment }, { label: b.name, value: b.unemployment }], format: (v) => v.toFixed(1) + '%', title: 'Unemployment, ' + a.name + ' and ' + b.name })}</div>
    </div>
    <p><a href="#/region/${a.slug}">Detail: ${esc(a.name)} →</a> · <a href="#/region/${b.slug}">Detail: ${esc(b.name)} →</a></p>`;
}

function dataTableRows(key, query) {
  const q = (query || '').trim().toLowerCase();
  let rows = [];
  let head = '';
  if (key === 'regions') {
    head = '<tr><th>Region</th><th>Population (m)</th><th>Area (km²)</th><th>GDP per person (KLR)</th><th>Unemployment (%)</th><th>Urban share (%)</th></tr>';
    rows = REGIONS.map((r) => [r.name, r.population.toFixed(2), String(r.area), String(r.gdpPerPerson), r.unemployment.toFixed(1), String(r.urban)]);
  } else {
    const s = SERIES[key];
    head = '<tr><th>Year</th><th>' + esc(s.label) + ' (' + esc(s.unit) + ')</th></tr>';
    rows = YEARS.map((y, i) => [String(y), s.values[i] == null ? '—' : String(s.values[i])]);
  }
  const filtered = rows.filter((row) => !q || row.join(' ').toLowerCase().includes(q));
  const body = filtered.map((row) => '<tr>' + row.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('');
  return { head, body, count: filtered.length, total: rows.length, rows: filtered };
}

function drawDataTable() {
  const sel = document.getElementById('data-series');
  const search = document.getElementById('data-search');
  const box = document.getElementById('data-table');
  const count = document.getElementById('data-count');
  if (!sel || !box) return;
  const { head, body, count: shown, total } = dataTableRows(sel.value, search ? search.value : '');
  box.innerHTML = `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body || '<tr><td colspan="6">No rows match your search.</td></tr>'}</tbody></table></div>`;
  if (count) count.textContent = `Showing ${shown} of ${total} rows.`;
}

function downloadCsv() {
  const sel = document.getElementById('data-series');
  const search = document.getElementById('data-search');
  if (!sel) return;
  const { rows, head } = dataTableRows(sel.value, search ? search.value : '');
  const headerText = head.replace(/<[^>]+>/g, '|').split('|').filter(Boolean).join(',');
  const lines = [headerText, ...rows.map((row) => row.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'knso-' + sel.value + '.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Wire the controls of the current view after renderView() HTML is placed.
export function bindView(hash) {
  const root = document.getElementById('view');
  if (!root) return;
  makeSortable(root);
  const path = (hash || '#/').replace(/^#/, '') || '/';
  if (path === '/economy') {
    const fromEl = document.getElementById('gdp-from');
    const toEl = document.getElementById('gdp-to');
    if (fromEl && toEl) {
      fromEl.value = '2015';
      toEl.value = '2025';
      fromEl.addEventListener('change', drawGdpChart);
      toEl.addEventListener('change', drawGdpChart);
      drawGdpChart();
    }
  }
  if (path === '/compare') {
    const aEl = document.getElementById('compare-a');
    const bEl = document.getElementById('compare-b');
    const swap = document.getElementById('compare-swap');
    if (aEl && bEl) {
      aEl.value = 'port-meridia';
      bEl.value = 'highmoor';
      aEl.addEventListener('change', drawCompare);
      bEl.addEventListener('change', drawCompare);
      if (swap) swap.addEventListener('click', () => {
        const tmp = aEl.value;
        aEl.value = bEl.value;
        bEl.value = tmp;
        drawCompare();
      });
      drawCompare();
    }
  }
  if (path === '/data') {
    const sel = document.getElementById('data-series');
    const search = document.getElementById('data-search');
    const csv = document.getElementById('data-csv');
    if (sel) sel.addEventListener('change', drawDataTable);
    if (search) search.addEventListener('input', drawDataTable);
    if (csv) csv.addEventListener('click', downloadCsv);
    drawDataTable();
  }
}
