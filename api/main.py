from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

# Konfigurasi CORS
origins = [
    "http://localhost:3000",
    "http://localhost",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konstanta Simulasi
SOURCE_ACTIVITY = 2  # mCi
GAMMA_CONSTANT = 0.327  # (R*m^2)/(Ci*hr)
ACTIVITY_FACTOR = (GAMMA_CONSTANT * (SOURCE_ACTIVITY / 1000)) * 1000000  # uSv*m^2/hr
DANGER_THRESHOLD = 20.0  # uSv/jam
WARNING_THRESHOLD = 10.5  # uSv/jam
HVL_PB = 4  # Half-Value Layer untuk timbal dalam cm

@app.get("/calculate_dose")
def calculate_dose(distance: float, shield_thickness: float = 0):
    """
    Menghitung laju dosis radiasi berdasarkan jarak dan ketebalan perisai.
    """
    # Penanganan jika jarak sangat dekat
    if distance < 0.5:
        return {
            "level": ">1000",
            "description": "Laju Paparan: >1000 uSv/jam. BAHAYA: Anda terlalu dekat dengan sumber radiasi. Segera menjauh!",
        }

    # Rumus Laju Dosis
    dose_rate = (ACTIVITY_FACTOR / (distance ** 2)) * (0.5**(shield_thickness / HVL_PB))

    # Tentukan status keselamatan
    status_text = ""
    if dose_rate >= DANGER_THRESHOLD:
        status_text = "BAHAYA: Laju paparan sangat tinggi."
    elif dose_rate >= WARNING_THRESHOLD:
        status_text = "PERINGATAN: Laju paparan cukup tinggi."
    else:
        status_text = "AMAN: Laju paparan di bawah batas aman."

    # Keterangan perisai
    shielding_text = "(dengan perisai)" if shield_thickness > 0 else "(tanpa perisai)"

    level_text = f"{dose_rate:.2f}"
    description = f"{status_text} {shielding_text}"

    return {
        "level": level_text,
        "description": description,
    }