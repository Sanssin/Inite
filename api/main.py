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

# --- Konstanta Fisika ---
GAMMA_CONSTANTS = {
    "cs-137": 0.327,  # (R*m^2)/(Ci*hr)
    "co-60": 1.32,
}
HVL_PB = 4  # Half-Value Layer untuk timbal dalam cm
FLUCTUATION_FACTOR = 0.04 # Faktor kalibrasi untuk fluktuasi visual

@app.get("/calculate_dose")
def calculate_dose(
    distance: float,
    shield_thickness: float = 0,
    source_type: str = "cs-137",
    activity: float = 0.1,  # Aktivitas dalam mCi
):
    """
    Menghitung laju dosis dan parameter fluktuasi berdasarkan jarak,
    perisai, jenis sumber, dan aktivitas.
    """
    # Penanganan jika jarak sangat dekat
    if distance < 0.5:
        return {
            "level": 1000.0,
            "std_dev": 0.0,
            "description": "Laju Paparan: >1000 uSv/jam. BAHAYA: Anda terlalu dekat dengan sumber radiasi. Segera menjauh!",
        }

    gamma_constant = GAMMA_CONSTANTS.get(source_type.lower(), GAMMA_CONSTANTS["cs-137"])
    activity_in_ci = activity / 1000
    activity_factor = (gamma_constant * activity_in_ci) * 1000000

    # Rumus Laju Dosis (Hukum Kuadrat Terbalik + Pelemahan)
    dose_rate = (activity_factor / (distance**2)) * (0.5 ** (shield_thickness / HVL_PB))

    # Hitung standar deviasi untuk fluktuasi
    std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)

    # Tentukan status keselamatan
    DANGER_THRESHOLD = 3.125 # Laju dosis di atas 3.125 uSv/jam dianggap berbahaya
    WARNING_THRESHOLD = 2.0 # Laju dosis di atas 2.0 uSv/jam dianggap peringatan
    status_text = "AMAN: Laju paparan di bawah batas aman."
    if dose_rate >= DANGER_THRESHOLD:
        status_text = "BAHAYA: Laju paparan sangat tinggi."
    elif dose_rate >= WARNING_THRESHOLD:
        status_text = "PERINGATAN: Laju paparan cukup tinggi."

    shielding_text = "(dengan perisai)" if shield_thickness > 0 else "(tanpa perisai)"

    return {
        "level": float(f"{dose_rate:.2f}"),
        "std_dev": float(f"{std_dev:.4f}"),
        "description": f"{status_text}",
    }
