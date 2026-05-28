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
import { backendDataService } from '../../services/BackendDataService';

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
    style.color = '#e6e6e6';
    style.border = '2px solid #28a745';
    return <div style={style}>✓</div>;
  } else {
    style.backgroundColor = 'rgba(204, 166, 11, 0.7)';
    style.color = '#0a0a0a';
    style.border = '2px solid #cca60b';
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

  // ❇️ GENERATE TOOLTIP CONTENT BERDASARKAN DATA BACKEND SECARA STATELESS (MENANGGULANGI RACE CONDITION)
  const getSourceTooltipContent = () => {
    if (!setupData) {
      return `${t('tooltips.source')} : Cs-137<br />${t('tooltips.radiationType')} : ${t('tooltips.gamma')}`;
    }

    const fallbackIsotopeData = backendDataService.getFallbackIsotopeData();
    const isotope = fallbackIsotopeData[setupData.sourceType] || fallbackIsotopeData['cs-137'];

    // Hitung aktivitas saat ini dengan peluruhan (decay) untuk akurasi info tooltip
    const today = new Date();
    const prodDate = new Date(isotope.production_date);
    const timeElapsedYears = (today - prodDate) / (1000 * 60 * 60 * 24 * 365.25);
    const currentActivity = setupData.initialActivity * Math.pow(0.5, timeElapsedYears / isotope.half_life_years);

    return `${t('tooltips.source')} : ${isotope.name}<br />${t('tooltips.activity')} : ${currentActivity.toFixed(2)} µCi<br />${t('tooltips.initialActivity')} : ${setupData.initialActivity} µCi<br />${t('tooltips.radiationType')} : ${t('tooltips.gamma')}<br />${t('tooltips.gammaConstant')} : ${isotope.gamma_constant.toFixed(3)}<br />${t('tooltips.halfLife')} : ${isotope.half_life_years.toFixed(2)} ${t('tooltips.halfLifeUnit')}`;
  };

  const getShieldingTooltipContent = () => {
    if (!setupData) {
      return `${t('tooltips.shielding')} : ${t('tooltips.shieldingDesc')}`;
    }

    const materialName = t(`common:materials.${setupData.shieldingMaterial || 'lead'}`);
    const thickness = setupData.shieldingThickness || 0;

    const fallbackMaterialData = backendDataService.getFallbackMaterialData(setupData.sourceType);
    const keyMapping = {
      lead: 'timbal',
      concrete: 'beton',
      glass: 'kaca',
      steel: 'baja'
    };
    const fallbackKey = keyMapping[setupData.shieldingMaterial.toLowerCase()] || setupData.shieldingMaterial.toLowerCase();
    const material = fallbackMaterialData[fallbackKey] || fallbackMaterialData['timbal'];

    // Hitung HVL dinamis berdasarkan koefisien atenuasi rujukan
    const mu = material.attenuation_coefficient || 1.0;
    const hvl = (Math.log(2) / mu);

    return `${t('tooltips.shielding')} : ${t('tooltips.shieldingDesc')}<br />${t('tooltips.material')} : ${materialName}<br />${t('tooltips.thickness')} : ${thickness} cm<br />${t('tooltips.attenuationCoef')} : ${mu.toFixed(3)} cm⁻¹<br />HVL : ${hvl.toFixed(2)} cm<br />${t('tooltips.effectiveness')} : ${t('tooltips.effectivenessDesc')}`;
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

