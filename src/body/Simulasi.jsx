import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import GameArea from "./game/GameArea";
import geigerSound from '../assets/geiger.mp3';
import { GameState } from "../classes/GameState";
import { APIClient } from "../classes/APIClient";
import { AudioManager } from "../classes/AudioManager";
import { translateSafetyMessage } from '../utils/i18nMappings';

// ❇️ SMART VIEWPORT DETECTION HOOK
const useSmartViewport = () => {
  const [isSmartViewport, setIsSmartViewport] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);

  useEffect(() => {
    const detectSmartViewport = () => {
      const hasSmartViewportClass = document.documentElement.classList.contains('smart-viewport-tall');
      const viewportZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--viewport-zoom')) || 1;

      setIsSmartViewport(hasSmartViewportClass);
      setZoomFactor(viewportZoom);
    };

    detectSmartViewport();
    window.addEventListener('resize', detectSmartViewport);
    window.addEventListener('orientationchange', () => {
      setTimeout(detectSmartViewport, 200);
    });

    return () => {
      window.removeEventListener('resize', detectSmartViewport);
      window.removeEventListener('orientationchange', detectSmartViewport);
    };
  }, []);

  return { isSmartViewport, zoomFactor };
};

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const DESKTOP_VIEWPORT_MIN_WIDTH = 980;
const LANDSCAPE_VIEWPORT_MIN_WIDTH = 850;
const ZOOM_OUT_SCALE_THRESHOLD = 0.9;

const evaluateDesktopModeGate = () => {
  const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
  const smallestScreenSide = Math.min(window.screen.width || viewportWidth, window.screen.height || viewportWidth);
  const isLikelyMobileDevice = isTouchDevice && (isMobileUserAgent || smallestScreenSide <= 1024);
  const zoomScale = window.visualViewport?.scale || 1;
  const isLandscape = window.matchMedia('(orientation: landscape)').matches;

  const hasDesktopSizedViewport = viewportWidth >= DESKTOP_VIEWPORT_MIN_WIDTH;
  const hasDesktopUserAgent = !isMobileUserAgent;
  const hasWideLandscapeViewport = isLandscape && viewportWidth >= LANDSCAPE_VIEWPORT_MIN_WIDTH;
  const hasZoomedOutViewport = zoomScale <= ZOOM_OUT_SCALE_THRESHOLD;
  const isDesktopModeReady = hasDesktopSizedViewport || hasDesktopUserAgent || hasWideLandscapeViewport || hasZoomedOutViewport;

  return {
    isGateActive: isLikelyMobileDevice && !isDesktopModeReady,
    viewportWidth,
    zoomScale
  };
};

const MobileDesktopModeGate = ({ onRecheck, checkStatus, viewportWidth, zoomScale }) => {
  const { t } = useTranslation('simulation');
  const formattedWidth = Math.round(viewportWidth);
  const formattedZoom = Number(zoomScale || 1).toFixed(2);

  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.72)',
    zIndex: 1999,
    backdropFilter: 'blur(4px)'
  };

  const notificationStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    color: '#e6e6e6',
    padding: '25px 30px',
    borderRadius: '15px',
    border: '2px solid #fd7e14',
    zIndex: 2000,
    maxWidth: '90vw',
    width: 'min(680px, 90vw)',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(10, 10, 10, 0.3)',
    animation: 'fadeInScale 0.3s ease-out'
  };

  const titleStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#fd7e14'
  };

  const messageStyle = {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '14px',
    textAlign: 'left'
  };

  const buttonStyle = {
    backgroundColor: '#fd7e14',
    color: '#e6e6e6',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  };

  const stepListStyle = {
    textAlign: 'left',
    margin: '0 0 14px 0',
    paddingLeft: '20px',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  };

  const helperTextStyle = {
    fontSize: '0.9rem',
    marginBottom: '16px',
    color: '#ffd8a8'
  };

  const failedStatusStyle = {
    fontSize: '0.9rem',
    marginBottom: '16px',
    color: '#ffb3b3'
  };

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
      <div style={backdropStyle}></div>
      <div style={notificationStyle}>
        <div style={titleStyle}>
          📱 {t('game.desktopModeRequiredTitle')}
        </div>
        <div style={messageStyle}>
          {t('game.desktopModeRequiredIntro')}
        </div>
        <div style={messageStyle}>
          <strong>{t('game.desktopModeInstructionTitle')}</strong>
        </div>
        <ol style={stepListStyle}>
          <li>{t('game.desktopStepChrome')}</li>
          <li>{t('game.desktopStepSamsung')}</li>
          <li>{t('game.desktopStepSafari')}</li>
          <li>{t('game.desktopStepAlternative')}</li>
        </ol>
        <p style={helperTextStyle}>
          {t('game.desktopModeDiagnostic', { viewportWidth: formattedWidth, zoomScale: formattedZoom })}
        </p>
        {checkStatus === 'failed' && (
          <p style={failedStatusStyle}>{t('game.desktopModeRecheckFailed')}</p>
        )}
        <button style={buttonStyle} onClick={onRecheck}>
          {t('game.desktopModeRecheckButton')}
        </button>
      </div>
    </>
  );
};

const shieldedIds = new Set([24, 25, 26, 32, 33, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 60, 61, 62, 68, 70, 71]);
const isAvatarShielded = (id) => shieldedIds.has(id);

const coordinates = [
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
  { id: 24, x: 19.1, y: 13.7 }, { id: 25, x: 21, y: 12.5 },
  { id: 26, x: 22.8, y: 11.5 }, { id: 28, x: 8.9, y: 17.5 },
  { id: 29, x: 10.5, y: 16.7 }, { id: 30, x: 12.2, y: 15.5 },
  { id: 31, x: 14.1, y: 14.5 }, { id: 32, x: 15.7, y: 13.5 },
  { id: 33, x: 17.2, y: 12.7 }, { id: 34, x: 19.1, y: 11.5 },
  { id: 37, x: 7.2, y: 16.7 }, { id: 38, x: 9, y: 15.7 },
  { id: 39, x: 10.6, y: 14.5 }, { id: 40, x: 12.4, y: 13.5 },
  { id: 41, x: 14, y: 12.5 }, { id: 42, x: 15.9, y: 11.5 },
  { id: 43, x: 17.5, y: 10.5 }, { id: 44, x: 19.2, y: 9.5 },
  { id: 46, x: 5.5, y: 15.7 }, { id: 47, x: 7.2, y: 14.7 },
  { id: 48, x: 8.7, y: 13.6 }, { id: 49, x: 10.7, y: 12.5 },
  { id: 50, x: 12.4, y: 11.7 }, { id: 51, x: 14.1, y: 10.5 },
  { id: 52, x: 15.9, y: 9.5 }, { id: 53, x: 17.5, y: 8.7 },
  { id: 55, x: 3.7, y: 14.7 }, { id: 56, x: 5.4, y: 13.7 },
  { id: 57, x: 7.1, y: 12.7 }, { id: 58, x: 9, y: 11.5 },
  { id: 59, x: 10.7, y: 10.7 }, { id: 60, x: 12.5, y: 9.5 },
  { id: 61, x: 14.1, y: 8.7 }, { id: 62, x: 15.9, y: 7.7 },
  { id: 65, x: 3.6, y: 12.7 }, { id: 66, x: 5.5, y: 11.7 },
  { id: 68, x: 8.9, y: 9.6 }, { id: 70, x: 12.5, y: 7.7 },
  { id: 71, x: 14.1, y: 6.7 },
];
const allCoordinateIds = coordinates.map(c => c.id);


const logicalCoordinates = (() => {
  const allIds = new Set(coordinates.map(c => c.id));
  const logicalMap = {};
  const queue = [{ id: 14, lx: 1, ly: 0 }];
  const visited = new Set();
  while (queue.length > 0) {
    const { id, lx, ly } = queue.shift();
    if (visited.has(id) || !allIds.has(id)) continue;
    visited.add(id);
    logicalMap[id] = { lx, ly };
    const neighbors = [
      { nextId: id + 1, lx_change: 0, ly_change: 1 },
      { nextId: id - 1, lx_change: 0, ly_change: -1 },
      { nextId: id + 9, lx_change: -1, ly_change: 0 },
      { nextId: id - 9, lx_change: 1, ly_change: 0 }
    ];
    for (const neighbor of neighbors) {
      if (allIds.has(neighbor.nextId) && !visited.has(neighbor.nextId)) {
        queue.push({ id: neighbor.nextId, lx: lx + neighbor.lx_change, ly: ly + neighbor.ly_change });
      }
    }
  }
  return logicalMap;
})();

// --- HUD Component ---
const HudComponent = ({ data, materialKey }) => {
  const { t, i18n } = useTranslation(['simulation', 'common']);

  // Translate material name from raw key (e.g., 'lead' → 'Timbal (Lead)' or 'Lead')
  const getTranslatedMaterial = () => {
    if (materialKey) {
      return t(`common:materials.${materialKey}`);
    }
    return data?.shielding_material || 'N/A';
  };

  const getSafetyColor = (safetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return '#28a745'; // Green
      case 'warning':
        return '#ffc107'; // Yellow
      case 'danger':
        return '#dc3545'; // Red
      default:
        return '#cca60b'; // Default color
    }
  };

  // Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
  const formatProductionDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  // Helper function to format half-life with proper units
  const formatHalfLife = (halfLife) => {
    if (!halfLife || halfLife === 'N/A') return 'N/A';
    return `${halfLife} ${t('common:units.years')}`;
  };

  const baseHudStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(10, 10, 10, 0.75)',
    color: '#e6e6e6',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #fd7e14',
    zIndex: 10,
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.85rem',
    backdropFilter: 'blur(5px)'
  };

  const wideHudStyle = {
    ...baseHudStyle,
    minWidth: '240px',
  };

  const narrowHudStyle = {
    ...baseHudStyle,
    minWidth: '200px',
  };

  const centerHudStyle = {
    ...baseHudStyle,
    minWidth: '280px',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center'
  };

  if (!data) {
    return null; // Don't render anything if data is not available yet
  }

  const doseRateColor = getSafetyColor(data.safety_level);

  return (
    <>
      {/* Top-Left: Avatar & Dose Info */}
      <div style={{ ...wideHudStyle, top: '20px', left: '20px' }}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>{t('hud.avatarStatus')}</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>{t('hud.distance')}</strong> {(data.distance || 0).toFixed(2)} {t('common:units.meters')}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.totalDose')}</strong> {(data.total_dose || 0).toFixed(4)} {t('common:units.microSv')}</p>
        <p style={{ margin: '5px 0 0 0', paddingTop: '5px', borderTop: '1px solid rgba(230,230,230,0.2)' }}>
          <strong>{t('hud.doseRate')}</strong> <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: doseRateColor, transition: 'color 0.5s ease' }}>{(data.fluctuatingDoseRate || 0).toFixed(2)} {t('common:units.microSvPerHour')}</span>
        </p>
      </div>

      {/* Top-Center: Mission Status */}
      <div style={centerHudStyle}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>{t('hud.missionStatus')}</strong></h5>
        <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {t('hud.surveyPoints')} {(data.visitedPoints && data.visitedPoints.size) || 0} / {(data.targetPoints && data.targetPoints.length) || 0}
        </p>
      </div>

      {/* Top-Right: Source Details */}
      <div style={{ ...wideHudStyle, top: '20px', right: '20px', textAlign: 'left' }}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>{t('hud.sourceDetails')}</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>{t('hud.type')}</strong> {data.source_type || 'N/A'}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.initialActivity')}</strong> {(data.initial_activity || 0).toFixed(2)} {t('common:units.microCurie')}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.currentActivity')}</strong> {(data.current_activity || 0).toFixed(2)} {t('common:units.microCurie')}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.halfLife')}</strong> {formatHalfLife(data.half_life)}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.productionDate')}</strong> {formatProductionDate(data.production_date)}</p>
      </div>

      {/* Shielding Details - Below Avatar HUD */}
      <div style={{ ...narrowHudStyle, top: '165px', left: '20px' }}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>{t('hud.shieldActive')}</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>{t('hud.material')}</strong> {getTranslatedMaterial()}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.thickness')}</strong> {(data.shield_thickness || data.setup_shield_thickness || 0).toFixed(1)} {t('common:units.cm')}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>{t('hud.hvl')}</strong> {(data.hvl || 0).toFixed(2)} {t('common:units.cm')}</p>
      </div>
    </>
  );
};




export const Simulasi = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const { setupData } = location.state || {
    setupData: {
      sourceType: 'cs-137',
      initialActivity: 10,
      shieldingMaterial: 'lead',
      shieldingThickness: 1
    }
  };

  // ❇️ OOP Implementation: Initialize classes
  const gameStateRef = useRef(null);
  const apiClientRef = useRef(new APIClient());
  const audioManagerRef = useRef(new AudioManager(geigerSound));

  // Initialize GameState with setup data
  useEffect(() => {
    if (setupData && !gameStateRef.current) {
      gameStateRef.current = new GameState(setupData);
    }
  }, [setupData]);

  const [desktopModeGateState, setDesktopModeGateState] = useState(() => evaluateDesktopModeGate());
  const [desktopModeCheckStatus, setDesktopModeCheckStatus] = useState('idle');
  const isDesktopModeGateActive = desktopModeGateState.isGateActive;

  const recheckDesktopMode = () => {
    const nextState = evaluateDesktopModeGate();
    setDesktopModeGateState(nextState);
    setDesktopModeCheckStatus(nextState.isGateActive ? 'failed' : 'passed');
  };

  useEffect(() => {
    const syncGateState = () => {
      const nextState = evaluateDesktopModeGate();
      setDesktopModeGateState(nextState);
      if (!nextState.isGateActive) {
        setDesktopModeCheckStatus('passed');
      }
    };

    syncGateState();
    window.addEventListener('resize', syncGateState);
    window.addEventListener('orientationchange', syncGateState);
    window.visualViewport?.addEventListener('resize', syncGateState);

    return () => {
      window.removeEventListener('resize', syncGateState);
      window.removeEventListener('orientationchange', syncGateState);
      window.visualViewport?.removeEventListener('resize', syncGateState);
    };
  }, []);

  // ❇️ SMART VIEWPORT DETECTION (for future use if needed)
  // const { isSmartViewport, zoomFactor } = useSmartViewport();

  const [positionId, setPositionId] = useState(22);
  const [simulationData, setSimulationData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [shieldThickness, setShieldThickness] = useState(0);
  const [totalDose, setTotalDose] = useState(0);
  const [fluctuatingDoseRate, setFluctuatingDoseRate] = useState(0);

  // Mission State
  const [targetPoints, setTargetPoints] = useState([]);
  const [visitedPoints, setVisitedPoints] = useState(new Set());
  const [allPointsVisited, setAllPointsVisited] = useState(false);
  const [showMissionAlert, setShowMissionAlert] = useState(false);

  const audioRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Audio initialization with user interaction
  const initializeAudio = () => {
    if (!audioEnabled && audioRef.current) {
      audioRef.current.play().then(() => {
        setAudioEnabled(true);
        console.log("✅ Audio initialized successfully");
      }).catch(error => {
        console.warn("⚠️ Audio autoplay blocked - will start on user interaction");
      });
    }
  };

  useEffect(() => {
    audioRef.current = new Audio(geigerSound);
    audioRef.current.loop = true;

    // Try to initialize audio, but don't throw error if blocked
    const tryInitializeAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setAudioEnabled(true);
        }).catch(() => {
          // Audio blocked by browser policy - this is normal
          console.info("ℹ️ Audio will start after user interaction");
        });
      }
    };

    tryInitializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudioOnClick = () => {
      if (!audioEnabled) {
        initializeAudio();
      }
    };

    document.addEventListener('click', enableAudioOnClick, { once: true });
    return () => document.removeEventListener('click', enableAudioOnClick);
  }, [audioEnabled]);

  useEffect(() => {
    if (audioRef.current && simulationData) {
      switch (simulationData.safety_level) {
        case 'danger':
          audioRef.current.playbackRate = 5 + (fluctuatingDoseRate / 100);
          break;
        case 'warning':
          audioRef.current.playbackRate = 1 + (fluctuatingDoseRate / 100);
          break;
        case 'safe':
        default:
          audioRef.current.playbackRate = 0.4;
          break;
      }
    }
  }, [simulationData, fluctuatingDoseRate]);

  // Initialize Mission
  useEffect(() => {
    const shuffled = [...allCoordinateIds].sort(() => 0.5 - Math.random());
    // Exclude starting point and points very close to the source for fairness
    const excludedPoints = new Set([22, 13, 14, 15, 21, 23, 30, 31, 32]);
    const possiblePoints = shuffled.filter(id => !excludedPoints.has(id));
    setTargetPoints(possiblePoints.slice(0, 5));
  }, []);

  // Check if a target point is visited
  useEffect(() => {
    if (targetPoints.includes(positionId)) {
      setVisitedPoints(prevVisited => new Set(prevVisited).add(positionId));
    }
  }, [positionId, targetPoints]);

  // Check if all points have been visited
  useEffect(() => {
    if (targetPoints.length > 0 && visitedPoints.size === targetPoints.length) {
      setAllPointsVisited(true);
    }
  }, [visitedPoints, targetPoints]);

  // Effect to hide notification after 3 seconds
  useEffect(() => {
    if (showMissionAlert) {
      const timer = setTimeout(() => {
        setShowMissionAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMissionAlert]);


  useEffect(() => {
    const getDoseRate = async () => {
      if (isDesktopModeGateActive) return;

      const avatarLogicalCoord = logicalCoordinates[positionId];
      if (!avatarLogicalCoord) return;

      const calculatedDistance = Math.sqrt(Math.pow(avatarLogicalCoord.lx, 2) + Math.pow(avatarLogicalCoord.ly, 2));
      const finalDistance = calculatedDistance === 0 ? 0.1 : calculatedDistance;
      setDistance(finalDistance);

      const isShielded = isAvatarShielded(positionId);
      const thickness = isShielded ? setupData.shieldingThickness : 0;
      setShieldThickness(thickness);

      // Use raw material key directly (e.g., 'lead', 'concrete')
      const materialKey = setupData.shieldingMaterial;

      try {
        const apiClient = apiClientRef.current;
        const result = await apiClient.calculateDose(
          finalDistance,
          setupData.sourceType,
          setupData.initialActivity,
          materialKey,
          thickness
        );

        if (result.isSuccess) {
          console.log("✅ OOP API Response Data:", result.data);
          setSimulationData(result.data);
          setFluctuatingDoseRate(result.data.level);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("❌ OOP API Error:", error.message);

        // Set error state for user feedback
        setSimulationData({
          error: true,
          message: `Connection failed: ${error.message}`
        });
      }
    };

    getDoseRate();
  }, [positionId, setupData, isDesktopModeGateActive]);

  useEffect(() => {
    if (isDesktopModeGateActive) return;

    if (simulationData && simulationData.level > 0) {
      const doseRatePerSecond = simulationData.level / 3600;
      const doseTimer = setInterval(() => {
        setTotalDose(prevDose => prevDose + doseRatePerSecond);
      }, 1000);

      const fluctuationTimer = setInterval(() => {
        const baseLevel = simulationData.level;
        const fluctuation = baseLevel * 0.05 * (Math.random() - 0.5);
        setFluctuatingDoseRate(baseLevel + fluctuation);
      }, 500);

      return () => {
        clearInterval(doseTimer);
        clearInterval(fluctuationTimer);
      };
    }
  }, [simulationData, isDesktopModeGateActive]);

  const handleFinishMission = () => {
    if (allPointsVisited) {
      navigate('/hasil-simulasi', { state: { totalDose } });
    } else {
      setShowMissionAlert(true);
    }
  };

  const hudData = simulationData ? {
    ...simulationData,
    distance: distance,
    shield_thickness: shieldThickness,
    setup_shield_thickness: setupData.shieldingThickness,
    total_dose: totalDose,
    fluctuatingDoseRate: fluctuatingDoseRate,
    targetPoints,
    visitedPoints
  } : null;

  const notificationStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '15px 30px',
    backgroundColor: 'rgba(220, 53, 69, 0.9)', // Red background
    color: '#e6e6e6',
    borderRadius: '10px',
    zIndex: 100, // Ensure it's on top
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(10, 10, 10, 0.3)'
  };

  return (
    <div className="Simulasi" style={{ overflow: "hidden" }}>
      {isDesktopModeGateActive && (
        <MobileDesktopModeGate
          onRecheck={recheckDesktopMode}
          checkStatus={desktopModeCheckStatus}
          viewportWidth={desktopModeGateState.viewportWidth}
          zoomScale={desktopModeGateState.zoomScale}
        />
      )}

      <div style={{ marginTop: '50px' }}>
        <h1 className="nusa">{t('game.title')} </h1>
        <p className="ket">
          ({t('game.controls')})
        </p>
      </div>
      <Container className="cont d-flex justify-content-center align-items-center">
        <Col>
          <div style={{ position: 'relative' }}>
            {showMissionAlert && (
              <div style={notificationStyle}>
                {t('game.missionIncomplete')}
              </div>
            )}
            {isDesktopModeGateActive ? (
              <div
                style={{
                  width: '700px',
                  height: '700px',
                  margin: '0 auto',
                  borderRadius: '14px',
                  border: '2px dashed #fd7e14',
                  backgroundColor: 'rgba(10, 10, 10, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffd8a8',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                {t('game.desktopModeCanvasLocked')}
              </div>
            ) : (
              <>
                <GameArea
                  positionId={positionId}
                  onPositionChange={setPositionId}
                  simulationData={simulationData}
                  coordinates={coordinates}
                  targetPoints={targetPoints}
                  visitedPoints={visitedPoints}
                  onFinishMission={handleFinishMission}
                  isMissionComplete={allPointsVisited}
                  setupData={setupData}
                />
                <HudComponent data={hudData} materialKey={setupData.shieldingMaterial} />
              </>
            )}
          </div>
        </Col>
      </Container>
    </div>
  );
};

export default Simulasi;
