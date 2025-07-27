import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./GameArea.css";
import SVGComponent from "./assets/svgviewer-react-output";
import characterUpLeft from "./assets/avatar/Atas-Kiri.png";
import characterUpRight from "./assets/avatar/Atas-Kanan.png";
import characterDownLeft from "./assets/avatar/Bawah-Kiri.png";
import characterDownRight from "./assets/avatar/Bawah-Kanan.png";

const gridCellSize = 25; // Ukuran tiap sel grid
const sourcePosition = { x: 18.2, y: 15 }; // Posisi sumber radiasi

// Daftar ID yang berada di dalam jangkauan perisai
const shieldedIds = new Set([25, 26, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 61, 62, 68, 70, 71]);

const isAvatarShielded = (id) => {
  return shieldedIds.has(id);
};

// Fungsi untuk menghasilkan angka acak dengan distribusi Gaussian standar (mean=0, std_dev=1)
const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Menghindari nilai 0
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const GameArea = () => {
  const navigate = useNavigate();
  // Semua state didefinisikan di level atas
  const [positionId, setPositionId] = useState(22);
  const [direction, setDirection] = useState("downLeft");
  const [baseDoseRate, setBaseDoseRate] = useState(0);
  const [fluctuationStdDev, setFluctuationStdDev] = useState(0);
  const [message, setMessage] = useState({
    level: "0.00",
    description: "Selamat datang di simulasi! Gerakkan avatar untuk memulai.",
  });
  const [sumberOpacity, setSumberOpacity] = useState(0);
  const [kontainerOpacity, setKontainerOpacity] = useState(0);
  const [ShieldingOpacity, setShieldingOpacity] = useState(0);
  const [KaktusOpacity, setKaktusOpacity] = useState(0);

  const coordinates = useMemo(() => [
    { id: 1, x: 14, y: 20.5 }, { id: 2, x: 15.9, y: 19.5 },
    { id: 3, x: 17.5, y: 18.5 }, { id: 4, x: 19.4, y: 17.5 },
    { id: 5, x: 21, y: 16.5 }, { id: 6, x: 22.6, y: 15.5 },
    { id: 7, x: 24.2, y: 14.5 }, { id: 8, x: 26.1, y: 13.5 },
    { id: 10, x: 12.3, y: 19.5 }, { id: 11, x: 14.1, y: 18.5 },
    { id: 12, x: 15.8, y: 17.5 }, { id: 13, x: 17.6, y: 16.5 },
    { id: 14, x: 19.3, y: 15.5 }, { id: 15, x: 21.1, y: 14.5 },
    { id: 16, x: 22.9, y: 13.5 }, { id: 17, x: 24.5, y: 12.5 },
    { id: 19, x: 10.6, y: 18.5 }, { id: 20, x: 12.3, y: 17.5 },
    { id: 21, x: 14, y: 16.7 }, { id: 22, x: 15.9, y: 15.5 },
    { id: 25, x: 21, y: 12.5 }, { id: 26, x: 22.8, y: 11.5 },
    { id: 28, x: 8.9, y: 17.5 }, { id: 29, x: 10.5, y: 16.7 },
    { id: 30, x: 12.2, y: 15.5 }, { id: 31, x: 14.1, y: 14.5 },
    { id: 34, x: 19.1, y: 11.5 }, { id: 37, x: 7.2, y: 16.7 },
    { id: 38, x: 9, y: 15.7 }, { id: 39, x: 10.6, y: 14.5 },
    { id: 40, x: 12.4, y: 13.5 }, { id: 41, x: 14, y: 12.5 },
    { id: 42, x: 15.9, y: 11.5 }, { id: 43, x: 17.5, y: 10.5 },
    { id: 44, x: 19.2, y: 9.5 }, { id: 46, x: 5.5, y: 15.7 },
    { id: 47, x: 7.2, y: 14.7 }, { id: 48, x: 8.7, y: 13.6 },
    { id: 49, x: 10.7, y: 12.5 }, { id: 50, x: 12.4, y: 11.7 },
    { id: 51, x: 14.1, y: 10.5 }, { id: 52, x: 15.9, y: 9.5 },
    { id: 53, x: 17.5, y: 8.7 }, { id: 55, x: 3.7, y: 14.7 },
    { id: 56, x: 5.4, y: 13.7 }, { id: 57, x: 7.1, y: 12.7 },
    { id: 58, x: 9, y: 11.5 }, { id: 59, x: 10.7, y: 10.7 },
    { id: 60, x: 12.5, y: 9.5 }, { id: 61, x: 14.1, y: 8.7 },
    { id: 62, x: 15.9, y: 7.7 }, { id: 65, x: 3.6, y: 12.7 },
    { id: 66, x: 5.5, y: 11.7 }, { id: 68, x: 8.9, y: 9.6 },
    { id: 70, x: 12.5, y: 7.7 }, { id: 71, x: 14.1, y: 6.7 },
  ], []);

  // Efek untuk fluktuasi nilai
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = gaussianRandom() * fluctuationStdDev;
      const fluctuatingLevel = baseDoseRate + fluctuation;
      const finalLevel = Math.max(0, fluctuatingLevel);
      setMessage(prev => ({ ...prev, level: finalLevel.toFixed(2) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [baseDoseRate, fluctuationStdDev]);

  // useEffect untuk mengambil data setiap kali posisi berubah
  useEffect(() => {
    const getDoseRate = async () => {
      const avatarCoord = coordinates.find(c => c.id === positionId);
      if (!avatarCoord) return;

      // Perhitungan jarak dilakukan di frontend
      const dx = avatarCoord.x - sourcePosition.x;
      const dy = avatarCoord.y - sourcePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isShielded = isAvatarShielded(positionId);
      const shield_thickness = isShielded ? 4 : 0;
      
      // Panggilan API menyertakan semua parameter
      const url = `http://localhost:8000/calculate_dose?distance=${distance}&shield_thickness=${shield_thickness}&source_type=cs-137&activity=20`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
        const data = await response.json();
        setBaseDoseRate(data.level || 0);
        setFluctuationStdDev(data.std_dev || 0);
        setMessage(prev => ({ ...prev, description: data.description }));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setBaseDoseRate(0);
        setFluctuationStdDev(0);
        setMessage({
          level: "Error",
          description: "Tidak dapat mengambil data dari server.",
        });
      }
    };

    getDoseRate();
  }, [positionId, coordinates]);

  // Fungsi untuk memindahkan karakter
  const moveCharacter = useCallback((newId, newDirection) => {
    if (coordinates.some(c => c.id === newId)) {
      setPositionId(newId);
      setDirection(newDirection);
    }
  }, [coordinates]);

  // useEffect untuk input keyboard
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "q": moveCharacter(positionId + 9, "upLeft"); break;
        case "w": moveCharacter(positionId + 1, "upRight"); break;
        case "a": moveCharacter(positionId - 1, "downLeft"); break;
        case "s": moveCharacter(positionId - 9, "downRight"); break;
        default: break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [positionId, moveCharacter]);

  const handleEndClick = () => {
    navigate(-1);
  };

  const currentCoord = coordinates.find((coord) => coord.id === positionId);

  if (!currentCoord) {
    return <div>Loading...</div>;
  }

  const characterPositionStyle = {
    top: `${currentCoord.y * gridCellSize}px`,
    left: `${currentCoord.x * gridCellSize}px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
  };
  
  const SumberPositionStyle = {
    top: `${15 * gridCellSize}px`,
    left: `${18.2 * gridCellSize}px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    opacity: sumberOpacity,
  };
  const KontainerPositionStyle = {
    top: `${7.9 * gridCellSize}px`,
    left: `${10.7 * gridCellSize}px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    opacity: kontainerOpacity,
  };
  const ShieldingPositionStyle = {
    top: `${12 * gridCellSize}px`,
    left: `${17.2 * gridCellSize}px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    opacity: ShieldingOpacity,
  };
  const KaktusPositionStyle = {
    top: `${13.7 * gridCellSize}px`,
    left: `${2 * gridCellSize}px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
    opacity: KaktusOpacity,
  };

  return (
    <div className="simulation-container">
      {/* Area visual dari simulasi, dipusatkan */}
      <div className="game-area">
        <SVGComponent className="room" />
        <div className="character" style={characterPositionStyle}>
          <div className={`avatar-shield ${isAvatarShielded(positionId) ? 'active' : ''}`}></div>
          <img
            src={
              direction === "upLeft" ? characterUpLeft :
              direction === "upRight" ? characterUpRight :
              direction === "downLeft" ? characterDownLeft :
              characterDownRight
            }
            alt="character"
          />
          <div className="message">
            <div>Laju Paparan: {message.level} μSv/jam</div>
            <div>
              Keterangan: <br />
              {message.description}
            </div>
          </div>
        </div>
        <div
          className="sumber"
          style={SumberPositionStyle}
          onMouseOver={() => setSumberOpacity(1)}
          onMouseOut={() => setSumberOpacity(0)}
        >
          Sumber : Cs-137
          <br />
          Jenis Radiasi : Gamma
          <br />
          Aktivitas : 20 mCi
        </div>
        <div
          className="kontainer"
          style={KontainerPositionStyle}
          onMouseOver={() => setKontainerOpacity(1)}
          onMouseOut={() => setKontainerOpacity(0)}
        >
          Kontainer : Tempat penyimpanan sumber radiasi.
          <br />
          Kontainer ini dapat menahan radiasi agar tidak memancar ke
          lingkungan atau tubuh manusia. Hal ini karena berbahan timbal, 
          yang memiliki densitas tinggi. 
          Kontainer ini dapat menyimpan sumber
          radiasi baik dalam skala lab atau industri.
        </div>
        <div
          className="shielding"
          style={ShieldingPositionStyle}
          onMouseOver={() => setShieldingOpacity(1)}
          onMouseOut={() => setShieldingOpacity(0)}
        >
          Shielding : Adalah Perisai Radiasi yang biasa digunakan untuk menahan
          pancaran radiasi
          <br />
          Type : Pb (Timbal)
          <br />
          HVL : 4 cm untuk ketebalan Pb 4 cm
        </div>
        <div
          className="kaktus"
          style={KaktusPositionStyle}
          onMouseOver={() => setKaktusOpacity(1)}
          onMouseOut={() => setKaktusOpacity(0)}
        >
          Hai Aku Kaktus 😊
        </div>
      </div>

      {/* Lapisan UI yang membentang di seluruh container */}
      <div className="simulation-ui">
        <div className="controls-container">
          <div className="control-center-dot"></div>
          <button className="control-button up-left" onClick={() => moveCharacter(positionId + 9, "upLeft")}>↖</button>
          <button className="control-button up-right" onClick={() => moveCharacter(positionId + 1, "upRight")}>↗</button>
          <button className="control-button down-left" onClick={() => moveCharacter(positionId - 1, "downLeft")}>↙</button>
          <button className="control-button down-right" onClick={() => moveCharacter(positionId - 9, "downRight")}>↘</button>
        </div>
        <button className="end-button" onClick={handleEndClick}>End</button>
      </div>
    </div>
  );
};
export default GameArea;