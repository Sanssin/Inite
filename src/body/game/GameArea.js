import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translateSafetyMessage } from '../../utils/i18nMappings';
import './GameArea.css';
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

const validIdSet = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 65, 66, 68, 70, 71
]);

const gaussianRandom = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const GameArea = ({ positionId, onPositionChange, simulationData, coordinates, targetPoints, visitedPoints, onFinishMission, isMissionComplete, setupData }) => {
  const { t } = useTranslation(['simulation', 'common']);
  const [direction, setDirection] = useState('downLeft');
  const [displayedLevel, setDisplayedLevel] = useState('0.00');

  // State lokal untuk elemen UI hover
  const [sumberOpacity, setSumberOpacity] = useState(0);
  const [kontainerOpacity, setKontainerOpacity] = useState(0);
  const [ShieldingOpacity, setShieldingOpacity] = useState(0);
  const [KaktusOpacity, setKaktusOpacity] = useState(0);

  // ❇️ STATE UNTUK DATA DINAMIS DARI BACKEND
  const [sourceInfo, setSourceInfo] = useState(null);
  const [shieldingInfo, setShieldingInfo] = useState(null);

  // ❇️ FETCH DATA DARI BACKEND UNTUK TOOLTIP
  useEffect(() => {
    const fetchTooltipData = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || '';
        
        // Fetch source info dari backend
        const sourceResponse = await fetch(`${baseURL}/source_info`);
        if (sourceResponse.ok) {
          const sourceData = await sourceResponse.json();
          setSourceInfo(sourceData);
        }

        // Fetch shielding info dari backend
        const shieldingResponse = await fetch(`${baseURL}/shielding_info`);
        if (shieldingResponse.ok) {
          const shieldingData = await shieldingResponse.json();
          setShieldingInfo(shieldingData);
        }
      } catch (error) {
        console.log('Could not fetch tooltip data from backend, using defaults');
      }
    };

    fetchTooltipData();
  }, [setupData]); // Re-fetch ketika setupData berubah

  // ❇️ GENERATE TOOLTIP CONTENT BERDASARKAN DATA BACKEND
  const getSourceTooltipContent = () => {
    if (sourceInfo && sourceInfo.isotope_name) {
      const activity = sourceInfo.current_activity || sourceInfo.initial_activity;
      return `${t('tooltips.source')} : ${sourceInfo.isotope_name}<br />${t('tooltips.activity')} : ${activity?.toFixed(2) || 'N/A'} μCi<br />${t('tooltips.initialActivity')} : ${sourceInfo.initial_activity?.toFixed(2) || 'N/A'} μCi<br />${t('tooltips.radiationType')} : ${t('tooltips.gamma')}<br />${t('tooltips.gammaConstant')} : ${sourceInfo.gamma_constant?.toFixed(3) || 'N/A'}<br />${t('tooltips.halfLife')} : ${sourceInfo.half_life?.toFixed(2) || 'N/A'} ${t('tooltips.halfLifeUnit')}`;
    }
    
    // Fallback jika data backend belum tersedia
    if (setupData) {
      const sourceNames = {
        'cs-137': 'Cesium-137 (Cs-137)',
        'Co-60': 'Cobalt-60 (Co-60)', 
        'Na-22': 'Sodium-22 (Na-22)'
      };
      const sourceName = sourceNames[setupData.sourceType] || setupData.sourceType;
      return `${t('tooltips.source')} : ${sourceName}<br />${t('tooltips.activity')} : ${setupData.initialActivity} Ci<br />${t('tooltips.radiationType')} : ${t('tooltips.gamma')}`;
    }
    
    return `${t('tooltips.source')} : Cs-137<br />${t('tooltips.radiationType')} : ${t('tooltips.gamma')}`;
  };

  const getShieldingTooltipContent = () => {
    const materialName = t(`common:materials.${setupData?.shieldingMaterial || 'lead'}`);
    if (shieldingInfo && shieldingInfo.material_name) {
      const thickness = setupData.shieldingThickness || 0;
      return `${t('tooltips.shielding')} : ${t('tooltips.shieldingDesc')}<br />${t('tooltips.material')} : ${materialName}<br />${t('tooltips.thickness')} : ${thickness} cm<br />${t('tooltips.attenuationCoef')} : ${shieldingInfo.attenuation_coefficient?.toFixed(3) || 'N/A'} cm⁻¹<br />HVL : ${shieldingInfo.hvl?.toFixed(2) || 'N/A'} cm<br />${t('tooltips.effectiveness')} : ${t('tooltips.effectivenessDesc')}`;
    }
    
    // Fallback jika data backend belum tersedia
    if (setupData) {
      return `${t('tooltips.shielding')} : ${t('tooltips.shieldingDesc')}<br />${t('tooltips.material')} : ${materialName}<br />${t('tooltips.thickness')} : ${setupData.shieldingThickness} cm`;
    }
    
    return `${t('tooltips.shielding')} : ${t('tooltips.shieldingDesc')}`;
  };

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

  // const handleEndClick = () => navigate(-1); // Unused for now

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
      translateSafetyMessage(simulationData.description, t) || simulationData.description
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
      />
      
      {/* Message */}
      <div className="message" style={messagePositionStyle}>
        <div>{t('tooltips.doseRateLabel')} {displayedLevel} {t('common:units.microSvPerHour')}</div>
        <div>{t('tooltips.description')} <br />{description}</div>
      </div>
      
      {/* Hover Elements */}
      <div className="sumber" style={SumberPositionStyle} onMouseOver={() => setSumberOpacity(1)} onMouseOut={() => setSumberOpacity(0)}>
          <div dangerouslySetInnerHTML={{ __html: getSourceTooltipContent() }} />
      </div>
      <div className="kontainer" style={KontainerPositionStyle} onMouseOver={() => setKontainerOpacity(1)} onMouseOut={() => setKontainerOpacity(0)}>
          {t('tooltips.container')} : {t('tooltips.containerDesc')}
      </div>
      <div className="shielding" style={ShieldingPositionStyle} onMouseOver={() => setShieldingOpacity(1)} onMouseOut={() => setShieldingOpacity(0)}>
          <div dangerouslySetInnerHTML={{ __html: getShieldingTooltipContent() }} />
      </div>
      <div className="kaktus" style={KaktusPositionStyle} onMouseOver={() => setKaktusOpacity(1)} onMouseOut={() => setKaktusOpacity(0)}>
          {t('tooltips.cactus')}
      </div>

      {/* Control System */}
      <div className="simulation-ui">
        <div className="controls-container">
          <div className="control-center-dot"></div>
          <button 
            className="control-button up-left" 
            onClick={() => moveCharacter(positionId + 9, "upLeft")}
          >↖</button>
          <button 
            className="control-button up-right" 
            onClick={() => moveCharacter(positionId + 1, "upRight")}
          >↗</button>
          <button 
            className="control-button down-left" 
            onClick={() => moveCharacter(positionId - 1, "downLeft")}
          >↙</button>
          <button 
            className="control-button down-right" 
            onClick={() => moveCharacter(positionId - 9, "downRight")}
          >↘</button>
        </div>
        <button 
          className="end-button" 
          onClick={onFinishMission}
          style={{
            backgroundColor: isMissionComplete ? '#fd7e14' : '#6c757d',
            cursor: isMissionComplete ? 'pointer' : 'not-allowed',
          }}
        >
          {t('game.finishMission')}
        </button>
      </div>
    </div>
  );
};

export default GameArea;

