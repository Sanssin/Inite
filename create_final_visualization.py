
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import math

# --- DATA DARI GameArea.js ---

# Posisi sumber radiasi (x, y)
SOURCE_POSITION = {'x': 18.2, 'y': 15}

# Daftar ID titik yang berada di dalam area berpelindung (shielded)
SHIELDED_IDS = {25, 26, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 61, 62, 68, 70, 71}

# Daftar koordinat (x, y) untuk setiap titik pergerakan yang valid
COORDINATES = [
    {'id': 1, 'x': 14, 'y': 20.5}, {'id': 2, 'x': 15.9, 'y': 19.5},
    {'id': 3, 'x': 17.5, 'y': 18.5}, {'id': 4, 'x': 19.4, 'y': 17.5},
    {'id': 5, 'x': 21, 'y': 16.5}, {'id': 6, 'x': 22.6, 'y': 15.5},
    {'id': 7, 'x': 24.2, 'y': 14.5}, {'id': 8, 'x': 26.1, 'y': 13.5},
    {'id': 10, 'x': 12.3, 'y': 19.5}, {'id': 11, 'x': 14.1, 'y': 18.5},
    {'id': 12, 'x': 15.8, 'y': 17.5}, {'id': 13, 'x': 17.6, 'y': 16.5},
    {'id': 14, 'x': 19.3, 'y': 15.5}, {'id': 15, 'x': 21.1, 'y': 14.5},
    {'id': 16, 'x': 22.9, 'y': 13.5}, {'id': 17, 'x': 24.5, 'y': 12.5},
    {'id': 19, 'x': 10.6, 'y': 18.5}, {'id': 20, 'x': 12.3, 'y': 17.5},
    {'id': 21, 'x': 14, 'y': 16.7}, {'id': 22, 'x': 15.9, 'y': 15.5},
    {'id': 25, 'x': 21, 'y': 12.5}, {'id': 26, 'x': 22.8, 'y': 11.5},
    {'id': 28, 'x': 8.9, 'y': 17.5}, {'id': 29, 'x': 10.5, 'y': 16.7},
    {'id': 30, 'x': 12.2, 'y': 15.5}, {'id': 31, 'x': 14.1, 'y': 14.5},
    {'id': 34, 'x': 19.1, 'y': 11.5}, {'id': 37, 'x': 7.2, 'y': 16.7},
    {'id': 38, 'x': 9, 'y': 15.7}, {'id': 39, 'x': 10.6, 'y': 14.5},
    {'id': 40, 'x': 12.4, 'y': 13.5}, {'id': 41, 'x': 14, 'y': 12.5},
    {'id': 42, 'x': 15.9, 'y': 11.5}, {'id': 43, 'x': 17.5, 'y': 10.5},
    {'id': 44, 'x': 19.2, 'y': 9.5}, {'id': 46, 'x': 5.5, 'y': 15.7},
    {'id': 47, 'x': 7.2, 'y': 14.7}, {'id': 48, 'x': 8.7, 'y': 13.6},
    {'id': 49, 'x': 10.7, 'y': 12.5}, {'id': 50, 'x': 12.4, 'y': 11.7},
    {'id': 51, 'x': 14.1, 'y': 10.5}, {'id': 52, 'x': 15.9, 'y': 9.5},
    {'id': 53, 'x': 17.5, 'y': 8.7}, {'id': 55, 'x': 3.7, 'y': 14.7},
    {'id': 56, 'x': 5.4, 'y': 13.7}, {'id': 57, 'x': 7.1, 'y': 12.7},
    {'id': 58, 'x': 9, 'y': 11.5}, {'id': 59, 'x': 10.7, 'y': 10.7},
    {'id': 60, 'x': 12.5, 'y': 9.5}, {'id': 61, 'x': 14.1, 'y': 8.7},
    {'id': 62, 'x': 15.9, 'y': 7.7}, {'id': 65, 'x': 3.6, 'y': 12.7},
    {'id': 66, 'x': 5.5, 'y': 11.7}, {'id': 68, 'x': 8.9, 'y': 9.6},
    {'id': 70, 'x': 12.5, 'y': 7.7}, {'id': 71, 'x': 14.1, 'y': 6.7},
]

# Faktor skala untuk menyesuaikan koordinat dari GameArea.js ke piksel gambar
# Anda mungkin perlu menyesuaikan nilai ini jika hasilnya tidak pas
GRID_CELL_SIZE = 25 

def get_logical_coordinates(coordinates_list):
    """
    Membangun peta koordinat logika dari daftar koordinat visual.
    Logika ini meniru implementasi di GameArea.js.
    """
    all_ids = {c['id'] for c in coordinates_list}
    logical_map = {}
    
    # Titik jangkar untuk memulai pembangunan grid logika
    # (lx, ly) adalah koordinat logika, bukan visual.
    queue = [{'id': 14, 'lx': 1, 'ly': 0}] 
    visited = set()

    while queue:
        item = queue.pop(0)
        id, lx, ly = item['id'], item['lx'], item['ly']
        
        if id in visited or id not in all_ids:
            continue

        visited.add(id)
        logical_map[id] = {'lx': lx, 'ly': ly}

        # Definisikan pergerakan berdasarkan perubahan ID
        neighbors = [
            {'nextId': id + 1, 'lx_change': 0, 'ly_change': 1},  # w: up-right
            {'nextId': id - 1, 'lx_change': 0, 'ly_change': -1}, # a: down-left
            {'nextId': id + 9, 'lx_change': -1, 'ly_change': 0}, # q: up-left
            {'nextId': id - 9, 'lx_change': 1, 'ly_change': 0}   # s: down-right
        ]

        for neighbor in neighbors:
            if neighbor['nextId'] in all_ids and neighbor['nextId'] not in visited:
                queue.append({
                    'id': neighbor['nextId'],
                    'lx': lx + neighbor['lx_change'],
                    'ly': ly + neighbor['ly_change']
                })
    return logical_map

def create_final_visualization():
    """
    Membuat visualisasi dengan menempatkan titik data di atas gambar latar.
    """
    try:
        # Muat gambar latar belakang
        background_img = mpimg.imread('image.png')
    except FileNotFoundError:
        print("Error: File 'Desktop-8.png' tidak ditemukan.")
        print("Pastikan Anda telah menyimpan screenshot di direktori yang sama dengan skrip ini.")
        return

    # Bangun peta logika untuk perhitungan jarak yang benar
    logical_coords_map = get_logical_coordinates(COORDINATES)

    fig, ax = plt.subplots(figsize=(20, 15))

    # Tampilkan gambar latar belakang
    ax.imshow(background_img)

    # Plot setiap titik pergerakan di atas gambar
    for coord in COORDINATES:
        # Konversi koordinat game ke koordinat piksel gambar untuk penempatan visual
        pixel_x = coord['x'] * GRID_CELL_SIZE
        pixel_y = coord['y'] * GRID_CELL_SIZE

        is_shielded = coord['id'] in SHIELDED_IDS
        color = 'cyan' if is_shielded else 'yellow'
        
        circle = plt.Circle((pixel_x, pixel_y), radius=10, 
                            facecolor=color, edgecolor='black', linewidth=1.5, alpha=0.8)
        ax.add_artist(circle)

        # --- PERHITUNGAN JARAK BARU ---
        distance = 0.0
        if coord['id'] in logical_coords_map:
            logical_pos = logical_coords_map[coord['id']]
            # Jarak dihitung dari pusat logika (0,0)
            distance = math.sqrt(logical_pos['lx']**2 + logical_pos['ly']**2)

        # Tambahkan teks anotasi (ID dan Jarak yang sudah benar)
        ax.text(pixel_x, pixel_y - 15, f"{coord['id']}", 
                ha='center', va='center', fontsize=9, color='black', weight='bold')
        ax.text(pixel_x, pixel_y + 15, f"{distance:.1f}", 
                ha='center', va='center', fontsize=8, color='white', weight='bold',
                bbox=dict(facecolor='black', alpha=0.5, boxstyle='round,pad=0.2'))

    # Plot posisi sumber radiasi (posisi visual tidak berubah)
    source_pixel_x = SOURCE_POSITION['x'] * GRID_CELL_SIZE
    source_pixel_y = SOURCE_POSITION['y'] * GRID_CELL_SIZE
    ax.plot(source_pixel_x, source_pixel_y, 'r*', markersize=25, markeredgecolor='white')
    ax.text(source_pixel_x, source_pixel_y + 40, 'SOURCE (0,0)', 
            ha='center', va='center', fontsize=14, color='red', weight='bold')

    # --- Pengaturan Plot ---
    ax.set_aspect('equal')
    ax.axis('off') # Sembunyikan sumbu x dan y
    plt.title('Visualisasi Final: Titik Pergerakan dan Jarak LOGIKA yang Benar', fontsize=20)
    
    # Simpan gambar hasil visualisasi
    output_filename = 'final_visualization_corrected.png'
    plt.savefig(output_filename, dpi=300, bbox_inches='tight', pad_inches=0)
    
    plt.show()
    print(f"Visualisasi telah disimpan sebagai '{output_filename}'")


if __name__ == '__main__':
    print("Membuat visualisasi final dengan latar belakang gambar...")
    create_final_visualization()
