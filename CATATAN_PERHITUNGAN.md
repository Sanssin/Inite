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

---

## 4. Dataset Radioisotop Tambahan (U-235, Th-232, Pu-239, I-131)

Bagian ini mendokumentasikan data referensi yang dipakai saat menambah model isotop baru pada backend.

### 4.1 Waktu paruh dan energi gamma representatif

Referensi:
- IAEA Livechart API (ground states dan decay radiations)
  - https://www-nds.iaea.org/relnsd/vcharthtml/api_v0_guide.html
  - contoh query: `fields=ground_states&nuclides=235u`
  - contoh query: `fields=decay_rads&nuclides=131i&rad_types=g`

Nilai yang dipakai:
- **U-235**: t1/2 = 7.04E+8 tahun; gamma representatif 185.7 keV (garis 185.713 keV)
- **Th-232**: t1/2 = 1.40E+10 tahun; gamma representatif 63.8 keV
- **Pu-239**: t1/2 = 24110 tahun; gamma representatif 51.6 keV
- **I-131**: t1/2 = 8.0252 hari; gamma representatif 364.5 keV (garis 364.489 keV)

### 4.2 Gamma dose constant (faktor gamma)

Referensi:
- Gamma Ray Dose Constants (RadResponder / ROSS Toolkit)
  - https://externaltools.radresponder.net/rosstoolkit/docs/Gamma-Ray-Dose-Constants.pdf

Satuan tabel sumber: **Rem/hr** pada jarak **1 meter** dari sumber titik **1 Ci**.

Nilai yang dipakai:
- **U-235**: 0.338883
- **Th-232**: 0.068376
- **Pu-239**: 0.0301365
- **I-131**: 0.282939

### 4.3 Model shielding: koefisien atenuasi linier dan HVL

Referensi data `mu/rho`:
- NIST X-Ray Mass Attenuation Coefficients
  - indeks material: https://physics.nist.gov/PhysRefData/XrayMassCoef/tab4.html
  - lead (Pb): https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z82.html
  - steel (aproksimasi Fe): https://physics.nist.gov/PhysRefData/XrayMassCoef/ElemTab/z26.html
  - concrete: https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/concrete.html
  - lead glass: https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/glass.html

Rumus konversi:
```text
mu_linear (cm^-1) = (mu/rho) (cm^2/g) x rho (g/cm^3)
HVL (cm) = ln(2) / mu_linear
```

Catatan:
- `mu/rho` diinterpolasi linier pada energi gamma representatif isotop.
- densitas yang dipakai: Pb = 11.34, Concrete = 2.3, Lead Glass = 6.22, Steel = 7.85 (g/cm^3).

Hasil koefisien `mu_linear` untuk isotop baru:
- **U-235**: Pb 14.6165, Concrete 0.3050, Lead Glass 6.2303, Steel 1.2593
- **Th-232**: Pb 51.3171, Concrete 0.5835, Lead Glass 21.5644, Steel 8.5473
- **Pu-239**: Pb 85.6233, Concrete 0.7567, Lead Glass 35.8393, Steel 14.4103
- **I-131**: Pb 3.3221, Concrete 0.2347, Lead Glass 1.5241, Steel 0.7822
