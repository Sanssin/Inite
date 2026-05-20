"""
Test script untuk simulasi_eksterna.py
Jalankan dengan: python test_simulasi_eksterna.py
"""

from simulasi_eksterna import simulasi_eksterna, efek_jarak, efek_shielding, efek_waktu

print("\n" + "="*60)
print(" TEST SIMULASI RADIASI EKSTERNA - INITE")
print("="*60)

# ============================================================
# TEST CASE 1: Simulasi lengkap (prinsip ALARA)
# ============================================================
print("\n📋 TEST CASE 1: Simulasi Lengkap ALARA")
print("-" * 60)
hasil1 = simulasi_eksterna(
    I0=100,           # Intensitas awal 100 mSv
    jarak=5,          # Jarak 5 meter
    waktu=3600,       # Paparan 1 jam (3600 detik)
    material="timbal",
    ketebalan=2       # 2 cm ketebalan timbal
)
print(f"\n✓ Dictionary hasil:\n{hasil1}\n")

# ============================================================
# TEST CASE 2: Efek jarak saja (Inverse Square Law)
# ============================================================
print("\n📋 TEST CASE 2: Efek Jarak (Inverse Square Law)")
print("-" * 60)
I0 = 100
for jarak_test in [1, 2, 5, 10]:
    intensitas = efek_jarak(I0, jarak_test)
    print(f"  Jarak {jarak_test} m → Intensitas: {intensitas:.4f} mSv (berkurang {100*(1 - intensitas/I0):.1f}%)")

# ============================================================
# TEST CASE 3: Efek perisai (Beer-Lambert)
# ============================================================
print("\n📋 TEST CASE 3: Efek Perisai (Beer-Lambert)")
print("-" * 60)
I0_shield = 100
material_test = "timbal"
for tebal in [0, 0.65, 1.3, 2.6]:
    intensitas_shield = efek_shielding(I0_shield, material_test, tebal)
    print(f"  {material_test.upper()} {tebal} cm → Intensitas: {intensitas_shield:.4f} mSv (berkurang {100*(1 - intensitas_shield/I0_shield):.1f}%)")

# ============================================================
# TEST CASE 4: Berbagai material
# ============================================================
print("\n📋 TEST CASE 4: Perbandingan Material (ketebalan 1 cm)")
print("-" * 60)
I0_material = 50
ketebalan_material = 1.0
materials = ["kayu", "bata", "aluminium", "beton", "timbal"]
for mat in materials:
    intensitas_mat = efek_shielding(I0_material, mat, ketebalan_material)
    print(f"  {mat:12} → {intensitas_mat:.4f} mSv (efektifitas: {100*(1 - intensitas_mat/I0_material):.1f}%)")

# ============================================================
# TEST CASE 5: Efek waktu paparan
# ============================================================
print("\n📋 TEST CASE 5: Efek Waktu Paparan")
print("-" * 60)
intensitas_time = 2.5  # mSv/detik
waktu_list = [1, 10, 60, 3600]
waktu_label = ["1 detik", "10 detik", "1 menit", "1 jam"]
for waktu, label in zip(waktu_list, waktu_label):
    dosis = efek_waktu(intensitas_time, waktu)
    print(f"  {label:10} → Dosis: {dosis:.4f} mSv")

# ============================================================
# TEST CASE 6: Skenario Realistis (Pekerja Nuklir)
# ============================================================
print("\n📋 TEST CASE 6: Skenario Pekerja Nuklir")
print("-" * 60)
hasil_worker = simulasi_eksterna(
    I0=200,           # Sumber kuat 200 mSv
    jarak=3,          # Jarak dekat 3 meter
    waktu=1800,       # Kerja 30 menit
    material="beton",
    ketebalan=5       # Shielding beton 5 cm
)

# ============================================================
# TEST CASE 7: Error handling
# ============================================================
print("\n📋 TEST CASE 7: Error Handling")
print("-" * 60)
try:
    print("Coba: efek_jarak(-100, 5) → ", end="")
    efek_jarak(-100, 5)
except ValueError as e:
    print(f"✓ Caught: {e}")

try:
    print("Coba: efek_shielding(50, 'karet', 1) → ", end="")
    efek_shielding(50, "karet", 1)
except ValueError as e:
    print(f"✓ Caught: {e}")

try:
    print("Coba: efek_waktu(10, -5) → ", end="")
    efek_waktu(10, -5)
except ValueError as e:
    print(f"✓ Caught: {e}")

print("\n" + "="*60)
print(" ✅ SEMUA TEST SELESAI")
print("="*60 + "\n")
