import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Introsim.css';
import mascot from '../assets/Group 44.png'; // Import gambar maskot

const Introsim = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game'); // Arahkan ke halaman simulasi
  };

  return (
    <div className="introsim-container">
      <div className="introsim-content">
        <div className="text-section">
          <h1>Nuclear Radiation Simulation</h1>
          <p>
            Halo ... man-teman. Aku adalah Nukki (Maskot dari Web Inite) yang akan menemanimu dalam praktikum virtual radiasi.
          </p>
          <p>
            Dalam praktikum, nantinya teman-teman akan belajar mengenai sumber radiasi yang digunakan, jumlah paparan radiasi yang diterima dalam tubuh, serta upaya teman-teman mengurangi jumlah paparan radiasi dengan memperhatikan lama paparan, jenis <strong>shielding</strong> yang digunakan, dan jenis sumber radisi yang digunakan.
          </p>
          <p>
            Ayo tunggu apa lagi ... silakan klik tombol dibawah ini untuk memulai praktikum.
          </p>
          <button onClick={handleStart} className="introsim-button">
            Get Started!
          </button>
        </div>
        <div className="image-section">
          <img src={mascot} alt="Nukki Mascot" />
        </div>
      </div>
    </div>
  );
};

export default Introsim;
