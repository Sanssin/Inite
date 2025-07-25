# Catatan Perhitungan dan Teori Simulasi Radiasi

Dokumen ini menjelaskan rumus dan teori di balik perhitungan yang digunakan dalam aplikasi simulasi radiasi ini. Tujuannya adalah untuk memberikan pemahaman yang jelas bagi pengembang di masa depan.

## 1. Perhitungan Jarak Avatar dari Sumber

Perhitungan jarak antara avatar dan sumber radiasi dilakukan di sisi frontend (`src/body/game/GameArea.js`).

- **Teori:** Teorema Pythagoras (atau Rumus Jarak Euclidean).
- **Deskripsi:** Untuk menemukan jarak garis lurus (jarak terpendek) antara dua titik pada bidang 2D, kita menggunakan Teorema Pythagoras. Jarak ini merepresentasikan bagaimana radiasi memancar lurus dari sumber ke target.
- **Rumus:**
  ```
  jarak = √((x₂ - x₁)² + (y₂ - y₁)²)
  ```
- **Implementasi dalam Kode:**
  ```javascript
  // dx adalah selisih di sumbu x
  const dx = newCoordinate.x - sourcePosition.x;
  // dy adalah selisih di sumbu y
  const dy = newCoordinate.y - sourcePosition.y;
  // Jarak dihitung dengan rumus Pythagoras
  const distance = Math.sqrt(dx * dx + dy * dy);
  ```

---

## 2. Perhitungan Laju Dosis Radiasi

Perhitungan laju dosis dilakukan di sisi backend (`api/main.py`) untuk memastikan konsistensi dan sentralisasi logika fisika.

- **Teori:** Hukum Kuadrat Terbalik (Inverse Square Law) dan Pelemahan Radiasi (Radiation Attenuation/Shielding).
- **Deskripsi:**
  1.  **Hukum Kuadrat Terbalik:** Intensitas radiasi berbanding terbalik dengan kuadrat jarak dari sumber. Artinya, jika jarak menjadi 2x lebih jauh, intensitas radiasi turun menjadi 1/4.
  2.  **Pelemahan (Shielding):** Ketika radiasi melewati materi (seperti perisai timbal), intensitasnya akan berkurang secara eksponensial tergantung pada ketebalan dan jenis materi tersebut. Konsep *Half-Value Layer* (HVL) digunakan untuk ini. HVL adalah ketebalan material yang dibutuhkan untuk mengurangi intensitas radiasi menjadi setengahnya.
- **Rumus Gabungan:**
  ```
  LajuDosis = (K / Jarak²) * (0.5 ^ (KetebalanPerisai / HVL))
  ```
  - `K`: Konstanta yang menggabungkan aktivitas sumber dan konstanta gamma.
  - `Jarak`: Jarak dari sumber yang dihitung di frontend.
  - `KetebalanPerisai`: Ketebalan perisai (dalam cm).
  - `HVL`: *Half-Value Layer* dari material perisai (dalam cm).
- **Implementasi dalam Kode (`main.py`):**
  ```python
  # Konstanta gabungan (Aktivitas Sumber * Konstanta Gamma)
  ACTIVITY_FACTOR = (GAMMA_CONSTANT * (SOURCE_ACTIVITY / 1000)) * 1000000

  # Rumus Laju Dosis
  dose_rate = (ACTIVITY_FACTOR / (distance ** 2)) * (0.5**(shield_thickness / HVL_PB))
  ```

---

## 3. Fluktuasi Nilai Laju Dosis

Untuk meniru sifat acak dari detektor radiasi di dunia nyata, nilai laju dosis dibuat berfluktuasi di sisi frontend (`src/body/game/GameArea.js`).

- **Teori:** Distribusi Normal (Gaussian).
- **Deskripsi:** Pembacaan alat ukur radiasi selalu memiliki sedikit fluktuasi acak di sekitar nilai rata-rata yang sebenarnya. Distribusi Gaussian adalah model statistik yang sangat baik untuk menggambarkan fluktuasi acak semacam ini. Metode *Box-Muller Transform* digunakan untuk menghasilkan angka acak yang mengikuti distribusi ini.
- **Rumus:**
  ```
  NilaiTampil = NilaiDasar + AngkaAcakGaussian
  ```
  - `NilaiDasar`: Laju dosis yang dihitung oleh backend.
  - `AngkaAcakGaussian`: Nilai acak kecil yang dihasilkan di frontend.
- **Implementasi dalam Kode:**
  - `setInterval` digunakan untuk memicu pembaruan setiap 1 detik.
  - Di setiap pembaruan, fungsi `gaussianRandom()` menghasilkan nilai acak baru yang ditambahkan ke `baseDoseRate` (nilai dasar dari server).
  ```javascript
  // Dijalankan setiap 1 detik
  const fluctuatingLevel = baseDoseRate + gaussianRandom();

  // Memperbarui nilai yang ditampilkan di UI
  setMessage(prev => ({
    ...prev,
    level: fluctuatingLevel.toFixed(2)
  }));
  ```
