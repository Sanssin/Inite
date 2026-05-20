# ============================================================
# main_program.py
# Entry point — jalankan file ini untuk memulai program
# Cara menjalankan: python main_program.py
# ============================================================
 
from simulasi_eksterna import simulasi_eksterna
from pemilihan_menu import (
    tampilkan_menu_utama,
    tampilkan_rumus,
    tampilkan_material,
    input_parameter_simulasi,
    pilih_menu,
)
 
 
def main():
    print("\nSelamat datang di Program Simulasi Radiasi Eksterna")
    print("Versi 2.0 | Python 3.x\n")
 
    while True:
        tampilkan_menu_utama()
        pilihan = pilih_menu()
 
        if pilihan == "1":
            params = input_parameter_simulasi()
            simulasi_eksterna(
                I0=params["I0"],
                jarak=params["jarak"],
                waktu=params["waktu"],
                material=params["material"],
                ketebalan=params["ketebalan"],
            )
            input("\n  Tekan Enter untuk kembali ke menu... ")
 
        elif pilihan == "2":
            tampilkan_rumus()
            input("\n  Tekan Enter untuk kembali ke menu... ")
 
        elif pilihan == "3":
            tampilkan_material()
            input("\n  Tekan Enter untuk kembali ke menu... ")
 
        elif pilihan == "4":
            print("\n  Terima kasih. Program selesai.\n")
            break
 
 
if __name__ == "__main__":
    main()
