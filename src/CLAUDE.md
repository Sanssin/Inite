# CLAUDE.md — Frontend (`src/`)

Ini adalah konteks khusus untuk pengerjaan kode di direktori `src/` (React frontend).

## Struktur `src/`

```
src/
├── App.js                    ← Root component + routing utama
├── index.js                  ← Entry point, i18n setup
├── index.css                 ← Global styles
├── assets/                   ← Gambar, ikon (import langsung di JS)
├── components/               ← Shared/reusable components
│   ├── Navbar.js
│   └── Footer.js
├── body/
│   ├── home/                 ← Halaman beranda
│   ├── about/                ← Halaman tentang
│   ├── education/            ← Konten edukasi
│   └── game/
│       └── GameArea.js       ← [SIMULASI EXISTING] ALARA simulation engine
└── simulations/              ← [RENCANA] wrapper komponen untuk simulasi baru
    └── SimulationFrame.js    ← iframe wrapper untuk HTML5 sims
```

## Routing (App.js)

Pattern routing yang digunakan (react-router-dom v6):
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Path simulasi yang sudah ada
/simulasi/proteksi-radiasi   → <GameArea />

// Path simulasi yang akan ditambah (rencana)
/simulasi/peluruhan          → <SimulationFrame src="/simulations/radioactive-decay/" />
/simulasi/hamburan           → <SimulationFrame src="/simulations/rutherford-scattering/" />
```

## Internasionalisasi (i18next)

**WAJIB**: Semua teks yang tampil ke user harus melalui `t()`:

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('halaman.simulasi.judul')}</h1>;
};
```

File terjemahan ada di `src/assets/locales/` (atau lokasi serupa):
```json
// id.json (Bahasa Indonesia - primer)
{
  "halaman": {
    "simulasi": {
      "judul": "Simulasi Peluruhan Radioaktif"
    }
  }
}
```

Jangan pernah hardcode string UI dalam Bahasa Indonesia atau Inggris langsung di JSX.

## Styling Guidelines

- **Bootstrap 5** untuk layout, grid, dan komponen umum (navbar, card, button, dll.)
- **CSS murni** (file `.css` per komponen) untuk styling spesifik simulasi
- Tidak ada Tailwind, tidak ada styled-components
- Nama class CSS: `kebab-case` dan deskriptif

```javascript
// ✅ Benar
<div className="simulation-canvas-wrapper">
  <canvas id="sim-canvas" className="sim-canvas--active"></canvas>
</div>

// ❌ Hindari inline styles untuk layout (kecuali nilai dinamis)
<div style={{display: 'flex', padding: '20px'}}>
```

## Komponen Simulasi — Pola Baru (SimulationFrame)

Untuk simulasi HTML5 baru yang di-embed via `<iframe>`:

```javascript
// src/simulations/SimulationFrame.js
import React, { useRef } from 'react';
import './SimulationFrame.css';

const SimulationFrame = ({ simulasiId, judul, tinggi = 600 }) => {
  const iframeRef = useRef(null);
  
  return (
    <div className="simulation-frame-wrapper">
      <h2 className="simulation-title">{judul}</h2>
      <iframe
        ref={iframeRef}
        src={`/simulations/${simulasiId}/index.html`}
        title={judul}
        className="simulation-iframe"
        style={{ height: tinggi }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default SimulationFrame;
```

## API Calls ke Backend (FastAPI)

Backend berjalan di `localhost:8000` dan sudah diproxy di `package.json`:

```javascript
// Pattern fetch ke backend
const fetchDoseCalculation = async (params) => {
  try {
    const response = await fetch('/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Gagal menghubungi backend kalkulasi:', error);
    return null;
  }
};
```

## State Management

Tidak ada Redux/Zustand. Gunakan:
- `useState` untuk state lokal komponen
- `useEffect` untuk side effects (fetch data, setup Canvas, interval)
- `useRef` untuk referensi DOM Canvas dan interval IDs
- `useCallback` / `useMemo` untuk optimisasi jika diperlukan (simulasi berat)

## Performance — Canvas Simulations

Untuk komponen yang menggunakan Canvas dan `requestAnimationFrame`:

```javascript
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  let animationId;
  
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... draw
    animationId = requestAnimationFrame(render);
  };
  
  animationId = requestAnimationFrame(render);
  
  // WAJIB: cleanup untuk mencegah memory leak
  return () => cancelAnimationFrame(animationId);
}, []);
```

## Daftar Komponen yang Sudah Ada

| File | Fungsi | Status |
|---|---|---|
| `body/game/GameArea.js` | Simulasi ALARA (proteksi radiasi) | Stabil, jangan ubah tanpa diskusi |
| `components/Navbar.js` | Navigasi utama | Shared |
| `components/Footer.js` | Footer halaman | Shared |

## Checklist Sebelum Commit (Frontend)

- [ ] Semua teks UI menggunakan `t()` dari i18next
- [ ] Tidak ada `console.log` debug yang tertinggal
- [ ] Canvas effects dibersihkan di `useEffect` cleanup
- [ ] Komponen simulasi baru sudah didaftarkan di `App.js` routing
- [ ] CSS class menggunakan `kebab-case`
