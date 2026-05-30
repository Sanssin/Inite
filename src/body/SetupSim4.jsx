import React, { useState, useEffect } from 'react';

// 1. Jalur import gambar yang sudah kamu sesuaikan ke .png
import timbalImg from '../assets/timbal 1.png';
import betonImg from '../assets/beton1.png';
import kacaImg from '../assets/kaca1.png'; // pastikan ini sudah dicopy/rename ke png di folder assets
import bataImg from '../assets/bata1.png'; // pastikan ini sudah dicopy/rename ke png di folder assets
import kayuImg from '../assets/kayu1.png'; // pastikan ini sudah dicopy/rename ke png di folder assets

const SetupSim4 = () => {
  // Langsung set data material utama di sini agar terhindar dari stuck loading
  const [materials, setMaterials] = useState([
    { id: "lead", name: "Timbal (Lead)" },
    { id: "concrete", name: "Beton (Concrete)" },
    { id: "glass", name: "Kaca Pb (Lead Glass)" },
    { id: "brick", name: "Bata (Brick)" },
    { id: "wood", name: "Kayu (Wood)" }
  ]);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  // Mapping ke nama variabel import di atas
  const materialImages = {
    lead: timbalImg,
    concrete: betonImg,
    glass: kacaImg,
    brick: bataImg,
    wood: kayuImg
  };

  useEffect(() => {
    // Tetap mencoba sinkronisasi ke FastAPI jika dinyalakan
    fetch('http://127.0.0.1:8080/shielding_materials_list')
      .then((res) => {
        if (!res.ok) throw new Error('API belum aktif');
        return res.json();
      })
      .then((json) => {
        if (json.status === 'success') {
          setMaterials(json.data);
        }
      })
      .catch((err) => {
        console.log("Menggunakan fallback lokal aman:", err.message);
      });
  }, []);

  return (
    <div style={{ padding: '20px', color: '#fff', width: '100%' }}>
      <h5 style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>
        2. Pilih Material Perisai
      </h5>

      {/* Grid Tombol Pilihan Shielding */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {materials.map((mat) => {
          const isSelected = selectedMaterial === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => setSelectedMaterial(mat.id)}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                border: isSelected ? '3px solid #fd7e14' : '1px solid #444',
                boxShadow: isSelected ? '0 0 15px rgba(253, 126, 20, 0.6)' : 'none',
                transition: 'all 0.2s ease',
                background: '#222',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {/* Gambar tekstur shielding */}
              <img 
                src={materialImages[mat.id]} 
                alt={mat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isSelected ? '1' : '0.5',
                  transition: 'opacity 0.2s ease'
                }}
              />
              
              {/* Nama teks di bagian bawah gambar */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.85)',
                  padding: '6px 2px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                {mat.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SetupSim4;
