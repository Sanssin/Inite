from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

# Konfigurasi CORS untuk mengizinkan permintaan dari frontend React Anda
origins = [
    "http://localhost:3000",  # Port default untuk create-react-app
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konstanta yang sama dari file JavaScript
SOURCE_ACTIVITY = 2  # mCi
GAMMA_CONSTANT = 0.327  # (R*m^2)/(Ci*hr)
ACTIVITY_FACTOR = (GAMMA_CONSTANT * (SOURCE_ACTIVITY / 1000)) * 1000000  # Faktor untuk konversi ke uSv/hr
DANGER_THRESHOLD = 4.0  # uSv/jam
WARNING_THRESHOLD = 1.5  # uSv/jam

@app.get("/calculate_dose")
def calculate_dose(distance: float):
    """
    Menghitung laju dosis radiasi dan memberikan status berdasarkan jarak.
    """
    # Penanganan jika jarak sangat dekat atau nol untuk menghindari pembagian dengan nol
    if distance < 0.5:
        return {
            "level": ">1000",
            "description": "BAHAYA: Anda berada terlalu dekat dengan sumber radiasi. Laju paparan sangat tinggi dan berbahaya. Segera menjauh!",
        }

    # Rumus Laju Dosis: D = A / r^2
    # Tambahkan pengecekan untuk menghindari pembagian dengan nol
    if distance == 0:
        dose_rate = float('inf')
    else:
        dose_rate = ACTIVITY_FACTOR / (distance ** 2)

    description = ""
    if dose_rate >= DANGER_THRESHOLD:
        description = "BAHAYA: Laju paparan di posisi ini sangat tinggi. Berpotensi membahayakan kesehatan. Gunakan shielding atau segera menjauh."
    elif dose_rate >= WARNING_THRESHOLD:
        description = "PERINGATAN: Laju paparan di posisi ini cukup tinggi. Disarankan untuk tidak berlama-lama dan tetap waspada."
    else:
        description = "AMAN: Laju paparan di posisi ini rendah dan berada di bawah batas aman. Anda dapat bekerja dengan aman."

    # Menangani kasus laju dosis tak terhingga
    if dose_rate == float('inf'):
        level = ">1000"
    else:
        level = f"{dose_rate:.2f}"


    return {
        "level": level,
        "description": description,
    }