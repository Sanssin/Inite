import math
import logging

# Setup logging untuk production
logger = logging.getLogger(__name__)

# ============================================================
# simulasi_eksterna.py
# Modul: fungsi-fungsi perhitungan radiasi eksterna
# Referensi: IAEA Safety Standards, Prinsip ALARA
# ============================================================

# Koefisien Atenuasi Linear [cm⁻¹] untuk berbagai material
ATTENUATION_COEFFICIENTS = {
    "aluminium": 0.05,
    "timbal":    0.15,
    "kayu":      0.02,
    "bata":      0.08,
    "beton":     0.12
}

# Threshold Dosis Radiasi [mSv]
DOSE_THRESHOLDS = {
    "safe": 50,        # Dosis aman
    "caution": 200,    # Perlu waspada
    "danger": float('inf')  # Bahaya
}


def efek_jarak(I0: float, jarak: float) -> float:
    """
    Hukum Kuadrat Terbalik (Inverse Square Law).
    I(r) = I0 / r^2
    
    Args:
        I0: Intensitas awal [mSv]
        jarak: Jarak dari sumber [meter]
        
    Returns:
        float: Intensitas pada jarak tersebut [mSv]
        
    Raises:
        ValueError: Jika parameter tidak valid
    """
    if I0 < 0:
        raise ValueError("Intensitas awal tidak boleh negatif.")
    if jarak <= 0:
        raise ValueError("Jarak harus lebih dari 0 meter.")
    return I0 / (jarak ** 2)


def efek_shielding(I0: float, material: str, ketebalan: float) -> float:
    """
    Hukum Atenuasi Beer-Lambert.
    I_shield = I0 * e^(-mu * x)
    
    Args:
        I0: Intensitas sebelum perisai [mSv]
        material: Jenis material perisai
        ketebalan: Ketebalan perisai [cm]
        
    Returns:
        float: Intensitas setelah perisai [mSv]
        
    Raises:
        ValueError: Jika material tidak dikenal atau parameter tidak valid
    """
    material = material.lower().strip()
    if material not in ATTENUATION_COEFFICIENTS:
        valid_materials = ", ".join(ATTENUATION_COEFFICIENTS.keys())
        raise ValueError(
            f"Material tidak dikenal: {material}. "
            f"Pilih dari: {valid_materials}"
        )
    if ketebalan < 0:
        raise ValueError("Ketebalan tidak boleh negatif.")
    if I0 < 0:
        raise ValueError("Intensitas awal tidak boleh negatif.")
    
    mu = ATTENUATION_COEFFICIENTS[material]
    return I0 * math.exp(-mu * ketebalan)


def efek_waktu(intensitas: float, waktu: float) -> float:
    """
    Dosis total = intensitas x waktu paparan.
    
    Args:
        intensitas: Laju dosis [mSv/detik]
        waktu: Durasi paparan [detik]
        
    Returns:
        float: Total dosis terakumulasi [mSv]
        
    Raises:
        ValueError: Jika parameter tidak valid
    """
    if intensitas < 0:
        raise ValueError("Intensitas tidak boleh negatif.")
    if waktu < 0:
        raise ValueError("Waktu tidak boleh negatif.")
    return intensitas * waktu


def get_dose_status(dosis: float) -> str:
    """
    Tentukan status risiko berdasarkan dosis total.
    
    Args:
        dosis: Total dosis [mSv]
        
    Returns:
        str: Status radiasi ("safe", "caution", "danger")
    """
    if dosis < DOSE_THRESHOLDS["safe"]:
        return "safe"
    elif dosis < DOSE_THRESHOLDS["caution"]:
        return "caution"
    else:
        return "danger"


def simulasi_eksterna(I0: float, jarak: float, waktu: float,
                      material: str, ketebalan: float) -> dict:
    """
    Jalankan simulasi lengkap radiasi eksterna.
    Menerapkan prinsip ALARA: Distance, Shielding, Time.
    
    Args:
        I0: Intensitas awal [mSv]
        jarak: Jarak dari sumber [meter]
        waktu: Durasi paparan [detik] - DIPERBAIKI: sekarang float
        material: Jenis material perisai
        ketebalan: Ketebalan perisai [cm]
        
    Returns:
        dict: Hasil perhitungan dengan keys:
            - I0, jarak, material, ketebalan, waktu (input)
            - intensitas_jarak (setelah jarak)
            - intensitas_shield (setelah perisai)
            - dosis (total dosis)
            - status (risiko level: safe/caution/danger)
    """
    try:
        # Hitung tahap demi tahap
        intensitas_jarak = efek_jarak(I0, jarak)
        intensitas_shield = efek_shielding(intensitas_jarak, material, ketebalan)
        dosis = efek_waktu(intensitas_shield, waktu)
        status = get_dose_status(dosis)

        hasil = {
            "I0": I0,
            "jarak": jarak,
            "material": material,
            "ketebalan": ketebalan,
            "waktu": waktu,
            "intensitas_jarak": round(intensitas_jarak, 4),
            "intensitas_shield": round(intensitas_shield, 4),
            "dosis": round(dosis, 4),
            "status": status,
        }

        # Log untuk monitoring/debugging
        logger.info(f"Simulasi eksterna selesai - Dosis: {hasil['dosis']} mSv, Status: {status}")

        # Cetak laporan ke terminal
        print("\n" + "="*40)
        print("  HASIL SIMULASI EKSTERNA")
        print("="*40)
        print(f"  Intensitas awal (I0) : {I0} mSv")
        print(f"  Jarak                : {jarak} m")
        print(f"  Material / Ketebalan : {material} / {ketebalan} cm")
        print(f"  Waktu paparan        : {waktu} detik")
        print("-"*40)
        print(f"  Intensitas (jarak)   : {hasil['intensitas_jarak']} mSv")
        print(f"  Intensitas (shield)  : {hasil['intensitas_shield']} mSv")
        print(f"  Dosis total          : {hasil['dosis']} mSv")
        print(f"  Status               : {status}")
        print("="*40)

        return hasil
        
    except ValueError as e:
        logger.error(f"Input error simulasi eksterna: {e}")
        raise
    except Exception as e:
        logger.error(f"Error simulasi eksterna: {e}")
        raise
