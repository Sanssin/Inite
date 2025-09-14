# Panduan Konfigurasi dan Deployment Proyek Inite dengan Nginx di VPS

Dokumen ini berisi langkah-langkah untuk melakukan deployment aplikasi web (Frontend React + Backend Python) menggunakan Nginx sebagai web server dan reverse proxy.

## Prasyarat

Pastikan hal-hal berikut sudah siap di VPS Anda:
1.  **Nginx sudah terinstall.**
2.  **Kode proyek sudah ada di VPS**, misalnya di `/home/sanssin/project/Inite`.
3.  **Frontend sudah di-build.** Jalankan `npm run build` dan pastikan folder `build` sudah ada.
4.  **Backend sudah berjalan.** Aplikasi API Python Anda (menggunakan Gunicorn/Uvicorn) sudah berjalan dan listening di port `8000`.
5.  **File build dipindahkan ke direktori web.** Pindahkan isi dari folder `build` proyek Anda ke `/var/www/inite/build`. Anda mungkin perlu membuat direktori ini terlebih dahulu (`sudo mkdir -p /var/www/inite/build`).

---

## Langkah-langkah Konfigurasi Nginx

### 1. Buat File Konfigurasi Nginx
Buat file konfigurasi baru untuk situs Anda di dalam direktori `sites-available`.

```bash
sudo nano /etc/nginx/sites-available/inite
```

### 2. Isi File Konfigurasi
Salin dan tempel (paste) seluruh konfigurasi berikut ke dalam editor `nano`. Jangan lupa untuk mengganti `domain-anda.com` dengan nama domain Anda yang sebenarnya.

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    # Lokasi file build React yang sudah dipindahkan
    root /var/www/inite/build;
    index index.html index.htm;

    # --- Konfigurasi untuk API Backend (Python) ---
    # Semua request yang datang ke /api/... akan diteruskan ke backend.
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # --- Konfigurasi untuk Frontend (React) ---
    # Baris ini krusial agar routing di sisi client (React Router) dapat berfungsi.
    # Jika request tidak cocok dengan file/folder yang ada, Nginx akan menyajikan index.html.
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Simpan file dan keluar dari `nano` (tekan `Ctrl+X`, lalu `Y`, lalu `Enter`).

### 3. Aktifkan Konfigurasi
Buat "symbolic link" dari file konfigurasi Anda ke direktori `sites-enabled`. Ini adalah cara Nginx untuk mengaktifkan sebuah situs.

```bash
sudo ln -s /etc/nginx/sites-available/inite /etc/nginx/sites-enabled/
```

### 4. Lakukan Tes Konfigurasi
Selalu uji konfigurasi Nginx sebelum me-restart untuk memastikan tidak ada kesalahan sintaks.

```bash
sudo nginx -t
```
Jika Anda melihat pesan `... syntax is ok` dan `... test is successful`, maka konfigurasi Anda sudah benar.

### 5. Restart Nginx
Terapkan semua perubahan dengan me-restart layanan Nginx.

```bash
sudo systemctl restart nginx
```

---
**Selesai!** Sekarang Nginx sudah dikonfigurasi untuk melayani aplikasi React Anda dan meneruskan permintaan API ke backend Python Anda.
