
// Constants
const SOURCE_ACTIVITY = 2; // Aktivitas sumber dalam mCi (sesuai deskripsi di UI)
const GAMMA_CONSTANT = 0.327; // Konstanta gamma untuk Cs-137 dalam (R*m^2)/(Ci*hr)
// Karena aktivitas dalam mCi, kita konversi ke Ci dengan membagi 1000.
// Rumus: Laju Dosis (R/hr) = (Konstanta Gamma * Aktivitas) / Jarak^2
// Hasilnya akan kita konversi ke uSv/hr (1 R/hr = 1,000,000 uSv/hr)

const ACTIVITY_FACTOR = (GAMMA_CONSTANT * (SOURCE_ACTIVITY / 1000)) * 1000000; // Faktor untuk langsung mendapatkan uSv/hr

const DANGER_THRESHOLD = 4.0; // uSv/jam
const WARNING_THRESHOLD = 1.5; // uSv/jam

/**
 * Menghitung laju dosis radiasi dan memberikan status berdasarkan jarak.
 * @param {number} distance - Jarak dari sumber radiasi dalam meter (1 kotak = 1 meter).
 * @returns {{level: string, description: string}} - Objek berisi level laju dosis dan deskripsi status.
 */
export const calculateDose = (distance) => {
  // Hindari pembagian dengan nol jika avatar berada tepat di sumber
  if (distance < 0.5) {
    return {
      level: ">1000",
      description: "BAHAYA: Anda berada terlalu dekat dengan sumber radiasi. Laju paparan sangat tinggi dan berbahaya. Segera menjauh!",
    };
  }

  // Rumus Laju Dosis: D = A / r^2
  const doseRate = ACTIVITY_FACTOR / Math.pow(distance, 2);

  let description = "";
  if (doseRate >= DANGER_THRESHOLD) {
    description = "BAHAYA: Laju paparan di posisi ini sangat tinggi. Berpotensi membahayakan kesehatan. Gunakan shielding atau segera menjauh.";
  } else if (doseRate >= WARNING_THRESHOLD) {
    description = "PERINGATAN: Laju paparan di posisi ini cukup tinggi. Disarankan untuk tidak berlama-lama dan tetap waspada.";
  } else {
    description = "AMAN: Laju paparan di posisi ini rendah dan berada di bawah batas aman. Anda dapat bekerja dengan aman.";
  }

  return {
    level: doseRate.toFixed(2), // Tampilkan 2 angka desimal
    description: description,
  };
};
