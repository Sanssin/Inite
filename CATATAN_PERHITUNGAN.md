# Catatan Perhitungan dan Teori Simulasi Radiasi

Dokumen ini menjelaskan rumus dan teori di balik perhitungan yang digunakan dalam aplikasi simulasi radiasi ini. Tujuannya adalah untuk memberikan pemahaman yang jelas bagi pengembang di masa depan.

## Arsitektur Perhitungan: Model Hybrid

Sistem ini menggunakan model "hybrid" untuk menyeimbangkan akurasi fisika dengan efisiensi aplikasi web.
- **Backend (`api/main.py`):** Bertindak sebagai "mesin fisika". Ia melakukan semua perhitungan yang statis untuk satu kondisi tertentu, termasuk laju dosis dan parameter fluktuasi.
- **Frontend (`src/body/game/GameArea.js`):** Bertindak sebagai "mesin render real-time". Ia menghitung jarak, mengirimkannya ke backend, lalu menerima hasil perhitungan untuk ditampilkan dengan fluktuasi setiap detik.

---

## 1. Perhitungan Jarak Avatar dari Sumber (Frontend)

Perhitungan ini dilakukan di **frontend** sesaat sebelum memanggil API backend.

- **Teori:** Teorema Pythagoras (Rumus Jarak Euclidean).
- **Deskripsi:** Menghitung jarak garis lurus antara dua titik pada bidang 2D.
- **Rumus:** `jarak = √((x₂ - x₁)² + (y₂ - y₁)²)`.
- **Implementasi (`GameArea.js`):**
  ```javascript
  const dx = avatarCoord.x - sourcePosition.x;
  const dy = avatarCoord.y - sourcePosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  ```

---

## 2. Perhitungan Laju Dosis & Standar Deviasi (Backend)

Logika fisika utama terpusat di **backend**.

- **Teori:**
  1.  **Hukum Kuadrat Terbalik & Pelemahan Radiasi.**
  2.  **Statistik Peluruhan (Distribusi Gaussian):** Fluktuasi dalam pengukuran sebanding dengan akar kuadrat dari laju kejadian.
- **Input API:** `distance`, `shield_thickness`, `source_type`, `activity`.
- **Proses di Backend:**
  1.  **Menghitung Laju Dosis Dasar:**
     ```python
     dose_rate = (activity_factor / (distance**2)) * (0.5 ** (shield_thickness / HVL_PB))
     ```
  2.  **Menghitung Standar Deviasi:**
     ```python
     std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)
     ```
- **Output API:** Mengirim paket data yang berisi hasil perhitungan.
  ```json
  {
    "level": 15.73,      // Laju dosis dasar
    "std_dev": 0.1586,   // Standar deviasi untuk fluktuasi
    "description": "..." // Deskripsi status
  }
  ```

---

## 3. Penerapan Fluktuasi Real-time (Frontend)

**Frontend** menerapkan fluktuasi berdasarkan "resep" yang diterima dari backend.

- **Teori:** Pembangkitan Angka Acak Gaussian.
- **Proses:**
  1.  Simpan `level` (sebagai `baseDoseRate`) dan `std_dev` (sebagai `fluctuationStdDev`) dari API.
  2.  Gunakan `setInterval` untuk memicu pembaruan setiap 1 detik.
  3.  Di setiap interval, hitung nilai yang akan ditampilkan:
     ```javascript
     const randomValue = gaussianRandom(); // Angka acak murni (std_dev = 1)
     const fluctuation = randomValue * fluctuationStdDev; // Skalakan dengan std_dev dari backend
     const fluctuatingLevel = baseDoseRate + fluctuation;
     ```