from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math
import datetime

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
SHIELDING_MATERIAL = "Timbal (Pb)"
FLUCTUATION_FACTOR = 0.04 # Faktor kalibrasi untuk fluktuasi visual

# --- Konstanta Radioisotop ---
INITIAL_ACTIVITIES = { # dalam µCi (microCurie)
    "cs-137": 100.0,
    "co-60": 100.0,
}

PRODUCTION_DATES = { # Format YYYY-MM-DD
    "cs-137": "2020-01-01",
    "co-60": "2018-01-01",
}

HALF_LIVES = { # dalam TAHUN
    "cs-137": 30.17,
    "co-60": 5.27,
}


@app.get("/calculate_dose")
def calculate_dose(
    distance: float,
    shield_thickness: float = 0,
    source_type: str = "cs-137",
):
    """
    Menghitung laju dosis dan semua parameter terkait untuk simulasi.
    Aktivitas dihitung secara dinamis.
    """
    # --- Perhitungan Aktivitas Saat Ini ---
    source_type_lower = source_type.lower()
    initial_activity = INITIAL_ACTIVITIES.get(source_type_lower, 100.0)
    production_date_str = PRODUCTION_DATES.get(source_type_lower, "2020-01-01")
    half_life_years = HALF_LIVES.get(source_type_lower, 30.17)

    # Hitung waktu berlalu dalam tahun
    production_date = datetime.datetime.strptime(production_date_str, "%Y-%m-%d").date()
    current_date = datetime.date.today()
    time_elapsed_days = (current_date - production_date).days
    time_elapsed_years = time_elapsed_days / 365.25 # Konversi ke tahun

    # Hitung aktivitas saat ini menggunakan rumus peluruhan (hasil dalam µCi)
    current_activity = initial_activity * (0.5 ** (time_elapsed_years / half_life_years))

    # --- Perhitungan Laju Dosis ---
    gamma_constant = GAMMA_CONSTANTS.get(source_type_lower, GAMMA_CONSTANTS["cs-137"])
    # Konversi aktivitas saat ini dari µCi ke Ci untuk rumus
    activity_in_ci = current_activity / 1_000_000
    activity_factor = (gamma_constant * activity_in_ci) * 1000000

    # Rumus Laju Dosis (Hukum Kuadrat Terbalik + Pelemahan)
    dose_rate = (activity_factor / (distance**2)) * (0.5 ** (shield_thickness / HVL_PB))

    # Hitung standar deviasi untuk fluktuasi
    std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)

    # Tentukan status keselamatan
    DANGER_THRESHOLD = 3.125
    WARNING_THRESHOLD = 2.0
    status_text = "AMAN: Laju paparan di bawah batas aman."
    if dose_rate >= DANGER_THRESHOLD:
        status_text = "BAHAYA: Laju paparan sangat tinggi."
    elif dose_rate >= WARNING_THRESHOLD:
        status_text = "PERINGATAN: Laju paparan cukup tinggi."

    # Siapkan semua data untuk dikirim ke frontend
    full_data = {
        "level": float(f"{dose_rate:.2f}"),
        "std_dev": float(f"{std_dev:.4f}"),
        "description": status_text,
        "current_activity": float(f"{current_activity:.2f}"),
        "source_type": source_type,
        "initial_activity": initial_activity,
        "production_date": production_date_str,
        "half_life": half_life_years,
        "shielding_material": SHIELDING_MATERIAL,
        "hvl": HVL_PB
    }

    # Penanganan jika jarak sangat dekat (setelah semua data dihitung)
    if distance < 0.5:
        full_data["level"] = 1000.0
        full_data["std_dev"] = 0.0
        full_data["description"] = "Laju Paparan: >1000 uSv/jam. BAHAYA: Anda terlalu dekat dengan sumber radiasi. Segera menjauh!"

    return full_data