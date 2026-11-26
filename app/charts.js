// Hand-rolled SVG charts for the KNSO site. Every chart is built from the
// data as a plain string — no chart library, no canvas, no network.
// Colours: ink #17324a, teal #0e7a6d, amber #d98a1f, rust #b4552d, slate #5b7286.

const INK = '#17324a';
const TEAL = '#0e7a6d';
const AMBER = '#d98a1f';
const RUST = '#b4552d';
const SLATE = '#5b7286';
const GRID = '#dbe4ea';
const PALETTE = [TEAL, AMBER, RUST, '#3a6ea5', '#7a9e4f', SLATE];

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(values) {
  const max = Math.max(...values.map((v) => (v == null ? 0 : v)));
  const min = Math.min(...values.map((v) => (v == null ? 0 : v)));
  const span = max - min || 1;
  const step = Math.pow(10, Math.floor(Math.log10(span)));
  return { lo: Math.floor(min / step) * step, hi: Math.ceil(max / step) * step, step };
}

function axisLabels(lo, hi, steps, format) {
  const out = [];
  for (let i = 0; i <= steps; i++) out.push(format(lo + ((hi - lo) * i) / steps));
  return out;
}

// Line chart. labels: x-axis labels; values: numbers (null = gap).
export function lineChart({ labels, values, width = 640, height = 260, colour = TEAL, format = (v) => String(v), title = '' }) {
  const padL = 76, padR = 14, padT = 14, padB = 30;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const nums = values.filter((v) => v != null);
  const { lo, hi } = niceMax(nums);
  const y = (v) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;
  const x = (i) => padL + (i / (labels.length - 1)) * innerW;
  const gridLines = axisLabels(lo, hi, 4, format).map((text, i) => {
    const gy = padT + (innerH * i) / 4;
    // Row 0 is the top of the chart, so it shows the highest value.
    const label = format(hi - ((hi - lo) * i) / 4);
    return `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${esc(label)}</text>`;
  }).join('');
  let path = '';
  let dots = '';
  values.forEach((v, i) => {
    if (v == null) return;
    path += (path ? ' L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" fill="${colour}"><title>${esc(labels[i])}: ${esc(format(v))}</title></circle>`;
  });
  const xLabels = labels.map((lab, i) => {
    if (labels.length > 8 && i % 2 === 1) return '';
    return `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(lab)}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title || 'Line chart')}" xmlns="http://www.w3.org/2000/svg">${gridLines}<path d="${path}" fill="none" stroke="${colour}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xLabels}</svg>`;
}

// Vertical bar chart. Negative values draw below the zero line.
export function barChart({ labels, values, width = 640, height = 260, colour = TEAL, format = (v) => String(v), title = '' }) {
  const padL = 76, padR = 14, padT = 14, padB = 30;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const span = hi - lo || 1;
  const y = (v) => padT + innerH - ((v - lo) / span) * innerH;
  const slot = innerW / labels.length;
  const barW = Math.min(44, slot * 0.62);
  const gridLines = axisLabels(lo, hi, 4, format).map((text, i) => {
    const gy = padT + (innerH * i) / 4;
    // Row 0 is the top of the chart, so it shows the highest value.
    const label = format(hi - ((hi - lo) * i) / 4);
    return `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${esc(label)}</text>`;
  }).join('');
  const bars = values.map((v, i) => {
    const bx = padL + slot * i + (slot - barW) / 2;
    const by = Math.min(y(0), y(v));
    const bh = Math.abs(y(v) - y(0));
    const fill = v < 0 ? RUST : colour;
    return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(bh, 1.5).toFixed(1)}" rx="2" fill="${fill}"><title>${esc(labels[i])}: ${esc(format(v))}</title></rect>`;
  }).join('');
  const zero = `<line x1="${padL}" y1="${y(0).toFixed(1)}" x2="${width - padR}" y2="${y(0).toFixed(1)}" stroke="${INK}" stroke-width="1"/>`;
  const xLabels = labels.map((lab, i) => `<text x="${(padL + slot * i + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(lab)}</text>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title || 'Bar chart')}" xmlns="http://www.w3.org/2000/svg">${gridLines}${zero}${bars}${xLabels}</svg>`;
}

// Horizontal bar chart, good for ranked categories.
export function hbarChart({ items, width = 640, height = 260, format = (v) => String(v), title = '' }) {
  const padL = 170, padR = 64, padT = 8, padB = 8;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...items.map((d) => d.value));
  const rowH = innerH / items.length;
  const barH = Math.min(26, rowH * 0.6);
  const rows = items.map((d, i) => {
    const cy = padT + rowH * i + rowH / 2;
    const bw = (d.value / max) * innerW;
    const colour = PALETTE[i % PALETTE.length];
    return `<text x="${padL - 10}" y="${(cy + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${INK}">${esc(d.label)}</text><rect x="${padL}" y="${(cy - barH / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${barH}" rx="2" fill="${colour}"><title>${esc(d.label)}: ${esc(format(d.value))}</title></rect><text x="${(padL + bw + 8).toFixed(1)}" y="${(cy + 4).toFixed(1)}" font-size="12" fill="${SLATE}">${esc(format(d.value))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title || 'Horizontal bar chart')}" xmlns="http://www.w3.org/2000/svg">${rows}</svg>`;
}

// Donut chart with a centre label and a legend underneath.
export function donutChart({ items, width = 300, height = 300, centre = '', format = (v) => String(v), title = '' }) {
  const cx = width / 2, cy = height / 2 - 14;
  const r = Math.min(width, height) / 2 - 34;
  const inner = r * 0.62;
  const total = items.reduce((sum, d) => sum + d.value, 0);
  let angle = -Math.PI / 2;
  const slices = items.map((d, i) => {
    const frac = d.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const colour = PALETTE[i % PALETTE.length];
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${colour}"><title>${esc(d.label)}: ${esc(format(d.value))}</title></path>`;
  }).join('');
  const legendRows = items.map((d, i) => `<span class="legend-item"><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(d.label)} — ${esc(format(d.value))}</span>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title || 'Donut chart')}" xmlns="http://www.w3.org/2000/svg">${slices}<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}">${esc(centre)}</text><text x="${cx}" y="${(cy + 18).toFixed(0)}" text-anchor="middle" font-size="11" fill="${SLATE}">total, %</text></svg><div class="legend">${legendRows}</div></div>`;
}
