---
name: inite-component
description: Gunakan skill ini saat membuat atau memodifikasi React component untuk INITE. Trigger: "buat komponen", "tambah halaman", "buat wrapper simulasi", atau saat mengerjakan file di src/ yang bukan simulasi HTML5 murni. Skill ini memastikan semua komponen konsisten dengan konvensi INITE: Bootstrap 5, i18next, CSS murni, dan pola React yang sudah dipakai.
---

Skill ini memandu pembuatan React components yang konsisten untuk platform INITE.

## Pola Komponen Standar INITE

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './NamaKomponen.css'; // CSS file terpisah per komponen

/**
 * [NamaKomponen] — deskripsi singkat fungsi komponen
 * Props:
 *   - propA (tipe): keterangan
 */
const NamaKomponen = ({ propA = nilaiDefault }) => {
  const { t } = useTranslation();
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // side effects
    return () => {
      // cleanup — WAJIB untuk interval, listener, Canvas RAF
    };
  }, []);
  
  return (
    <div className="nama-komponen">
      <h2>{t('kunci.terjemahan')}</h2>
    </div>
  );
};

export default NamaKomponen;
```

## SimulationFrame — Komponen Wrapper Iframe

Ini adalah komponen kunci untuk simulasi HTML5 baru:

```javascript
// src/simulations/SimulationFrame.js
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SimulationFrame.css';

/**
 * SimulationFrame — wrapper iframe untuk simulasi HTML5 standalone
 * Digunakan oleh semua simulasi baru berbasis HTML5 Canvas
 */
const SimulationFrame = ({
  simulasiId,        // ID folder: "radioactive-decay"
  judul,             // Judul tampil (string atau t() result)
  deskripsi,         // Deskripsi singkat
  tinggi = 580,      // Tinggi iframe (px)
  showFullscreen = true,
}) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const el = iframeRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    setIsFullscreen(true);
  };

  return (
    <div className="simulation-frame-page">
      {/* Header */}
      <div className="sim-frame-header">
        <h1 className="sim-frame-title">{judul}</h1>
        <p className="sim-frame-desc">{deskripsi}</p>
      </div>

      {/* Iframe container */}
      <div className="sim-frame-container" style={{ height: tinggi }}>
        <iframe
          ref={iframeRef}
          src={`/simulations/${simulasiId}/index.html`}
          title={judul}
          className="sim-iframe"
          sandbox="allow-scripts allow-same-origin"
        />
        {showFullscreen && (
          <button
            className="btn-fullscreen"
            onClick={handleFullscreen}
            title={t('simulasi.tombol.layarPenuh')}
          >
            ⛶
          </button>
        )}
      </div>

      {/* Info edukatif di bawah iframe */}
      <div className="sim-frame-info container mt-3">
        <p className="sim-frame-note">
          <i className="bi bi-info-circle me-2"></i>
          {t('simulasi.catatan.interaktif')}
        </p>
      </div>
    </div>
  );
};

export default SimulationFrame;
```

```css
/* SimulationFrame.css */
.simulation-frame-page {
  padding: 20px 0;
  background: var(--bg-dark, #0a0e1a);
  min-height: 100vh;
}

.sim-frame-header {
  text-align: center;
  padding: 20px;
  margin-bottom: 16px;
}

.sim-frame-title {
  color: #00e5ff;
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.sim-frame-desc {
  color: #8aa8c0;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.sim-frame-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #2a4a6a;
  border-radius: 8px;
  overflow: hidden;
}

.sim-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #0a0e1a;
}

.btn-fullscreen {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(10,14,26,0.8);
  border: 1px solid #2a4a6a;
  color: #00e5ff;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.sim-frame-note {
  color: #8aa8c0;
  font-size: 0.9rem;
  text-align: center;
}
```

## Halaman Daftar Simulasi (SimulationList)

```javascript
// src/body/simulations/SimulationList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SimulationList.css';

// Data simulasi — tambahkan entry baru di sini
const SIMULASI_LIST = [
  {
    id: 'proteksi-radiasi',
    path: '/simulasi/proteksi-radiasi',
    icon: '☢',
    badge: 'tersedia',
    badgeColor: 'success',
  },
  {
    id: 'peluruhan',
    path: '/simulasi/peluruhan',
    icon: '⚛',
    badge: 'baru',
    badgeColor: 'primary',
  },
  // Tambah simulasi baru di sini
];

const SimulationList = () => {
  const { t } = useTranslation();

  return (
    <div className="simulation-list container py-5">
      <h1 className="text-center mb-5">{t('halaman.simulasi.judul')}</h1>
      <div className="row g-4">
        {SIMULASI_LIST.map(sim => (
          <div key={sim.id} className="col-md-6 col-lg-4">
            <Link to={sim.path} className="sim-card-link">
              <div className="sim-card">
                <div className="sim-card-icon">{sim.icon}</div>
                <h3 className="sim-card-title">
                  {t(`simulasi.${sim.id}.judul`)}
                </h3>
                <p className="sim-card-desc">
                  {t(`simulasi.${sim.id}.deskripsiSingkat`)}
                </p>
                <span className={`badge bg-${sim.badgeColor}`}>
                  {t(`badge.${sim.badge}`)}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationList;
```

## Penambahan Route di App.js

Setiap simulasi baru perlu didaftarkan:

```javascript
// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SimulationList from './body/simulations/SimulationList';
import GameArea from './body/game/GameArea';          // existing
import PeluruhanRadioaktif from './simulations/PeluruhanRadioaktif'; // baru

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ... routes lain ... */}
        <Route path="/simulasi" element={<SimulationList />} />
        <Route path="/simulasi/proteksi-radiasi" element={<GameArea />} />
        {/* Simulasi baru */}
        <Route path="/simulasi/peluruhan" element={<PeluruhanRadioaktif />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
```

## Konvensi i18next

### Struktur kunci terjemahan untuk simulasi:
```json
{
  "simulasi": {
    "{id-simulasi}": {
      "judul": "Nama Simulasi",
      "deskripsiSingkat": "Satu kalimat deskripsi",
      "deskripsiPanjang": "Paragraf penjelasan lengkap"
    }
  },
  "badge": {
    "tersedia": "Tersedia",
    "baru": "Baru",
    "segera": "Segera Hadir"
  },
  "tombol": {
    "mulai": "Mulai",
    "reset": "Reset",
    "jeda": "Jeda",
    "lanjut": "Lanjutkan",
    "layarPenuh": "Layar Penuh"
  }
}
```

## Checklist Komponen Baru

- [ ] Functional component dengan hooks
- [ ] Semua teks UI menggunakan `t()` dari react-i18next
- [ ] File CSS terpisah dengan nama class kebab-case
- [ ] useEffect cleanup untuk interval, event listener, RAF
- [ ] Export default di akhir file
- [ ] Didaftarkan di App.js routing (jika halaman baru)
- [ ] Entry terjemahan ditambah di file i18n
