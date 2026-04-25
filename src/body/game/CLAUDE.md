# CLAUDE.md — Simulation Engine (`src/body/game/`)

Ini adalah konteks khusus untuk mengerjakan komponen simulasi interaktif di direktori `src/body/game/` dan untuk membuat simulasi baru.

## Simulasi yang Ada

### `GameArea.js` — Simulasi ALARA (Proteksi Radiasi)

Komponen utama simulasi yang sudah berjalan. **Jangan ubah tanpa keperluan yang jelas.**

**Konsep yang disimulasikan:**
- Prinsip ALARA (As Low As Reasonably Achievable)
- Pengaruh **jarak** terhadap laju dosis (Hukum Kuadrat Terbalik)
- Pengaruh **perisai** (shielding dinding Pb) terhadap laju dosis
- Fluktuasi pembacaan detektor (noise statistik Gaussian)

**Cara kerja:**
1. User menggerakkan avatar (drag/click) di dalam "ruangan" 2D
2. Frontend menghitung jarak Euclidean: `√((x2-x1)² + (y2-y1)²)`
3. Frontend memanggil `POST /calculate` dengan jarak & status perisai
4. Backend mengembalikan `{level, std_dev}`
5. `setInterval(1000ms)` menerapkan fluktuasi Gaussian: `level + randomGaussian() × std_dev`
6. Laju dosis ditampilkan real-time

**Objek interaktif (dapat di-hover untuk info):**
- Sumber radiasi Cs-137
- Kontainer sumber
- Dinding perisai Pb

---

## Arsitektur Simulasi Baru — HTML5 Canvas (Pendekatan PhET)

Untuk simulasi baru di branch `newSimulation`, gunakan pendekatan **self-contained HTML5** yang diembed via `<iframe>`. Ini memungkinkan:
- Pengembangan & testing simulasi secara independen dari React
- Animasi performa tinggi via `requestAnimationFrame` tanpa overhead React re-render
- Simulasi dapat dibuka standalone (URL langsung)

### Lokasi File
```
public/
└── simulations/
    ├── radioactive-decay/
    │   ├── index.html    ← Simulasi lengkap (HTML + CSS + JS dalam satu file)
    │   └── assets/       ← Gambar/audio jika diperlukan
    └── nuclear-fission/
        └── index.html
```

### Template Simulasi HTML5

Setiap file `index.html` mengikuti template ini:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulasi [NAMA] — INITE</title>
  <style>
    /* ===== RESET & BASE ===== */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0e1a;  /* dark theme konsisten dengan INITE */
      color: #e0e8f0;
      font-family: 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    
    /* ===== CANVAS ===== */
    #sim-canvas {
      display: block;
      margin: auto;
    }
    
    /* ===== KONTROL PANEL ===== */
    .controls {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: rgba(10, 14, 26, 0.9);
      padding: 12px 20px;
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    /* ===== PANEL INFO ===== */
    .info-panel {
      position: fixed;
      top: 16px;
      right: 16px;
      background: rgba(10, 14, 26, 0.85);
      border: 1px solid #2a4a6a;
      border-radius: 8px;
      padding: 12px 16px;
      min-width: 200px;
    }
  </style>
</head>
<body>
  <canvas id="sim-canvas"></canvas>
  
  <!-- Panel informasi real-time -->
  <div class="info-panel" id="info-panel">
    <h3 class="panel-title">[Nama Simulasi]</h3>
    <div id="output-values"><!-- diisi JS --></div>
  </div>
  
  <!-- Kontrol interaktif -->
  <div class="controls">
    <!-- slider, button, dll. -->
  </div>
  
  <script>
    // ============================================================
    // KONFIGURASI SIMULASI
    // ============================================================
    const CONFIG = {
      FPS_TARGET: 60,
      // Konstanta fisika di sini
    };
    
    // ============================================================
    // STATE SIMULASI
    // ============================================================
    let state = {
      running: true,
      // variabel simulasi di sini
    };
    
    // ============================================================
    // SETUP CANVAS
    // ============================================================
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      const CONTROL_HEIGHT = 70;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - CONTROL_HEIGHT;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // ============================================================
    // FISIKA — FUNGSI UTAMA
    // Dokumentasikan rumus di CATATAN_PERHITUNGAN.md
    // ============================================================
    function updatePhysics(dt) {
      // dt = delta time dalam detik
    }
    
    // ============================================================
    // RENDERING
    // ============================================================
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      drawObjects();
      updateInfoPanel();
    }
    
    function drawBackground() {
      // grid atau background dekoratif
    }
    
    function drawObjects() {
      // gambar semua objek simulasi
    }
    
    function updateInfoPanel() {
      // update nilai real-time di panel info
    }
    
    // ============================================================
    // GAME LOOP
    // ============================================================
    let lastTime = 0;
    function gameLoop(timestamp) {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // max 50ms
      lastTime = timestamp;
      
      if (state.running) {
        updatePhysics(dt);
      }
      render();
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
    
    // ============================================================
    // EVENT HANDLERS
    // ============================================================
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    function handleCanvasClick(e) { /* ... */ }
    function handleMouseMove(e) { /* ... */ }
  </script>
</body>
</html>
```

---

## Panduan Desain Visual Simulasi

Pertahankan konsistensi visual dengan INITE:

| Elemen | Warna | Catatan |
|---|---|---|
| Background | `#0a0e1a` | Dark navy |
| Partikel Alpha | `#FFD700` | Kuning emas |
| Partikel Beta | `#00BFFF` | Biru cerah |
| Partikel Gamma | `#FF4500` | Oranye merah |
| Neutron | `#90EE90` | Hijau muda |
| Inti atom | `#FF6347` (proton), `#708090` (neutron) | |
| Panel info | `rgba(10,14,26,0.85)` border `#2a4a6a` | |
| Teks label | `#e0e8f0` | |
| Aksen/highlight | `#00e5ff` | Cyan INITE |

---

## Simulasi yang Direncanakan (Rencana Pengembangan)

### 1. Peluruhan Radioaktif (`radioactive-decay`)
- **Konsep**: Hukum peluruhan eksponensial, waktu paruh
- **Interaksi**: Pilih nuklida, atur jumlah atom awal, play/pause/reset
- **Visual**: Partikel atom berubah warna saat meluruh, grafik N(t) real-time
- **Fisika**: `N(t) = N₀ × e^(-λt)`, `λ = ln(2)/T½`
- **Backend**: Opsional (bisa dihitung di JS frontend)

### 2. Hamburan Rutherford (`rutherford-scattering`)
- **Konsep**: Struktur atom, gaya Coulomb, penemuan inti atom
- **Interaksi**: Tembakkan partikel Alpha, atur energi & sudut tembakan
- **Visual**: Lintasan partikel Alpha, defleksi oleh inti emas
- **Fisika**: Rumus hamburan Rutherford, gaya Coulomb

### 3. Jenis-jenis Radiasi (`radiation-types`)
- **Konsep**: Sifat penetrasi Alpha, Beta, Gamma
- **Interaksi**: Pilih jenis partikel, pilih material perisai, atur ketebalan
- **Visual**: Partikel menembus lapisan material, jangkauan berbeda-beda

### 4. Reaksi Fisi Nuklir (`nuclear-fission`)
- **Konsep**: Reaksi berantai, massa kritis
- **Interaksi**: Tembakkan neutron ke U-235, kontrol dengan batang kendali
- **Visual**: Pembelahan inti, neutron baru, reaksi berantai visual

---

## Checklist Simulasi Baru

- [ ] File di `public/simulations/{nama}/index.html`
- [ ] Menggunakan template warna dan dark theme INITE
- [ ] Konstanta fisika diberi nama dan komentar dengan satuan
- [ ] Rumus didokumentasikan di `CATATAN_PERHITUNGAN.md`
- [ ] Canvas responsive (resize listener)
- [ ] Delta time dipakai di game loop (bukan fixed timestep)
- [ ] Ada kontrol pause/play
- [ ] Ada panel informasi real-time
- [ ] Route baru didaftarkan di `src/App.js`
- [ ] `SimulationFrame` wrapper dibuat di `src/simulations/`
