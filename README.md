# Inite - Simulasi Interaktif Laju Dosis Radiasi

Inite adalah sebuah aplikasi web interaktif yang dirancang untuk menyimulasikan bagaimana laju dosis radiasi diterima oleh seseorang (diwakili oleh avatar) pada jarak dan kondisi yang berbeda dari sebuah sumber radiasi. Aplikasi ini bertujuan untuk memberikan pemahaman yang intuitif mengenai konsep proteksi radiasi, seperti pengaruh jarak dan perisai (shielding).

## ✨ Fitur Utama

- **Simulasi Interaktif**: Gerakkan avatar di dalam sebuah ruangan untuk melihat perubahan laju dosis radiasi secara *real-time*.
- **Perhitungan Laju Dosis**: Laju dosis dihitung berdasarkan jarak avatar dari sumber radiasi (Cs-137) dan keberadaan perisai.
- **Visualisasi Perisai (Shielding)**: Terdapat area perisai (dinding Pb) yang akan mengurangi laju dosis radiasi jika avatar berada di belakangnya.
- **Informasi Tambahan**: Objek-objek di dalam simulasi (sumber, kontainer, perisai) dapat di-hover untuk menampilkan informasi detail.
- **Backend Terpisah**: Perhitungan fisika radiasi dilakukan oleh backend Python (FastAPI) untuk akurasi dan modularitas.

## 💻 Tumpukan Teknologi (Tech Stack)

- **Frontend**: React.js
- **Backend**: Python dengan framework FastAPI
- **Styling**: CSS Murni

## ⚙️ Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [Python](https://www.python.org/downloads/) (v3.7 atau lebih baru)
- `pip` (manajer paket Python)

## 🚀 Instalasi dan Menjalankan Proyek

Untuk menjalankan proyek ini, Anda perlu menjalankan dua komponen secara terpisah: **server backend** dan **aplikasi frontend**.

### 1. Menjalankan Backend (Server FastAPI)

Buka terminal baru dan ikuti langkah-langkah berikut:

```bash
# 1. Masuk ke direktori root proyek
cd /path/to/Inite

# 2. Masuk ke direktori API
cd api

# 3. Buat dan aktifkan virtual environment (opsional namun direkomendasikan)
python -m venv venv
source venv/bin/activate  # Pada Windows, gunakan `venv\Scripts\activate`

# 4. Instal semua dependensi yang dibutuhkan
pip install -r ../requirements.txt

# 5. Jalankan server FastAPI
# Server akan berjalan di http://localhost:8000
uvicorn main:app --reload
```

Biarkan terminal ini tetap berjalan.

### 2. Menjalankan Frontend (Aplikasi React)

Buka terminal **kedua** dan ikuti langkah-langkah berikut:

```bash
# 1. Masuk ke direktori root proyek
cd /path/to/Inite

# 2. Instal semua dependensi Node.js
npm install

# 3. Jalankan aplikasi React
# Aplikasi akan terbuka secara otomatis di browser pada http://localhost:3000
npm start
```

Setelah kedua komponen berjalan, buka `http://localhost:3000` di browser Anda untuk memulai simulasi.

## 📂 Struktur Proyek

Berikut adalah gambaran singkat mengenai struktur direktori dan file penting dalam proyek ini:

```
Inite/
├── api/
│   └── main.py         # Logika backend (server FastAPI) untuk perhitungan dosis
├── public/             # Aset statis dan file index.html utama
├── src/
│   ├── assets/         # Gambar dan ikon yang digunakan di frontend
│   ├── body/
│   │   └── game/
│   │       └── GameArea.js # Komponen utama untuk logika simulasi dan interaksi
│   ├── components/     # Komponen React yang dapat digunakan kembali (Navbar, Footer)
│   ├── App.js          # Komponen utama aplikasi dan routing
│   └── index.js        # Titik masuk utama untuk aplikasi React
├── package.json        # Daftar dependensi dan skrip untuk frontend
└── requirements.txt    # Daftar dependensi untuk backend
```
