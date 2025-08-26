import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameArea.css';
import SVGComponent from './assets/svgviewer-react-output';
import characterUpLeft from './assets/avatar/Atas-Kiri.png';
import characterUpRight from './assets/avatar/Atas-Kanan.png';
import characterDownLeft from './assets/avatar/Bawah-Kiri.png';
import characterDownRight from './assets/avatar/Bawah-Kanan.png';
import shieldingWall from '../../assets/Shielding.png';

const gridCellSize = 25;

const visualShieldingIds = new Set([24, 32, 33]);
const shieldedIds = new Set([24, 25, 26, 32, 33, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 60, 61, 62, 68, 70, 71]);
const isAvatarShielded = (id) => shieldedIds.has(id);

const validIdSet = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 65, 66, 68, 70, 71
]);

const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const GameArea = ({ positionId, onPositionChange, simulationData, coordinates }) => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState('downLeft');
  const [displayedLevel, setDisplayedLevel] = useState(0);

  // State lokal untuk elemen UI hover
  const [sumberOpacity, setSumberOpacity] = useState(0);
  const [kontainerOpacity, setKontainerOpacity] = useState(0);
  const [ShieldingOpacity, setShieldingOpacity] = useState(0);
  const [KaktusOpacity, setKaktusOpacity] = useState(0);

  useEffect(() => {
    if (!simulationData) return;

    const { level, std_dev } = simulationData;
    const interval = setInterval(() => {
      const fluctuation = gaussianRandom() * std_dev;
      const fluctuatingLevel = level + fluctuation;
      const finalLevel = Math.max(0, fluctuatingLevel);
      setDisplayedLevel(finalLevel.toFixed(2));
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationData]);

  const moveCharacter = useCallback((newId, newDirection) => {
    if (validIdSet.has(newId)) {
      onPositionChange(newId);
      setDirection(newDirection);
    }
  }, [onPositionChange]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case 'q': moveCharacter(positionId + 9, 'upLeft'); break;
        case 'w': moveCharacter(positionId + 1, 'upRight'); break;
        case 'a': moveCharacter(positionId - 1, 'downLeft'); break;
        case 's': moveCharacter(positionId - 9, 'downRight'); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [positionId, moveCharacter]);

  const handleEndClick = () => navigate(-1);

  const currentCoord = coordinates.find((coord) => coord.id === positionId);

  if (!currentCoord) {
    return <div>Loading character...</div>;
  }

  const characterStyle = { top: `${currentCoord.y * gridCellSize}px`, left: `${currentCoord.x * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: visualShieldingIds.has(positionId) ? 1 : 3 };
  const messagePositionStyle = { top: `${currentCoord.y * gridCellSize}px`, left: `${currentCoord.x * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%) translateY(-95px)' };
  const SumberPositionStyle = { top: `${15 * gridCellSize}px`, left: `${18.2 * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%)', opacity: sumberOpacity };
  const KontainerPositionStyle = { top: `${7.9 * gridCellSize}px`, left: `${10.7 * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%)', opacity: kontainerOpacity };
  const ShieldingPositionStyle = { top: `${12 * gridCellSize}px`, left: `${17.2 * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%)', opacity: ShieldingOpacity };
  const KaktusPositionStyle = { top: `${13.7 * gridCellSize}px`, left: `${2 * gridCellSize}px`, position: 'absolute', transform: 'translate(-50%, -50%)', opacity: KaktusOpacity };

  const description = simulationData ? simulationData.description : 'Loading...';

  return (
    <div className="game-area">
      <SVGComponent className="room" />
      <div className="character" style={characterStyle}>
        <div className={`avatar-shield ${isAvatarShielded(positionId) ? 'active' : ''}`}></div>
        <img src={direction === 'upLeft' ? characterUpLeft : direction === 'upRight' ? characterUpRight : direction === 'downLeft' ? characterDownLeft : characterDownRight} alt="character" />
      </div>
      <div className="message" style={messagePositionStyle}>
        <div>Laju Paparan: {displayedLevel} μSv/jam</div>
        <div>Keterangan: <br />{description}</div>
      </div>
      <img src={shieldingWall} alt="shielding wall" className="shielding-wall" />
      
      {/* Elemen hover tetap di sini */}
      <div className="sumber" style={SumberPositionStyle} onMouseOver={() => setSumberOpacity(1)} onMouseOut={() => setSumberOpacity(0)}>
          Sumber : Cs-137<br />Jenis Radiasi : Gamma
      </div>
      <div className="kontainer" style={KontainerPositionStyle} onMouseOver={() => setKontainerOpacity(1)} onMouseOut={() => setKontainerOpacity(0)}>
          Kontainer : Tempat penyimpanan sumber radiasi.<br />Kontainer ini dapat menahan radiasi agar tidak memancar ke lingkungan atau tubuh manusia. Hal ini karena berbahan timbal, yang memiliki densitas tinggi. Kontainer ini dapat menyimpan sumber radiasi baik dalam skala lab atau industri.
      </div>
      <div className="shielding" style={ShieldingPositionStyle} onMouseOver={() => setShieldingOpacity(1)} onMouseOut={() => setShieldingOpacity(0)}>
          Shielding : Adalah Perisai Radiasi yang biasa digunakan untuk menahan pancaran radiasi<br />Type : Pb (Timbal)<br />HVL : 4 cm untuk ketebalan Pb 4 cm
      </div>
      <div className="kaktus" style={KaktusPositionStyle} onMouseOver={() => setKaktusOpacity(1)} onMouseOut={() => setKaktusOpacity(0)}>
          Hai Aku Kaktus 😊
      </div>

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
