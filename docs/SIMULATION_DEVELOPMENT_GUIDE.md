# Panduan Pengembangan Simulasi Baru — INITE

Dokumen ini menjelaskan langkah-langkah lengkap untuk menambahkan simulasi baru ke platform INITE, dari konsep hingga deployment.

---

## Arsitektur Pilihan: HTML5 Iframe (Direkomendasikan)

Simulasi baru INITE menggunakan pendekatan **self-contained HTML5 di-embed via `<iframe>`**, terinspirasi dari arsitektur PhET Interactive Simulations (University of Colorado Boulder).

**Keunggulan pendekatan ini:**
- Simulasi bisa dikembangkan dan ditest secara terpisah dari React
- Performa animasi optimal (tidak ada React re-render overhead)
- Simulasi dapat dibuka langsung via URL tanpa React app
- Lebih mudah dikerjakan oleh kontributor yang tidak familiar dengan React

**Alur data:**
```
React Router → SimulationFrame.js → <iframe> → public/simulations/{id}/index.html
                                                     ↓ (opsional)
                                               fetch → FastAPI Backend
```

---

## Langkah 1: Rencanakan Konsep Simulasi

Sebelum menulis kode, dokumentasikan:

```markdown
## Nama Simulasi: [nama]
**ID**: nama-dengan-tanda-hubung (untuk folder & URL)
**Konsep fisika**: [topik utama]
**Target audiens**: Masyarakat umum, siswa SMA/mahasiswa

### Tujuan Pembelajaran
Setelah menggunakan simulasi ini, pengguna memahami:
1. ...
2. ...

### Parameter Interaktif
| Parameter | Rentang | Default | Satuan |
|---|---|---|---|
| ... | ... | ... | ... |

### Output yang Ditampilkan
| Nilai | Satuan | Penjelasan |
|---|---|---|
| ... | ... | ... |

### Rumus Fisika Utama
- Rumus 1: `...` — [penjelasan]
- Rumus 2: `...` — [penjelasan]
- Sumber referensi: [IAEA/BAPETEN/buku teks]
```

---

## Langkah 2: Dokumentasikan Fisika

Tambahkan bagian baru di `CATATAN_PERHITUNGAN.md` (root project):

```markdown
## [Nomor]. Perhitungan [Nama Simulasi]

**Teori**: [penjelasan singkat fisika]

**Rumus**:
```
[rumus dengan notasi matematika]
```

**Parameter**:
- `N₀`: Jumlah atom awal
- `λ`: Konstanta peluruhan (s⁻¹) = ln(2) / T½
- `T½`: Waktu paruh (detik)

**Sumber**: [referensi]
```

---

## Langkah 3: Buat File Simulasi HTML5

**Lokasi**: `public/simulations/{simulation-id}/index.html`

Ikuti template di `src/body/game/CLAUDE.md`. Minimal harus ada:

1. **Canvas** — area simulasi utama
2. **Info panel** — nilai real-time (posisi kanan atas)
3. **Controls panel** — slider/button (posisi bawah)
4. **Game loop** dengan delta time
5. **Komentar fisika** di setiap fungsi kalkulasi

---

## Langkah 4: Buat React Wrapper

**Lokasi**: `src/simulations/{SimulationName}.js`

```javascript
import React from 'react';
import SimulationFrame from './SimulationFrame';
import { useTranslation } from 'react-i18next';

const PeluruhanRadioaktif = () => {
  const { t } = useTranslation();
  
  return (
    <SimulationFrame
      simulasiId="radioactive-decay"
      judul={t('simulasi.peluruhan.judul')}
      deskripsi={t('simulasi.peluruhan.deskripsi')}
      tinggi={600}
    />
  );
};

export default PeluruhanRadioaktif;
```

---

## Langkah 5: Tambahkan Route di App.js

```javascript
import PeluruhanRadioaktif from './simulations/PeluruhanRadioaktif';

// Di dalam <Routes>
<Route 
  path="/simulasi/peluruhan" 
  element={<PeluruhanRadioaktif />} 
/>
```

---

## Langkah 6: Tambahkan Terjemahan

Di file terjemahan i18next (`src/assets/locales/id.json`):

```json
{
  "simulasi": {
    "peluruhan": {
      "judul": "Simulasi Peluruhan Radioaktif",
      "deskripsi": "Jelajahi bagaimana inti atom tidak stabil meluruh seiring waktu"
    }
  }
}
```

---

## Langkah 7: Tambahkan Kartu di Halaman Simulasi

Tambahkan entry ke halaman daftar simulasi agar simulasi baru muncul di UI.

---

## Checklist Lengkap Simulasi Baru

### Perencanaan
- [ ] Konsep dan tujuan pembelajaran terdefinisi
- [ ] Rumus fisika didokumentasikan di `CATATAN_PERHITUNGAN.md`
- [ ] Nilai referensi dari sumber terpercaya (IAEA, BAPETEN)

### Pengembangan
- [ ] `public/simulations/{id}/index.html` dibuat
- [ ] Dark theme INITE diterapkan (background `#0a0e1a`)
- [ ] Canvas responsif (resize listener)
- [ ] Game loop menggunakan delta time
- [ ] Panel info menampilkan nilai real-time
- [ ] Kontrol (play/pause/reset) berfungsi
- [ ] Simulasi bisa dibuka langsung via `http://localhost:3000/simulations/{id}/`

### Integrasi React
- [ ] `src/simulations/{Name}.js` wrapper dibuat
- [ ] Route ditambah di `App.js`
- [ ] Terjemahan Bahasa Indonesia ditambah di i18n
- [ ] Simulasi muncul di halaman daftar simulasi

### Kualitas
- [ ] Tidak ada nilai fisika hardcoded tanpa konstanta bernama
- [ ] Komentar menjelaskan rumus dan satuan
- [ ] Test di berbagai ukuran layar (mobile-friendly)
- [ ] Tidak ada `console.log` debug yang tertinggal

---

## Konvensi Fisika

### Satuan Standar INITE

| Besaran | Satuan |
|---|---|
| Laju dosis | μSv/jam |
| Dosis efektif | mSv (per tahun) |
| Aktivitas | Bq atau kBq |
| Jarak | meter |
| Ketebalan perisai | cm |
| Waktu (simulasi) | detik atau tahun (tergantung konteks) |
| Energi partikel | MeV |
| Massa | u (atomic mass unit) |

### Batas Dosis Referensi (BAPETEN/IAEA)
```javascript
const BATAS_DOSIS = {
  masyarakatUmum: 1,      // mSv/tahun
  pekerjaMagang: 6,       // mSv/tahun
  pekerjaRadiasi: 20,     // mSv/tahun
  dosis_darurat: 100,     // mSv (intervensi darurat)
};
```
