from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math
import datetime

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://31.97.110.213:3000",
    "http://31.97.110.213",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Physics Constants ---
GAMMA_CONSTANTS = {
    "cs-137": 0.327,
    "Co-60": 1.32,
    "Na-22": 0.58,
}

ATTENUATION_COEFFICIENTS = {
    "cs-137": {
        "lead": 1.2,
        "concrete": 0.15,
        "glass": 0.086
    },
    "Co-60": {
        "lead": 0.7,
        "concrete": 0.1,
        "glass": 0.063
    },
    "Na-22": {
        "lead": 0.5,
        "concrete": 0.09,
        "glass": 0.12
    }
}

FLUCTUATION_FACTOR = 0.04

# --- Radioisotope Constants ---
PRODUCTION_DATES = {
    "cs-137": "1999-09-01",
    "Co-60": "2018-01-01",
    "Na-22": "2019-01-01",
}

HALF_LIVES = {
    "cs-137": 30.17,
    "Co-60": 5.27,
    "Na-22": 2.6,
}


@app.get("/calculate_dose")
def calculate_dose(
    distance: float,
    source_type: str,
    initial_activity: float,
    shielding_material: str,
    shield_thickness: float = 0,
):
    source_type_lower = source_type.lower()
    shielding_material_lower = shielding_material.lower()

    # --- Current Activity Calculation ---
    production_date_str = PRODUCTION_DATES.get(source_type_lower, "2020-01-01")
    half_life_years = HALF_LIVES.get(source_type_lower, 30.17)

    production_date = datetime.datetime.strptime(production_date_str, "%Y-%m-%d").date()
    current_date = datetime.date.today()
    time_elapsed_years = (current_date - production_date).days / 365.25

    current_activity_ci = initial_activity * (0.5 ** (time_elapsed_years / half_life_years))

    # --- Dose Rate Calculation ---
    gamma_constant = GAMMA_CONSTANTS.get(source_type_lower, 0)
    dose_rate_unshielded = (gamma_constant * current_activity_ci) / (distance**2)

    # Shielding Calculation
    mu = ATTENUATION_COEFFICIENTS.get(source_type_lower, {}).get(shielding_material_lower, 0)
    shielding_factor = math.exp(-mu * shield_thickness)
    dose_rate_shielded = dose_rate_unshielded * shielding_factor

    # Calculate HVL from mu for display purposes
    hvl = (math.log(2) / mu) if mu > 0 else 0

    # --- Final Preparations for Frontend ---
    std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate_shielded)

    # Safety Status
    DANGER_THRESHOLD = 7.5
    WARNING_THRESHOLD = 2.5
    status_text = "AMAN: Laju paparan di bawah batas aman."
    safety_level = "safe"
    if dose_rate_shielded >= DANGER_THRESHOLD:
        status_text = "BAHAYA: Laju paparan sangat tinggi."
        safety_level = "danger"
    elif dose_rate_shielded >= WARNING_THRESHOLD:
        status_text = "PERINGATAN: Laju paparan cukup tinggi."
        safety_level = "warning"

    full_data = {
        "level": float(f"{dose_rate_shielded:.2f}"),
        "std_dev": float(f"{std_dev:.4f}"),
        "description": status_text,
        "safety_level": safety_level,
        "current_activity": float(f"{current_activity_ci:.2f}"),
        "source_type": source_type,
        "initial_activity": initial_activity,
        "production_date": production_date_str,
        "half_life": half_life_years,
        "shielding_material": shielding_material,
        "shield_thickness": shield_thickness,
        "attenuation_coefficient": mu,
        "hvl": float(f"{hvl:.2f}")
    }

    if distance < 0.5:
        full_data["level"] = 1000.0
        full_data["std_dev"] = 0.0
        full_data["description"] = "Laju Paparan: >1000 uSv/jam. BAHAYA: Anda terlalu dekat dengan sumber radiasi. Segera menjauh!"
        full_data["safety_level"] = "danger"

    return full_data
