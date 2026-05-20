# ============================================================
# menu_program.py
# Entry point — jalankan file ini untuk memulai program
# Cara menjalankan: python menu_program.py
# ============================================================

import sys
import logging
from simulasi_eksterna import simulasi_eksterna
from pemilihan_menu import (
    tampilkan_menu_utama,
    tampilkan_rumus,
    tampilkan_material,
    input_parameter_simulasi,
    pilih_menu,
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ============================================================
# KONSTANTA UI
# ============================================================
WELCOME_MSG = "\nSelamat datang di Program Simulasi Radiasi Eksterna"
VERSION = "Versi 2.0 | Python 3.x"
BACK_TO_MENU = "\n  Tekan Enter untuk kembali ke menu... "
GOODBYE_MSG = "\n  Terima kasih. Program selesai.\n"


def main():
    """Entry point simulasi radiasi eksterna."""
    print(f"{WELCOME_MSG}")
    print(f"{VERSION}\n")
    
    while True:
        try:
            tampilkan_menu_utama()
            pilihan = pilih_menu()
            
            # ✅ Validasi pilihan
            if pilihan not in ["1", "2", "3", "4"]:
                print("\n  ❌ Pilihan tidak valid. Silakan pilih 1-4.\n")
                continue
            
            # Opsi 1: Jalankan simulasi
            if pilihan == "1":
                try:
                    params = input_parameter_simulasi()
                    
                    # ✅ Cek apakah params valid (user tidak membatalkan)
                    if params is None:
                        logger.warning("User membatalkan input parameter")
                        input(BACK_TO_MENU)
                        continue
                    
                    # ✅ Cek key yang diperlukan ada
                    required_keys = ["I0", "jarak", "waktu", "material", "ketebalan"]
                    if not all(key in params for key in required_keys):
                        raise KeyError(f"Parameter tidak lengkap: {required_keys}")
                    
                    logger.info(f"Simulasi dimulai dengan params: {params}")
                    simulasi_eksterna(
                        I0=params["I0"],
                        jarak=params["jarak"],
                        waktu=params["waktu"],
                        material=params["material"],
                        ketebalan=params["ketebalan"],
                    )
                    logger.info("Simulasi selesai")
                    
                except ValueError as e:
                    print(f"\n  ❌ Error input: {e}\n")
                    logger.error(f"ValueError: {e}")
                except KeyError as e:
                    print(f"\n  ❌ Parameter hilang: {e}\n")
                    logger.error(f"KeyError: {e}")
                except Exception as e:
                    print(f"\n  ❌ Error simulasi: {e}\n")
                    logger.error(f"Exception: {type(e).__name__}: {e}")
                finally:
                    input(BACK_TO_MENU)
            
            # Opsi 2: Tampilkan rumus
            elif pilihan == "2":
                try:
                    tampilkan_rumus()
                except Exception as e:
                    print(f"\n  ❌ Error tampilkan rumus: {e}\n")
                    logger.error(f"Exception: {e}")
                finally:
                    input(BACK_TO_MENU)
            
            # Opsi 3: Tampilkan material
            elif pilihan == "3":
                try:
                    tampilkan_material()
                except Exception as e:
                    print(f"\n  ❌ Error tampilkan material: {e}\n")
                    logger.error(f"Exception: {e}")
                finally:
                    input(BACK_TO_MENU)
            
            # Opsi 4: Keluar
            elif pilihan == "4":
                print(GOODBYE_MSG)
                logger.info("Program selesai normal")
                break
        
        except KeyboardInterrupt:
            print("\n\n  Program dihentikan oleh user (Ctrl+C).\n")
            logger.info("Program dihentikan (KeyboardInterrupt)")
            break
        except Exception as e:
            print(f"\n  ❌ Error tidak terduga: {e}\n")
            logger.critical(f"Critical error: {type(e).__name__}: {e}")
            break


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.critical(f"Failed to start program: {e}")
        sys.exit(1)
