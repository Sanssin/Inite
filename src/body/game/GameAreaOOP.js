import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameAreaOOP.css';
import SVGComponent from './assets/svgviewer-react-output';
import characterUpLeft from './assets/avatar/Atas-Kiri.png';
import characterUpRight from './assets/avatar/Atas-Kanan.png';
import characterDownLeft from './assets/avatar/Bawah-Kiri.png';
import characterDownRight from './assets/avatar/Bawah-Kanan.png';
import shieldingWall from '../../assets/Shielding.png';

const gridCellSize = 25;

// Komponen untuk penanda titik survei
const SurveyMarker = ({ x, y, isVisited }) => {
  const style = {
    position: 'absolute',
    top: `${y * gridCellSize}px`,
    left: `${x * gridCellSize}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  };

  if (isVisited) {
    style.backgroundColor = 'rgba(40, 167, 69, 0.7)';
    style.color = 'white';
    style.border = '2px solid #28a745';
    return <div style={style}>✓</div>;
  } else {
    style.backgroundColor = 'rgba(224, 204, 11, 0.7)';
    style.color = 'black';
    style.border = '2px solid #E0CC0B';
    style.animation = 'pulse 2s infinite';
    return <div style={style}>!</div>;
  }
};

const visualShieldingIds = new Set([24, 32, 33]);
const shieldedIds = new Set([24, 25, 26, 32, 33, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 60, 61, 62, 68, 70, 71]);
const isAvatarShielded = (id) => shieldedIds.has(id);

const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const GameAreaOOP = ({ gameState, onPositionChange, simulationData, coordinates, targetPoints, visitedPoints, onFinishMission, isMissionComplete }) => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState('downLeft');
  const [displayedLevel, setDisplayedLevel] = useState('0.00');

  // State lokal untuk elemen UI hover
  const [sumberOpacity, setSumberOpacity] = useState(0);
  const [kontainerOpacity, setKontainerOpacity] = useState(0);
  const [ShieldingOpacity, setShieldingOpacity] = useState(0);
  const [KaktusOpacity, setKaktusOpacity] = useState(0);

  // Use gameState instance for position management
  const positionId = gameState?.avatar.positionId || 22;

  useEffect(() => {
    if (!simulationData || simulationData.error) return;

    const { level, std_dev } = simulationData;
    if (level === undefined || std_dev === undefined || isNaN(level) || isNaN(std_dev)) return;
    
    const interval = setInterval(() => {
      const fluctuation = gaussianRandom() * std_dev;
      const fluctuatingLevel = level + fluctuation;
      const finalLevel = Math.max(0, fluctuatingLevel);
      
      // Safety check for toFixed
      if (finalLevel !== undefined && !isNaN(finalLevel)) {
        setDisplayedLevel(finalLevel.toFixed(2));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationData]);

  const moveCharacter = useCallback((newId, newDirection) => {
    if (gameState && gameState.canMoveTo(newId)) {
      // Use OOP method to move avatar
      const success = gameState.moveAvatar(newId, newDirection);
      
      if (success) {
        setDirection(newDirection);
        onPositionChange?.(newId); // Notify parent component
      }
    }
  }, [gameState, onPositionChange]);

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

  const currentCoord = coordinates.find((coord) => coord.id === positionId);

  if (!currentCoord) {
    return <div>Loading character...</div>;
  }

  // Positioning system  
  const characterStyle = { 
    top: `${currentCoord.y * gridCellSize}px`, 
    left: `${currentCoord.x * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    zIndex: visualShieldingIds.has(positionId) ? 1 : 3
  };
  
  const messagePositionStyle = { 
    top: `${currentCoord.y * gridCellSize}px`, 
    left: `${currentCoord.x * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%) translateY(-95px)'
  };
  
  const SumberPositionStyle = { 
    top: `${15 * gridCellSize}px`, 
    left: `${18.2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    opacity: sumberOpacity
  };
  
  const KontainerPositionStyle = { 
    top: `${7.9 * gridCellSize}px`, 
    left: `${10.7 * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    opacity: kontainerOpacity
  };
  
  const ShieldingPositionStyle = { 
    top: `${12 * gridCellSize}px`, 
    left: `${17.2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    opacity: ShieldingOpacity
  };
  
  const KaktusPositionStyle = { 
    top: `${13.7 * gridCellSize}px`, 
    left: `${2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    opacity: KaktusOpacity
  };

  const description = simulationData ? 
    (simulationData.error ? 
      simulationData.message : 
      simulationData.description
    ) : 'Loading...';

  return (
    <div className="game-area">
      <SVGComponent className="room" />

      {/* Survey Markers */}
      {targetPoints.map(pointId => {
        const coord = coordinates.find(c => c.id === pointId);
        if (!coord) return null;
        return <SurveyMarker key={pointId} x={coord.x} y={coord.y} isVisited={visitedPoints.has(pointId)} />
      })}

      {/* Avatar */}
      <div className="character" style={characterStyle}>
        <div className={`avatar-shield ${isAvatarShielded(positionId) ? 'active' : ''}`}></div>
        <img 
          src={direction === 'upLeft' ? characterUpLeft : direction === 'upRight' ? characterUpRight : direction === 'downLeft' ? characterDownLeft : characterDownRight} 
          alt="character" 
        />
      </div>
      
      {/* Shielding Wall - always displayed, z-index 2 will cover character when needed */}
      <img 
        src={shieldingWall} 
        alt="shielding wall" 
        className="shielding-wall"
        style={{
          position: 'absolute',
          top: `${11.5 * gridCellSize}px`,
          left: `${17.2 * gridCellSize}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: '80px',
          height: '120px'
        }}
      />
      
      {/* Dose Rate Display (with fluctuation) */}
      <div className="dose-display" style={messagePositionStyle}>
        <div className="dose-box">
          <span className="dose-rate">{displayedLevel}</span>
          <span className="dose-unit">μSv/jam</span>
        </div>
      </div>

      {/* Interactive Elements with Hover Info */}
      <div 
        className="sumber-area"
        style={{
          position: 'absolute',
          top: `${14.5 * gridCellSize}px`,
          left: `${17.5 * gridCellSize}px`,
          width: `${2 * gridCellSize}px`,
          height: `${2 * gridCellSize}px`,
          cursor: 'pointer',
          zIndex: 1
        }}
        onMouseEnter={() => setSumberOpacity(1)}
        onMouseLeave={() => setSumberOpacity(0)}
      />

      <div 
        className="kontainer-area"
        style={{
          position: 'absolute',
          top: `${7.5 * gridCellSize}px`,
          left: `${10 * gridCellSize}px`,
          width: `${1.5 * gridCellSize}px`,
          height: `${1.5 * gridCellSize}px`,
          cursor: 'pointer',
          zIndex: 1
        }}
        onMouseEnter={() => setKontainerOpacity(1)}
        onMouseLeave={() => setKontainerOpacity(0)}
      />

      <div 
        className="shielding-area"
        style={{
          position: 'absolute',
          top: `${11.5 * gridCellSize}px`,
          left: `${16.5 * gridCellSize}px`,
          width: `${2 * gridCellSize}px`,
          height: `${3 * gridCellSize}px`,
          cursor: 'pointer',
          zIndex: 1
        }}
        onMouseEnter={() => setShieldingOpacity(1)}
        onMouseLeave={() => setShieldingOpacity(0)}
      />

      <div 
        className="kaktus-area"
        style={{
          position: 'absolute',
          top: `${13 * gridCellSize}px`,
          left: `${1.5 * gridCellSize}px`,
          width: `${1.5 * gridCellSize}px`,
          height: `${2 * gridCellSize}px`,
          cursor: 'pointer',
          zIndex: 1
        }}
        onMouseEnter={() => setKaktusOpacity(1)}
        onMouseLeave={() => setKaktusOpacity(0)}
      />

      {/* Hover Information Boxes */}
      <div className="info-box sumber-info" style={SumberPositionStyle}>
        <h4>🔬 Sumber Radiasi</h4>
        <p><strong>Tipe:</strong> {simulationData?.source_type || 'Cs-137'}</p>
        <p><strong>Aktivitas:</strong> {simulationData?.current_activity?.toFixed(2) || '0'} μCi</p>
        <p><strong>Produksi:</strong> {simulationData?.production_date || '1999-09-01'}</p>
        <p>Sumber radioisotop yang terlindung dalam wadah khusus</p>
      </div>

      <div className="info-box kontainer-info" style={KontainerPositionStyle}>
        <h4>📦 Kontainer Penyimpanan</h4>
        <p><strong>Material:</strong> Stainless Steel</p>
        <p><strong>Fungsi:</strong> Penyimpanan Aman</p>
        <p>Kontainer khusus untuk menyimpan peralatan radiologi</p>
      </div>

      <div className="info-box shielding-info" style={ShieldingPositionStyle}>
        <h4>🛡️ Perisai Radiasi</h4>
        <p><strong>Material:</strong> {simulationData?.shielding_material || 'Timbal'}</p>
        <p><strong>Tebal:</strong> {simulationData?.shield_thickness || '1'} cm</p>
        <p><strong>HVL:</strong> {simulationData?.hvl || '0.58'} cm</p>
        <p>Mengurangi paparan radiasi hingga {((1 - Math.exp(-1.2 * (simulationData?.shield_thickness || 1))) * 100).toFixed(1)}%</p>
      </div>

      <div className="info-box kaktus-info" style={KaktusPositionStyle}>
        <h4>🌵 Tanaman Hias</h4>
        <p><strong>Jenis:</strong> Kaktus Indoor</p>
        <p><strong>Status:</strong> Dekoratif</p>
        <p>Tanaman penghias ruangan - tidak memberikan perlindungan radiasi</p>
      </div>

      {/* Mission Control Panel */}
      <div className="mission-control">
        <div className="mission-info">
          <h3>📍 Status Misi</h3>
          <p>Titik Survei: {visitedPoints.size}/{targetPoints.length}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{
                width: `${(visitedPoints.size / Math.max(targetPoints.length, 1)) * 100}%`,
                backgroundColor: isMissionComplete ? '#28a745' : '#ffc107'
              }}
            />
          </div>
          <button 
            className={`finish-mission-btn ${isMissionComplete ? 'enabled' : 'disabled'}`}
            onClick={onFinishMission}
            disabled={!isMissionComplete}
          >
            {isMissionComplete ? '🏆 Selesaikan Misi' : '⏳ Selesaikan Survei'}
          </button>
        </div>
      </div>

      {/* Radiation Description */}
      <div className="radiation-description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default GameAreaOOP;