# CLAUDE.md — Project INITE: Indonesian Nuclear Interactive Website

## Identitas Proyek

**INITE** adalah platform edukasi nuklir berbasis web yang menyajikan simulasi fisika nuklir interaktif untuk masyarakat umum Indonesia. Website ini dikelola oleh Politeknik Teknologi Nuklir Indonesia (Polteknuklir).

- **URL Produksi**: https://inite-polteknuklir.site
- **Repository**: https://github.com/Sanssin/Inite
- **Branch utama**: `main` (stabil, production)
- **Branch aktif**: `newSimulation` (pengembangan simulasi baru)
- **Bahasa target**: Bahasa Indonesia (primer), Inggris (sekunder via i18next)

---

## Tech Stack Lengkap

### Frontend
| Teknologi | Versi | Peran |
|---|---|---|
| React | 18.3.1 | UI framework utama |
| react-router-dom | 6.x | Client-side routing |
| Bootstrap | 5.3.3 | Styling & layout |
| react-bootstrap | 2.10.3 | Bootstrap components untuk React |
| i18next + react-i18next | 23.x / 14.x | Internasionalisasi (id/en) |
| AOS | 3.0.0-beta | Scroll animations |
| animate.css | 4.1.1 | CSS animations |
| Firebase | 11.10.0 | Backend services (auth/db jika digunakan) |
| HTML5 Canvas API | native | Simulasi baru (PhET-style) |

### Backend
| Teknologi | Versi | Peran |
|---|---|---|
| Python | 3.7+ | Runtime |
| FastAPI | latest | REST API framework |
| Uvicorn | latest | ASGI server |

### Tooling
- **Build**: `react-scripts` (Create React App)
- **Issue Tracking**: `bd` (beads)
- **Proxy**: Frontend dev `localhost:3000` → Backend `localhost:8000` (via `package.json` proxy)

---

## Arsitektur Sistem

```
Browser (React App)
│
├── /simulasi/alara          → GameArea.js (simulasi existing)
├── /simulasi/{nama-baru}    → SimulationFrame.js (embed HTML5)
│
▼
FastAPI Backend (Python)
│
├── POST /calculate          → Kalkulasi laju dosis (simulasi ALARA)
└── POST /{simulasi}/calc    → Kalkulasi simulasi lain (di masa depan)
```

### Model Hybrid (Arsitektur Perhitungan)
- **Backend**: Menghitung nilai fisika statis (dose_rate, std_dev) berdasarkan input satu kondisi
- **Frontend**: Menghitung jarak dinamis (Euclidean), menerapkan fluktuasi Gaussian setiap 1 detik via `setInterval`

---

## Struktur Direktori

```
Inite/
├── CLAUDE.md                          ← (file ini)
├── AGENTS.md                          ← Instruksi workflow agent/git
├── CATATAN_PERHITUNGAN.md             ← Referensi rumus fisika (penting!)
├── api/
│   ├── main.py                        ← FastAPI server, semua logika fisika backend
│   └── CLAUDE.md                      ← Konteks backend untuk agent
├── public/
│   ├── index.html
│   └── simulations/                   ← [RENCANA] HTML5 standalone simulations
│       └── {nama-simulasi}/
│           └── index.html
├── src/
│   ├── App.js                         ← Routing utama
│   ├── index.js                       ← Entry point
│   ├── assets/                        ← Gambar, ikon
│   ├── components/                    ← Shared: Navbar, Footer
│   ├── body/
│   │   └── game/
│   │       ├── GameArea.js            ← Komponen simulasi ALARA (existing)
│   │       └── CLAUDE.md             ← Konteks simulasi engine
│   └── CLAUDE.md                      ← Konteks frontend
├── docs/
│   ├── SIMULATION_DEVELOPMENT_GUIDE.md ← Panduan buat simulasi baru
│   └── skills/                        ← Skill files untuk AI agents
│       ├── html5-simulation/SKILL.md
│       ├── nuclear-physics/SKILL.md
│       └── inite-component/SKILL.md
└── .github/
    └── copilot-instructions.md        ← Instruksi untuk GitHub Copilot
```

---

## Konvensi Kode

### Penamaan
- **Komponen React**: PascalCase (`GameArea.js`, `SimulationFrame.js`)
- **CSS**: kebab-case class (`game-area`, `dose-display`)
- **Fungsi**: camelCase (`calculateDose`, `handleAvatarMove`)
- **Konstanta fisika**: SCREAMING_SNAKE_CASE (`HVL_PB`, `FLUCTUATION_FACTOR`)
- **File simulasi HTML5**: kebab-case folder (`radioactive-decay/index.html`)

### Gaya Kode
- Tidak ada TypeScript wajib (TypeScript tersedia sebagai devDependency tapi opsional)
- Gunakan functional components + React Hooks (bukan class components)
- CSS murni untuk styling komponen simulasi; Bootstrap untuk layout halaman
- Komentar dalam Bahasa Indonesia untuk logika domain nuklir, Inggris untuk logika teknis umum

### Routing (react-router-dom v6)
```javascript
// Pattern routing simulasi
/simulasi/proteksi-radiasi   → Simulasi ALARA (existing)
/simulasi/peluruhan          → Simulasi baru (rencana)
/simulasi/fisi               → Simulasi baru (rencana)
```

---

## Panduan Penting untuk Agent

### ⚠️ JANGAN LAKUKAN
- Jangan ubah logika fisika di `api/main.py` tanpa mendokumentasikan perubahan di `CATATAN_PERHITUNGAN.md`
- Jangan hapus atau ubah simulasi ALARA yang sudah ada di `main` branch
- Jangan commit ke `main` langsung — selalu gunakan `newSimulation` atau branch baru
- Jangan gunakan nilai fisika hardcoded tanpa konstanta bernama
- Jangan buat simulasi baru di React yang menggantikan `<canvas>` dengan DOM biasa untuk animasi frame-rate tinggi

### ✅ SELALU LAKUKAN
- Baca `CATATAN_PERHITUNGAN.md` sebelum mengerjakan apapun yang berkaitan dengan fisika nuklir
- Baca subfolder `CLAUDE.md` yang relevan sebelum mulai mengerjakan area tersebut
- Gunakan `bd` (beads) untuk issue tracking sesuai `AGENTS.md`
- Test backend (`uvicorn api/main.py`) sebelum mengintegrasikan ke frontend
- Dokumentasikan rumus baru di `CATATAN_PERHITUNGAN.md`
- Pertahankan dukungan i18next untuk setiap teks yang ditampilkan ke user

### ��� Konteks Domain Nuklir
INITE adalah platform edukasi resmi institusi nuklir. Semua nilai fisika harus:
- Akurat secara ilmiah (referensi: IAEA, BAPETEN, atau literatur standar)
- Dilengkapi satuan yang benar (μSv/jam, mSv/tahun, Bq, dll.)
- Disertai penjelasan edukatif dalam Bahasa Indonesia yang mudah dipahami publik umum

---

## Cara Menjalankan Proyek (Development)

```bash
# Terminal 1: Backend
cd api
python -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
uvicorn main:app --reload
# → berjalan di http://localhost:8000

# Terminal 2: Frontend
npm install
npm start
# → berjalan di http://localhost:3000
```

---

## Skill Files Tersedia

Untuk tugas-tugas spesifik, baca skill yang relevan di `docs/skills/`:

| Skill | Kapan digunakan |
|---|---|
| `html5-simulation/SKILL.md` | Membuat simulasi HTML5 Canvas baru |
| `nuclear-physics/SKILL.md` | Implementasi kalkulasi fisika nuklir |
| `inite-component/SKILL.md` | Membuat React component baru sesuai konvensi INITE |
