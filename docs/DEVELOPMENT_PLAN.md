# Rencana Pengembangan INITE — Simulasi Baru & Saran Teknis

Dokumen ini merangkum rencana pengembangan simulasi baru dan saran arsitektur untuk tim INITE.

---

## Rekomendasi Arsitektur: HTML5 Canvas Iframe

### Mengapa Pendekatan Ini (Seperti PhET)?

PhET Interactive Simulations (Univ. Colorado) adalah referensi terbaik untuk simulasi fisika edukatif berbasis web. Mereka menggunakan HTML5 + JavaScript murni dengan beberapa pelajaran penting:

| Aspek | PhET | Rekomendasi INITE |
|---|---|---|
| Runtime | HTML5 Canvas + JS | HTML5 Canvas + JS (sama) |
| Arsitektur | Self-contained HTML file | Self-contained di `public/simulations/` |
| Integrasi | Standalone | Embed via `<iframe>` di React |
| Physics engine | Custom (Scenery lib) | Native Canvas + custom per simulasi |
| Backend | Tidak ada | FastAPI Python (untuk kalkulasi berat) |

### Kelebihan vs Alternatif

**HTML5 Canvas Iframe (Direkomendasikan):**
- ✅ Simulasi bisa dikembangkan independen dari React
- ✅ Performa animasi optimal (60 FPS tanpa React overhead)
- ✅ Bisa dibuka sebagai standalone URL
- ✅ Developer tidak perlu tahu React untuk kontribusi simulasi
- ⚠️ Komunikasi antara simulasi dan React memerlukan `window.postMessage`

**React + Canvas Component (Alternatif):**
- ✅ Terintegrasi penuh dengan React state dan routing
- ✅ Akses langsung ke i18n, auth, dan state global
- ❌ Developer perlu tahu React untuk buat simulasi
- ❌ React re-render bisa mengganggu animasi jika tidak dikelola hati-hati

**Rekomendasi**: Gunakan **iframe** untuk simulasi animasi baru, dan sisakan React canvas untuk fitur interaktif sederhana (grafik, chart).

---

## Roadmap Simulasi yang Diusulkan

### Prioritas 1 — Paling Relevan dengan Kurikulum Nuklir

#### ��� Peluruhan Radioaktif (`radioactive-decay`)
**Konsep**: Hukum peluruhan eksponensial, waktu paruh (T½)
**Nilai edukasi**: Fundamental — semua topik nuklir berawal dari ini
**Tingkat kesulitan**: ⭐⭐

Fitur:
- Pilih nuklida (Cs-137, I-131, C-14, Ra-226, dll.)
- Atur jumlah atom awal (slider)
- Animasi atom meluruh satu per satu (probabilistik) + grafik N(t) real-time
- Tampilkan T½ dan perbandingan "waktu nyata vs skala simulasi"
- Kontrol kecepatan simulasi (×1, ×100, ×1000)

Fisika: `N(t) = N₀ × e^(-λt)`, `λ = ln(2)/T½`

---

#### ��� Jenis-jenis Radiasi (`radiation-types`)
**Konsep**: Perbedaan sifat Alpha, Beta, Gamma dalam menembus materi
**Nilai edukasi**: Sangat intuitif untuk masyarakat umum
**Tingkat kesulitan**: ⭐⭐

Fitur:
- Pilih jenis partikel (α, β⁻, γ)
- Pilih material perisai (kertas, aluminium, beton, timbal)
- Animasi partikel berjalan dan berhenti/menembus di material
- Tooltip penjelasan setiap kombinasi

Fisika: Range partikel Alpha, atenuasi Beta, koefisien μ Gamma

---

#### ��� Hamburan Rutherford (`rutherford-scattering`)
**Konsep**: Penemuan inti atom, gaya Coulomb, struktur atom
**Nilai edukasi**: Sejarah sains yang divisualisasikan
**Tingkat kesulitan**: ⭐⭐⭐

Fitur:
- "Tembakkan" partikel Alpha ke lembaran tipis Emas
- Lintasan partikel dibelokkan tergantung parameter impak (b)
- Histogram distribusi sudut hamburan real-time
- Mode: satu partikel vs banyak partikel serentak

Fisika: `tan(θ/2) = (Z₁Z₂e²) / (4πε₀ × E × b)` (rumus Rutherford)

---

### Prioritas 2 — Menarik & Relevan

#### ��� Reaktor Nuklir Sederhana (`nuclear-reactor`)
**Konsep**: Reaksi berantai, kontrol reaktor, massa kritis
**Nilai edukasi**: Tinggi — relevan dengan konteks Polteknuklir
**Tingkat kesulitan**: ⭐⭐⭐⭐

Fitur:
- Grid inti U-235 dalam moderator
- Tembakkan neutron, lihat reaksi berantai
- Kontrol dengan "batang kendali" (slider)
- Indikator faktor k (sub/kritis/superkritis)

---

#### ��� Detektor Radiasi (`radiation-detector`)
**Konsep**: Cara kerja detektor Geiger-Müller
**Nilai edukasi**: Relevan dengan praktik lapangan Polteknuklir
**Tingkat kesulitan**: ⭐⭐

Fitur:
- Animasi gas terionisasi di dalam tabung GM
- Sinyal pulsa yang ditampilkan (seperti osiloskop)
- Hubungkan dengan simulasi ALARA yang sudah ada

---

## Saran Teknis Lainnya

### 1. Konsolidasi Backend — Pertimbangkan "Physics API"

Saat simulasi bertambah, pertimbangkan untuk merefaktor backend menjadi lebih modular:

```
api/
├── main.py                 ← App FastAPI + CORS (orchestrator)
├── physics/
│   ├── __init__.py
│   ├── alara.py            ← Logika ALARA (existing)
│   ├── decay.py            ← Peluruhan radioaktif
│   └── shielding.py        ← Atenuasi perisai
└── models/
    ├── inputs.py           ← Pydantic request models
    └── outputs.py          ← Pydantic response models
```

### 2. Untuk Simulasi Tanpa Backend

Simulasi seperti Peluruhan Radioaktif dan Hamburan Rutherford bisa dihitung **sepenuhnya di frontend** (JS) karena kalkulasinya tidak berat. Ini mengurangi ketergantungan pada backend Python dan membuat simulasi bisa berjalan offline.

Gunakan backend Python hanya untuk:
- Kalkulasi yang sangat berat (Monte Carlo, transport partikel)
- Data yang butuh validasi ketat dari database nuklida
- Kalkulasi yang butuh library Python spesifik (scipy, numpy)

### 3. Komunikasi iframe ↔ React (postMessage)

Jika simulasi HTML5 perlu berinteraksi dengan halaman React (misalnya update judul halaman, kirim data ke Firebase):

```javascript
// Di dalam simulasi HTML5 (public/simulations/.../index.html)
window.parent.postMessage({
  type: 'SIMULATION_DATA',
  payload: { score: 85, completed: true }
}, '*');

// Di React wrapper (SimulationFrame.js)
useEffect(() => {
  const handler = (e) => {
    if (e.data.type === 'SIMULATION_DATA') {
      // handle data dari simulasi
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, []);
```

### 4. SEO & Metadata Simulasi

Setiap halaman simulasi sebaiknya punya metadata yang baik:

```javascript
// Di setiap halaman simulasi React
useEffect(() => {
  document.title = `${t('simulasi.peluruhan.judul')} — INITE`;
}, [t]);
```

### 5. Mobile Responsiveness Simulasi

Untuk simulasi yang berjalan di iframe, tambahkan meta viewport yang benar dan deteksi orientasi:

```javascript
// Di dalam index.html simulasi
if (window.innerWidth < 768) {
  // Mode mobile: sederhanakan UI, kurangi jumlah partikel
  CONFIG.MAX_PARTICLES = 50; // vs 200 di desktop
}
```

---

## Timeline Pengembangan yang Disarankan

```
Phase 1 (Fondasi) — Branch: newSimulation
├── Setup dokumentasi (file ini + CLAUDE.md + skills)
├── Buat SimulationFrame.js component
├── Buat halaman daftar simulasi
└── Setup folder public/simulations/

Phase 2 (Simulasi Pertama) — Branch: newSimulation
├── Simulasi Peluruhan Radioaktif (HTML5)
├── Integrasi ke React + routing
└── Tambah endpoint backend (opsional untuk peluruhan)

Phase 3 (Simulasi Kedua) — Branch: sim/radiation-types
└── Simulasi Jenis-jenis Radiasi

Phase 4 (Kompleks) — Branch: sim/rutherford
└── Hamburan Rutherford

Merge ke main setelah setiap phase selesai dan stabil.
```
