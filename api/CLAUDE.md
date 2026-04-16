# CLAUDE.md — Backend (`api/`)

Ini adalah konteks khusus untuk pengerjaan kode di direktori `api/` (Python FastAPI backend).

## Peran Backend

Backend INITE adalah **"mesin fisika"** — ia melakukan semua kalkulasi fisika nuklir yang statis/kompleks dan mengembalikan hasilnya ke frontend. Backend TIDAK menangani animasi, state simulasi, atau UI.

## Struktur `api/`

```
api/
├── main.py          ← Entry point, semua endpoint & logika fisika (saat ini)
├── venv/            ← Python virtual environment (di-gitignore)
└── CLAUDE.md        ← (file ini)
```

> **Catatan Pengembangan**: Seiring bertambahnya simulasi, pertimbangkan memisahkan logika per simulasi ke modul terpisah (misal: `physics/alara.py`, `physics/decay.py`).

## Endpoint Saat Ini

```
POST /calculate     → Kalkulasi laju dosis (simulasi ALARA/proteksi radiasi)
```

Request body:
```json
{
  "distance": 2.5,          // meter, jarak avatar dari sumber
  "shield_thickness": 0.0,  // cm, ketebalan perisai Pb (0 = tidak ada perisai)
  "source_type": "Cs-137",  // jenis sumber radiasi
  "activity": 1.0           // faktor aktivitas (normalized)
}
```

Response:
```json
{
  "level": 15.73,           // laju dosis dasar (μSv/jam)
  "std_dev": 0.1586,        // standar deviasi untuk fluktuasi Gaussian
  "description": "..."      // deskripsi status (bahasa Indonesia)
}
```

## Konstanta Fisika yang Digunakan

```python
# Cs-137 — Sumber yang digunakan pada simulasi ALARA
HVL_PB = 0.65        # Half Value Layer Timbal untuk Cs-137 (cm)
FLUCTUATION_FACTOR = 0.1  # Faktor fluktuasi detektor (empiris)

# Batas dosis (referensi BAPETEN/IAEA)
DOSE_LIMIT_PUBLIC = 1.0      # mSv/tahun untuk masyarakat umum
DOSE_LIMIT_WORKER = 20.0     # mSv/tahun untuk pekerja radiasi
```

## Rumus Fisika Utama

Semua rumus didokumentasikan lengkap di `CATATAN_PERHITUNGAN.md` (root project). Ringkasan:

```python
import math

def hitung_laju_dosis(distance: float, shield_thickness: float,
                      activity_factor: float) -> dict:
    """
    Menghitung laju dosis radiasi berdasarkan jarak dan perisai.
    
    Args:
        distance: Jarak dari sumber (meter). Minimal 0.1 m untuk hindari singularitas.
        shield_thickness: Ketebalan perisai Pb (cm). 0 jika tidak ada perisai.
        activity_factor: Faktor aktivitas sumber (normalized).
    
    Returns:
        dict dengan 'level' (laju dosis), 'std_dev' (fluktuasi), 'description'
    
    Rumus:
        dose_rate = (activity_factor / distance²) × (0.5 ^ (shield_thickness / HVL_PB))
        std_dev = FLUCTUATION_FACTOR × √dose_rate
    """
    # Guard: hindari division by zero
    safe_distance = max(distance, 0.1)
    
    dose_rate = (activity_factor / (safe_distance ** 2)) * \
                (0.5 ** (shield_thickness / HVL_PB))
    std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)
    
    return {
        "level": round(dose_rate, 4),
        "std_dev": round(std_dev, 4),
        "description": _get_description(dose_rate)
    }
```

## Panduan Menambah Endpoint Simulasi Baru

Saat membuat endpoint untuk simulasi baru, ikuti pattern ini:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 1. Definisikan model input dengan Pydantic
class PeluruhanInput(BaseModel):
    nuklida: str          # contoh: "Ra-226", "C-14"
    aktivitas_awal: float # Bq
    waktu: float          # detik

# 2. Buat endpoint dengan path yang deskriptif
@app.post("/simulasi/peluruhan/hitung")
async def hitung_peluruhan(data: PeluruhanInput):
    """
    Menghitung peluruhan radioaktif berdasarkan hukum peluruhan eksponensial.
    N(t) = N0 × e^(-λt), di mana λ = ln(2) / T½
    
    Dokumentasi rumus lengkap: CATATAN_PERHITUNGAN.md
    """
    lambda_val = math.log(2) / HALF_LIFE[data.nuklida]
    N_t = data.aktivitas_awal * math.exp(-lambda_val * data.waktu)
    return {"aktivitas": round(N_t, 4), "satuan": "Bq"}

# 3. Dokumentasikan di CATATAN_PERHITUNGAN.md !
```

## CORS Configuration

Pastikan frontend React bisa mengakses backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://inite-polteknuklir.site"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

## Data Referensi Nuklida

Saat menambah simulasi baru yang melibatkan nuklida berbeda, gunakan nilai dari:
- **IAEA Nuclear Data Section**: https://www-nds.iaea.org/
- **NNDC Chart of Nuclides**: https://www.nndc.bnl.gov/nudat/
- Sumber referensi wajib dicantumkan sebagai komentar di kode

Contoh:
```python
# Data waktu paruh (detik) — Sumber: IAEA Nuclear Data Section 2023
HALF_LIFE = {
    "Cs-137": 9.467e8,   # 30 tahun
    "Ra-226": 5.059e10,  # 1600 tahun
    "C-14":   1.809e11,  # 5730 tahun
    "I-131":  6.950e5,   # 8.02 hari
}
```

## Error Handling

```python
from fastapi import HTTPException

@app.post("/calculate")
async def calculate(data: DoseInput):
    if data.distance <= 0:
        raise HTTPException(
            status_code=422,
            detail="Jarak harus lebih besar dari 0 meter"
        )
    # ...
```

## Menjalankan Backend

```bash
cd api
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Cek API docs (auto-generated FastAPI):
# http://localhost:8000/docs
```

## Checklist Sebelum Commit (Backend)

- [ ] Rumus baru sudah didokumentasikan di `CATATAN_PERHITUNGAN.md`
- [ ] Sumber referensi data fisika dicantumkan di komentar kode
- [ ] Input validation menggunakan Pydantic model
- [ ] Guard untuk nilai yang bisa menyebabkan error matematis (division by zero, sqrt negatif)
- [ ] Endpoint baru memiliki docstring yang menjelaskan rumus yang digunakan
- [ ] CORS sudah dikonfigurasi untuk domain production
