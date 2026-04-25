---
name: html5-simulation
description: Gunakan skill ini setiap kali diminta membuat simulasi fisika baru untuk INITE yang berbasis HTML5 Canvas. Trigger: "buat simulasi baru", "tambah simulasi", "buat simulasi [nama topik]", atau ketika mengerjakan file di public/simulations/. Skill ini menghasilkan file index.html lengkap yang self-contained, siap di-embed via iframe di React.
---

Skill ini memandu pembuatan simulasi fisika interaktif HTML5 untuk platform INITE (Indonesian Nuclear Interactive Website). Setiap simulasi adalah file `index.html` yang self-contained — mengandung HTML, CSS, dan JavaScript dalam satu file — dan diletakkan di `public/simulations/{simulation-id}/index.html`.

## Langkah Wajib Sebelum Menulis Kode

1. **Baca `CATATAN_PERHITUNGAN.md`** untuk memahami rumus yang sudah didokumentasikan
2. **Baca `src/body/game/CLAUDE.md`** untuk panduan desain visual dan template
3. **Definisikan rumus fisika** yang akan diimplementasikan beserta sumbernya

## Struktur Wajib Output

Setiap simulasi HARUS memiliki:

### 1. Setup Canvas Responsif
```javascript
const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const PANEL_HEIGHT = 70; // tinggi kontrol panel bawah
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - PANEL_HEIGHT;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

### 2. Game Loop dengan Delta Time
```javascript
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  updatePhysics(dt);
  render();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```

### 3. State Terpusat
```javascript
const CONFIG = {
  // Konstanta fisika — SELALU dengan komentar satuan
  HVL_PB: 0.65,       // cm — Half Value Layer Pb untuk Cs-137
  FLUCT: 0.1,          // faktor fluktuasi detektor
};

let state = {
  running: true,
  // Semua state simulasi di sini
};
```

### 4. Info Panel (kanan atas)
```html
<div class="info-panel" id="info-panel">
  <div class="info-title">[Nama Simulasi]</div>
  <div class="info-row">
    <span class="info-label">Nilai:</span>
    <span class="info-value" id="val-output">0</span>
    <span class="info-unit">satuan</span>
  </div>
</div>
```

### 5. Controls Panel (bawah)
```html
<div class="controls">
  <div class="control-group">
    <label>Parameter: <span id="param-display">50</span></label>
    <input type="range" id="param-slider" min="1" max="100" value="50">
  </div>
  <button id="btn-reset" class="btn-sim">Reset</button>
  <button id="btn-toggle" class="btn-sim btn-primary">Pause</button>
</div>
```

## Palet Warna INITE (Wajib)

```css
:root {
  --bg-primary: #0a0e1a;
  --bg-panel: rgba(10, 14, 26, 0.88);
  --border-panel: #2a4a6a;
  --text-primary: #e0e8f0;
  --text-label: #8aa8c0;
  --accent-cyan: #00e5ff;
  --accent-green: #00ff88;
  --particle-alpha: #FFD700;
  --particle-beta: #00BFFF;
  --particle-gamma: #FF4500;
  --particle-neutron: #90EE90;
  --atom-proton: #FF6347;
  --atom-neutron-color: #708090;
  --danger: #ff4444;
  --safe: #44ff88;
}
```

## Teknik Fisika Umum

### Peluruhan Radioaktif
```javascript
// N(t) = N0 × e^(-λt), λ = ln(2) / T½
// Sumber: Krane, "Introductory Nuclear Physics" (1988)
function hitungPeluruhan(N0, halfLifeSec, timeSec) {
  const lambda = Math.LN2 / halfLifeSec;
  return N0 * Math.exp(-lambda * timeSec);
}
```

### Inverse Square Law + Shielding
```javascript
// D = (A / r²) × (0.5^(x/HVL))
// Sumber: IAEA Safety Reports Series No. 47
function hitungLajuDosis(activity, distanceM, shieldCm, hvl) {
  const safeR = Math.max(distanceM, 0.1);
  return (activity / (safeR * safeR)) * Math.pow(0.5, shieldCm / hvl);
}
```

### Gaya Coulomb (Hamburan Rutherford)
```javascript
// F = k × q1 × q2 / r²
// Sumber: Kaye & Laby Tables of Physical & Chemical Constants
const K_COULOMB = 8.9875e9; // N·m²/C²
function gayaCoulomb(q1, q2, r) {
  return K_COULOMB * q1 * q2 / (r * r);
}
```

### Fluktuasi Gaussian (Noise Detektor)
```javascript
// Box-Muller transform untuk distribusi normal
function gaussianRandom(mean = 0, stdDev = 1) {
  const u1 = Math.random(), u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}
```

## Teknik Rendering Canvas Umum

### Menggambar Partikel dengan Trail
```javascript
function drawParticle(ctx, x, y, r, color, trail = []) {
  // Trail (ekor)
  trail.forEach((pos, i) => {
    const alpha = (i / trail.length) * 0.3;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.fill();
  });
  // Partikel utama
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = r * 2;
  ctx.fill();
  ctx.shadowBlur = 0;
}
```

### Menggambar Inti Atom
```javascript
function drawNucleus(ctx, cx, cy, protons, neutrons) {
  const totalNucleons = protons + neutrons;
  const R = Math.sqrt(totalNucleons) * 8; // radius proporsional
  for (let i = 0; i < totalNucleons; i++) {
    const angle = (i / totalNucleons) * Math.PI * 2;
    const x = cx + (R * 0.6) * Math.cos(angle) + (Math.random() - 0.5) * R * 0.4;
    const y = cy + (R * 0.6) * Math.sin(angle) + (Math.random() - 0.5) * R * 0.4;
    const isProton = i < protons;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = isProton ? getComputedStyle(document.documentElement)
      .getPropertyValue('--atom-proton') : '#708090';
    ctx.fill();
  }
}
```

### Menggambar Grafik Real-time
```javascript
function drawGraph(ctx, x, y, w, h, data, maxVal, color, label) {
  // Background
  ctx.fillStyle = 'rgba(10,14,26,0.6)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#2a4a6a';
  ctx.strokeRect(x, y, w, h);
  
  // Data line
  if (data.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  data.forEach((val, i) => {
    const px = x + (i / (data.length - 1)) * w;
    const py = y + h - (val / maxVal) * h;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();
  
  // Label
  ctx.fillStyle = '#8aa8c0';
  ctx.font = '11px Segoe UI';
  ctx.fillText(label, x + 4, y + 14);
}
```

## Komunikasi dengan Backend (Opsional)

Jika simulasi butuh kalkulasi berat dari Python backend:

```javascript
async function hitungDariBackend(params) {
  try {
    const resp = await fetch('/simulasi/peluruhan/hitung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    // Fallback ke kalkulasi lokal jika backend tidak tersedia
    console.warn('Backend tidak tersedia, menggunakan kalkulasi lokal:', err);
    return hitungLokal(params);
  }
}
```

## Output Akhir yang Dihasilkan Skill Ini

1. **`public/simulations/{id}/index.html`** — simulasi lengkap self-contained
2. **Instruksi integrasi** — cara menambah ke React (`src/simulations/`, `App.js`, i18n)
3. **Catatan rumus fisika** — siap ditambahkan ke `CATATAN_PERHITUNGAN.md`
