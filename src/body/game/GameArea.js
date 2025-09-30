import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameArea.css';
import SVGComponent from './assets/svgviewer-react-output';
import characterUpLeft from './assets/avatar/Atas-Kiri.png';
import characterUpRight from './assets/avatar/Atas-Kanan.png';
import characterDownLeft from './assets/avatar/Bawah-Kiri.png';
import characterDownRight from './assets/avatar/Bawah-Kanan.png';
import shieldingWall from '../../assets/Shielding.png';

// ❇️ SMART GAME SCALING SYSTEM
const useGameScaling = () => {
  const [gameScale, setGameScale] = useState(1);
  const [baseGridSize, setBaseGridSize] = useState(25);

  useEffect(() => {
    const calculateGameScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal scale based on screen size
      let scale = 1;
      
      if (viewportWidth <= 430) { // Mobile
        if (viewportWidth <= 375) { // Small mobile (iPhone SE)
          scale = viewportWidth / 430; // Scale down for tiny screens
        } else { // Regular mobile
          scale = Math.min(viewportWidth / 430, viewportHeight / 700);
        }
      } else if (viewportWidth <= 768) { // Tablet
        scale = Math.min(viewportWidth / 800, 1.2);
      }
      
      // Smart viewport tall adjustment
      const isSmartViewport = document.documentElement.classList.contains('smart-viewport-tall');
      if (isSmartViewport) {
        const viewportZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--viewport-zoom')) || 1;
        scale = scale * viewportZoom;
      }
      
      setGameScale(scale);
      setBaseGridSize(25 * scale);
    };

    calculateGameScale();
    window.addEventListener('resize', calculateGameScale);
    window.addEventListener('orientationchange', () => {
      setTimeout(calculateGameScale, 200);
    });

    return () => {
      window.removeEventListener('resize', calculateGameScale);
      window.removeEventListener('orientationchange', calculateGameScale);
    };
  }, []);

  return { gameScale, gridCellSize: baseGridSize };
};

// ❇️ SCALED SURVEY MARKER COMPONENT
const SurveyMarker = ({ x, y, isVisited, gameScale, gridCellSize }) => {
  const scaledSize = Math.max(20, 30 * gameScale); // Minimum 20px, scales up
  const scaledFontSize = Math.max(12, 20 * gameScale); // Minimum 12px font
  
  const style = {
    position: 'absolute',
    top: `${y * gridCellSize}px`,
    left: `${x * gridCellSize}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    width: `${scaledSize}px`,
    height: `${scaledSize}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${scaledFontSize}px`,
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

const validIdSet = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 65, 66, 68, 70, 71
]);

const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const GameArea = ({ positionId, onPositionChange, simulationData, coordinates, targetPoints, visitedPoints, onFinishMission, isMissionComplete }) => {
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

  // ❇️ SCALED POSITIONING SYSTEM  
  const scaledCharacterSize = Math.max(40, 65 * gameScale);
  const scaledImageTransform = `scale(${Math.max(0.8, gameScale)})`;
  
  const characterStyle = { 
    top: `${currentCoord.y * gridCellSize}px`, 
    left: `${currentCoord.x * gridCellSize}px`, 
    position: 'absolute', 
    transform: 'translate(-50%, -50%)', 
    zIndex: visualShieldingIds.has(positionId) ? 1 : 3,
    width: `${scaledCharacterSize}px`,
    height: `${scaledCharacterSize}px`,
  };
  
  const messagePositionStyle = { 
    top: `${currentCoord.y * gridCellSize}px`, 
    left: `${currentCoord.x * gridCellSize}px`, 
    position: 'absolute', 
    transform: `translate(-50%, -50%) translateY(-${Math.max(60, 95 * gameScale)}px) scale(${Math.max(0.9, gameScale)})`,
    transformOrigin: 'center bottom',
    fontSize: `${Math.max(10, 14 * gameScale)}px`,
  };
  
  // ❇️ SCALED HOVER ELEMENTS
  const scaledHoverFontSize = Math.max(8, 12 * gameScale);
  const hoverTransformScale = `scale(${Math.max(0.9, gameScale)})`;
  
  const SumberPositionStyle = { 
    top: `${15 * gridCellSize}px`, 
    left: `${18.2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: `translate(-50%, -50%) ${hoverTransformScale}`, 
    opacity: sumberOpacity,
    fontSize: `${scaledHoverFontSize}px`,
    transformOrigin: 'center',
  };
  
  const KontainerPositionStyle = { 
    top: `${7.9 * gridCellSize}px`, 
    left: `${10.7 * gridCellSize}px`, 
    position: 'absolute', 
    transform: `translate(-50%, -50%) ${hoverTransformScale}`, 
    opacity: kontainerOpacity,
    fontSize: `${scaledHoverFontSize}px`,
    transformOrigin: 'center',
  };
  
  const ShieldingPositionStyle = { 
    top: `${12 * gridCellSize}px`, 
    left: `${17.2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: `translate(-50%, -50%) ${hoverTransformScale}`, 
    opacity: ShieldingOpacity,
    fontSize: `${scaledHoverFontSize}px`,
    transformOrigin: 'center',
  };
  
  const KaktusPositionStyle = { 
    top: `${13.7 * gridCellSize}px`, 
    left: `${2 * gridCellSize}px`, 
    position: 'absolute', 
    transform: `translate(-50%, -50%) ${hoverTransformScale}`, 
    opacity: KaktusOpacity,
    fontSize: `${scaledHoverFontSize}px`,
    transformOrigin: 'center',
  };

  const description = simulationData ? simulationData.description : 'Loading...';

  return (
    <div className="game-area" style={{transform: `scale(${gameScale})`, transformOrigin: 'center top'}}>
      <SVGComponent className="room" />

      {/* ❇️ SCALED SURVEY MARKERS */}
      {targetPoints.map(pointId => {
        const coord = coordinates.find(c => c.id === pointId);
        if (!coord) return null;
        return <SurveyMarker key={pointId} x={coord.x} y={coord.y} isVisited={visitedPoints.has(pointId)} gameScale={gameScale} gridCellSize={gridCellSize} />
      })}

      {/* ❇️ SCALED AVATAR */}
      <div className="character" style={characterStyle}>
        <div className={`avatar-shield ${isAvatarShielded(positionId) ? 'active' : ''}`}></div>
        <img 
          src={direction === 'upLeft' ? characterUpLeft : direction === 'upRight' ? characterUpRight : direction === 'downLeft' ? characterDownLeft : characterDownRight} 
          alt="character" 
          style={{
            width: '100%',
            height: '100%',
            transform: scaledImageTransform,
            transformOrigin: 'center center',
          }}
        />
      </div>
      
      {/* ❇️ SCALED MESSAGE */}
      <div className="message" style={messagePositionStyle}>
        <div>Laju Paparan: {displayedLevel} μSv/jam</div>
        <div>Keterangan: <br />{description}</div>
      </div>
      
      {/* ❇️ SCALED SHIELDING WALL */}
      <img 
        src={shieldingWall} 
        alt="shielding wall" 
        className="shielding-wall" 
        style={{
          transform: `scale(${Math.max(0.8, gameScale)})`,
          transformOrigin: 'center center',
        }}
      />
      
      {/* ❇️ SCALED HOVER ELEMENTS */}
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

      {/* ❇️ SCALED CONTROL SYSTEM */}
      <div className="simulation-ui" style={{transform: `scale(${Math.max(0.9, gameScale)})`, transformOrigin: 'bottom right'}}>
        <div className="controls-container" style={{
          transform: `scale(${Math.max(0.9, gameScale)})`,
          transformOrigin: 'center',
        }}>
          <div className="control-center-dot" style={{
            transform: `scale(${Math.max(0.8, gameScale)})`,
          }}></div>
          <button 
            className="control-button up-left" 
            onClick={() => moveCharacter(positionId + 9, "upLeft")}
            style={{
              fontSize: `${Math.max(12, 16 * gameScale)}px`,
              minWidth: `${Math.max(30, 40 * gameScale)}px`,
              minHeight: `${Math.max(30, 40 * gameScale)}px`,
            }}
          >↖</button>
          <button 
            className="control-button up-right" 
            onClick={() => moveCharacter(positionId + 1, "upRight")}
            style={{
              fontSize: `${Math.max(12, 16 * gameScale)}px`,
              minWidth: `${Math.max(30, 40 * gameScale)}px`,
              minHeight: `${Math.max(30, 40 * gameScale)}px`,
            }}
          >↗</button>
          <button 
            className="control-button down-left" 
            onClick={() => moveCharacter(positionId - 1, "downLeft")}
            style={{
              fontSize: `${Math.max(12, 16 * gameScale)}px`,
              minWidth: `${Math.max(30, 40 * gameScale)}px`,
              minHeight: `${Math.max(30, 40 * gameScale)}px`,
            }}
          >↙</button>
          <button 
            className="control-button down-right" 
            onClick={() => moveCharacter(positionId - 9, "downRight")}
            style={{
              fontSize: `${Math.max(12, 16 * gameScale)}px`,
              minWidth: `${Math.max(30, 40 * gameScale)}px`,
              minHeight: `${Math.max(30, 40 * gameScale)}px`,
            }}
          >↘</button>
        </div>
        <button 
          className="end-button" 
          onClick={onFinishMission}
          style={{
            backgroundColor: isMissionComplete ? '#fd7e14' : '#6c757d',
            cursor: isMissionComplete ? 'pointer' : 'not-allowed',
            fontSize: `${Math.max(12, 16 * gameScale)}px`,
            padding: `${Math.max(8, 12 * gameScale)}px ${Math.max(16, 24 * gameScale)}px`,
            minHeight: `${Math.max(36, 48 * gameScale)}px`,
            transform: `scale(${Math.max(0.9, gameScale)})`,
            transformOrigin: 'center',
          }}
        >
          Selesaikan Misi
        </button>
      </div>
    </div>
  );
};

export default GameArea;

