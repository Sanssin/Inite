# Panduan Menjalankan API Python dengan Gunicorn dan Systemd

Panduan ini menjelaskan cara menjalankan aplikasi API Python Anda secara terus-menerus di background dan memastikan aplikasi tersebut otomatis restart jika terjadi crash.

---

## Langkah 1: Install Gunicorn

Pastikan Anda berada di dalam virtual environment proyek Anda, lalu install Gunicorn.

```bash
# Aktifkan virtual environment
source /home/sanssin/project/Inite/myenv/bin/activate

# Install Gunicorn
pip install gunicorn
```

## Langkah 2: Buat File Service untuk Systemd

`systemd` menggunakan file `.service` untuk mengelola sebuah proses. Kita akan membuat satu untuk API kita.

Buat dan buka file service baru dengan nano:
```bash
sudo nano /etc/systemd/system/inite-api.service
```

Salin dan tempel (paste) konfigurasi di bawah ini ke dalamnya. Konfigurasi ini memberitahu `systemd` cara menjalankan, mengelola, dan me-restart Gunicorn.

```ini
[Unit]
Description=Gunicorn instance to serve Inite API
# Memastikan service ini berjalan setelah network aktif
After=network.target

[Service]
# User dan Group yang akan menjalankan proses ini
# Menggunakan user Anda (bukan root) adalah praktik keamanan yang baik
User=sanssin
Group=www-data

# Direktori kerja tempat API Anda berada
WorkingDirectory=/home/sanssin/project/Inite/api

# Path ke Gunicorn di dalam virtual environment Anda
# Ini adalah baris yang sangat penting
# Path ke Gunicorn, dengan Uvicorn sebagai worker class untuk kompatibilitas ASGI (FastAPI)
ExecStart=/home/sanssin/project/Inite/myenv/bin/gunicorn -k uvicorn.workers.UvicornWorker --workers 3 --bind 127.0.0.1:8000 main:app

# Kebijakan restart: akan selalu mencoba restart jika proses gagal/crash
Restart=always

[Install]
WantedBy=multi-user.target
```

**Penjelasan Konfigurasi `ExecStart`:**
*   `--workers 3`: Aturan umumnya adalah `(2 x jumlah core CPU) + 1`. Karena Anda punya 1 vCPU, 3 adalah jumlah worker yang baik untuk memulai.
*   `--bind 127.0.0.1:8000`: Gunicorn akan berjalan di port 8000 dan hanya menerima koneksi dari dalam VPS itu sendiri (localhost). Ini aman karena hanya Nginx yang akan berkomunikasi dengannya.
*   `main:app`: Gunicorn akan mencari file `main.py` dan menjalankan objek aplikasi bernama `app` di dalamnya. (Asumsi nama objek aplikasi Anda adalah `app`).

Simpan file dan keluar dari `nano` (`Ctrl+X`, `Y`, `Enter`).

## Langkah 3: Jalankan dan Aktifkan Service

Sekarang, kita akan memberitahu `systemd` untuk memulai dan mengaktifkan service baru ini.

1.  **Mulai service `inite-api` sekarang juga:**
    ```bash
    sudo systemctl start inite-api
    ```

2.  **Aktifkan service agar otomatis berjalan saat boot/reboot:**
    ```bash
    sudo systemctl enable inite-api
    ```

## Langkah 4: Verifikasi Status Service

Untuk memastikan service Anda berjalan dengan baik, gunakan perintah status.

```bash
sudo systemctl status inite-api
```

Anda akan melihat output berwarna hijau dengan tulisan `active (running)` jika semuanya berjalan lancar. Anda juga bisa melihat beberapa baris log terakhir dari Gunicorn di sini.

Jika ada masalah, output dari perintah ini akan memberikan petunjuk tentang apa yang salah (misalnya path salah, error di kode Python, dll).

---

**Selesai!** Dengan konfigurasi ini, API Python Anda sekarang menjadi sebuah service yang tangguh di dalam sistem Linux Anda.
