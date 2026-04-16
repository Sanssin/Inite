---
name: nuclear-physics
description: Gunakan skill ini setiap kali perlu mengimplementasikan kalkulasi fisika nuklir di INITE — baik di backend Python (api/main.py) maupun di simulasi frontend. Trigger: pertanyaan tentang rumus fisika nuklir, implementasi perhitungan dosis/peluruhan/aktivitas, atau saat mengubah/menambah logika di api/main.py. Skill ini memastikan semua nilai dan rumus akurat secara ilmiah.
---

Skill ini adalah referensi fisika nuklir untuk implementasi kalkulasi di platform INITE. Semua rumus harus mengacu pada sumber standar (IAEA, BAPETEN, literatur terpercaya).

## Prinsip Utama

**WAJIB**: Setiap implementasi rumus baru HARUS:
1. Disertai referensi literatur di komentar kode
2. Didokumentasikan di `CATATAN_PERHITUNGAN.md`
3. Menggunakan konstanta bernama (bukan magic number)
4. Menyertakan satuan di nama variabel atau komentar

---

## Modul 1: Proteksi Radiasi (Existing — ALARA)

### Hukum Kuadrat Terbalik
```python
# D = A / r²
# D: laju dosis (μSv/jam)
# A: faktor aktivitas sumber (dikalibrasi empiris)
# r: jarak dari sumber (meter)
# Sumber: IAEA Safety Reports Series No. 47 (2001)
dose_rate = activity_factor / (distance_m ** 2)
```

### Atenuasi Perisai (HVL Method)
```python
# D = D₀ × (0.5^(x/HVL))
# D₀: laju dosis tanpa perisai
# x: ketebalan perisai (cm)
# HVL: Half Value Layer material (cm)
# Sumber: Attix, "Introduction to Radiological Physics" (1986)

# Data HVL untuk Cs-137 (662 keV)
HVL_DATA = {
    "Pb":   0.65,   # cm — Timbal
    "Fe":   1.6,    # cm — Besi/baja
    "beton": 4.8,   # cm — Beton
    "air":  8.9,    # cm — Air
}

attenuation = 0.5 ** (shield_thickness_cm / HVL_DATA["Pb"])
dose_shielded = dose_rate * attenuation
```

### Fluktuasi Statistik Detektor (Gaussian)
```python
import math, random

# σ = F × √D (noise detektor proporsional √laju dosis)
# Sumber: Knoll, "Radiation Detection and Measurement" 4th Ed (2010)
FLUCTUATION_FACTOR = 0.1  # empiris, bisa disesuaikan

std_dev = FLUCTUATION_FACTOR * math.sqrt(dose_rate)

# Implementasi di frontend (JavaScript):
# function gaussianRandom() { Box-Muller transform }
# displayed = baseDoseRate + gaussianRandom() * stdDev
```

---

## Modul 2: Peluruhan Radioaktif

### Hukum Peluruhan Eksponensial
```python
# N(t) = N₀ × e^(-λt)
# λ = ln(2) / T½  (konstanta peluruhan, s⁻¹)
# T½ = waktu paruh (detik)
# A(t) = A₀ × e^(-λt)  (aktivitas juga meluruh dengan cara sama)
# Sumber: Krane, "Introductory Nuclear Physics" (1988), Ch. 6

import math

# Data waktu paruh (detik) — Sumber: IAEA Nuclear Data Section 2023
HALF_LIFE_S = {
    "Cs-137": 9.467e8,    # 30.0 tahun
    "Ra-226": 5.059e10,   # 1600 tahun
    "C-14":   1.809e11,   # 5730 tahun
    "I-131":  6.950e5,    # 8.02 hari
    "Tc-99m": 2.163e4,    # 6.01 jam (nuklida medis)
    "U-238":  1.410e17,   # 4.468 × 10⁹ tahun
    "Po-210": 1.195e7,    # 138.4 hari
}

def hitung_peluruhan(N0: float, nuklida: str, waktu_s: float) -> dict:
    """
    Hitung jumlah atom tersisa dan aktivitas setelah waktu tertentu.
    N(t) = N₀ × e^(-λt), A(t) = λ × N(t)
    """
    T_half = HALF_LIFE_S[nuklida]
    lambda_val = math.log(2) / T_half
    N_t = N0 * math.exp(-lambda_val * waktu_s)
    A_t = lambda_val * N_t  # Aktivitas dalam Bq
    return {
        "N_t": N_t,
        "A_Bq": A_t,
        "persen_tersisa": (N_t / N0) * 100
    }
```

### Peluruhan Berantai (Serial Decay)
```python
# Jika nuklida A → B → C (peluruhan serial)
# dN_B/dt = λ_A × N_A - λ_B × N_B
# Solusi Bateman:
# N_B(t) = N_A0 × (λ_A / (λ_B - λ_A)) × (e^(-λ_A×t) - e^(-λ_B×t))
# Sumber: Bateman, Phil. Mag. 6(35):704 (1910)
```

---

## Modul 3: Jenis-jenis Radiasi

### Jangkauan Partikel Alpha di Udara
```python
# Range empiris (aturan empiris Geiger-Nuttall)
# R_udara (cm) ≈ 0.31 × E^(3/2) untuk E dalam MeV (E = 4-7 MeV)
# Sumber: Evans, "The Atomic Nucleus" (1955)

def range_alpha_udara_cm(energy_MeV: float) -> float:
    return 0.31 * (energy_MeV ** 1.5)

# Data jangkauan tipikal (udara, 15°C, 1 atm):
ALPHA_RANGE_CM = {
    "Po-210": 3.87,   # 5.30 MeV
    "Ra-226": 3.30,   # 4.87 MeV
}
```

### Jangkauan Partikel Beta di Air/Jaringan
```python
# Aturan empiris: R_max (g/cm²) ≈ 0.412 × E^(1.265 - 0.0954 × ln(E))
# untuk E dalam MeV (0.01–3 MeV)
# Sumber: NIST ESTAR database

def range_beta_jaringan_gcm2(energy_MeV: float) -> float:
    n = 1.265 - 0.0954 * math.log(energy_MeV)
    return 0.412 * (energy_MeV ** n)
```

### Koefisien Atenuasi Gamma
```python
# I = I₀ × e^(-μ × x)
# μ: koefisien atenuasi linear (cm⁻¹)
# μ/ρ: koefisien atenuasi massa (cm²/g) — dari tabel NIST
# Sumber: NIST XCOM database, https://physics.nist.gov/PhysRefData/Xcom/

# Data koefisien atenuasi massa untuk Cs-137 (662 keV)
MU_RHO_CM2_G = {
    "Pb":   1.248e-1,   # cm²/g
    "Fe":   7.395e-2,
    "beton": 7.214e-2,
    "air":  8.581e-2,
    "jaringan": 8.571e-2,
}

def atenuasi_gamma(I0, mu_rho, rho_g_cm3, thickness_cm):
    """I = I₀ × exp(-μ/ρ × ρ × x)"""
    mu = mu_rho * rho_g_cm3
    return I0 * math.exp(-mu * thickness_cm)
```

---

## Modul 4: Reaktivitas & Reaksi Fisi (Referensi Sederhana)

### Reaksi Fisi U-235
```
¹n + ²³⁵U → ²³⁶U* → fragmen fisi + 2-3 neutron + energi (~200 MeV)
```

```python
# Energi per fisi
ENERGI_FISI_U235_MEV = 200  # MeV rata-rata
NEUTRON_PER_FISI = 2.43     # rata-rata neutron baru per fisi

# Faktor perkalian (simplified)
def faktor_k(neutron_lahir, neutron_serap, neutron_bocor):
    """k = neutron generasi berikut / neutron generasi ini"""
    return neutron_lahir / (neutron_serap + neutron_bocor)

# k = 1.0: kondisi kritis (steady state reaktor)
# k > 1.0: superkritis (daya naik)
# k < 1.0: subkritis (daya turun)
```

---

## Modul 5: Dosis & Proteksi (Referensi Lengkap)

```python
# Besaran Radiologi
# Kerma (K) = energi kinetik per satuan massa (Gy)
# Absorbed Dose (D) = energi terserap per satuan massa (Gy = J/kg)
# Equivalent Dose (H) = D × wR (Sv)   — wR: faktor bobot radiasi
# Effective Dose (E) = Σ (wT × H_T)   — wT: faktor bobot jaringan
# Sumber: ICRP Publication 103 (2007)

# Faktor bobot radiasi (wR) — ICRP 103
WR = {
    "foton":    1,
    "elektron": 1,
    "proton":   2,
    "alpha":    20,
    "neutron":  {   # tergantung energi
        "termal":   2.5,
        "1MeV":     20,
        "cepat":    10,
    }
}

# Batas dosis (BAPETEN Perka No. 4 Tahun 2013)
BATAS_DOSIS_MSV_PER_TAHUN = {
    "masyarakat_umum":  1,
    "pekerja_magang":   6,
    "pekerja_radiasi":  20,
    "kehamilan":        1,  # selama masa kehamilan (per 9 bulan)
}
```

---

## Cara Menggunakan Skill Ini

Ketika diminta mengimplementasikan kalkulasi fisika:

1. Pilih rumus dari modul yang relevan di atas
2. Pastikan konstanta memiliki nama dan komentar satuan
3. Tambahkan referensi sumber di komentar
4. Tulis docstring yang menjelaskan input, output, dan rumus
5. Tambahkan dokumentasi ke `CATATAN_PERHITUNGAN.md`
6. Untuk data nuklida tambahan: cek https://www-nds.iaea.org/ atau https://www.nndc.bnl.gov/nudat/
