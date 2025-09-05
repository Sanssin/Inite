import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Col, Button } from "react-bootstrap";
import GameArea from "./game/GameArea";
import geigerSound from '../assets/geiger.mp3';

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
const HudComponent = ({ data }) => {
  const getSafetyColor = (safetyLevel) => {
    switch (safetyLevel) {
      case 'safe':
        return '#28a745'; // Green
      case 'warning':
        return '#ffc107'; // Yellow
      case 'danger':
        return '#dc3545'; // Red
      default:
        return '#E0CC0B'; // Default color
    }
  };

  const baseHudStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
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
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>STATUS AVATAR</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>Jarak:</strong> {data.distance.toFixed(2)} m</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Dosis Total:</strong> {data.total_dose.toFixed(4)} μSv</p>
        <p style={{ margin: '5px 0 0 0', paddingTop: '5px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <strong>Laju Paparan:</strong> <span style={{fontSize: '1.1rem', fontWeight: 'bold', color: doseRateColor, transition: 'color 0.5s ease'}}>{data.fluctuatingDoseRate.toFixed(2)} μSv/jam</span>
        </p>
      </div>

      {/* Top-Center: Mission Status */}
      <div style={centerHudStyle}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>STATUS MISI</strong></h5>
        <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Titik Survei: {data.visitedPoints.size} / {data.targetPoints.length}
        </p>
      </div>

      {/* Top-Right: Source Details */}
      <div style={{ ...wideHudStyle, top: '20px', right: '20px', textAlign: 'left' }}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>DETAIL SUMBER</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>Tipe:</strong> {data.source_type}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Aktivitas Awal:</strong> {data.initial_activity.toFixed(2)} µCi</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Aktivitas Saat Ini:</strong> {data.current_activity.toFixed(2)} µCi</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Waktu Paruh:</strong> {data.half_life} tahun</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Tgl. Produksi:</strong> {data.production_date}</p>
      </div>

      {/* Shielding Details - Below Avatar HUD */}
      <div style={{ ...narrowHudStyle, top: '165px', left: '20px' }}>
        <h5 style={{ margin: 0, paddingBottom: '5px', borderBottom: '1px solid #fd7e14', fontSize: '1rem' }}><strong>PERISAI AKTIF</strong></h5>
        <p style={{ margin: '8px 0 0 0' }}><strong>Material:</strong> {data.shielding_material}</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>Tebal:</strong> {data.shield_thickness} cm</p>
        <p style={{ margin: '5px 0 0 0' }}><strong>HVL:</strong> {data.hvl} cm</p>
      </div>
    </>
  );
};


export const Simulasi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setupData } = location.state || {
    setupData: {
      sourceType: 'cs-137',
      initialActivity: 10,
      shieldingMaterial: 'Timbal (Lead)',
      shieldingThickness: 1
    }
  };

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

  useEffect(() => {
    audioRef.current = new Audio(geigerSound);
    audioRef.current.loop = true;
    audioRef.current.play().catch(error => console.error("Audio play failed:", error));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
      const avatarLogicalCoord = logicalCoordinates[positionId];
      if (!avatarLogicalCoord) return;

      const calculatedDistance = Math.sqrt(Math.pow(avatarLogicalCoord.lx, 2) + Math.pow(avatarLogicalCoord.ly, 2));
      const finalDistance = calculatedDistance === 0 ? 0.1 : calculatedDistance;
      setDistance(finalDistance);

      const isShielded = isAvatarShielded(positionId);
      const thickness = isShielded ? setupData.shieldingThickness : 0;
      setShieldThickness(thickness);
      
      const url = new URL('http://localhost:8000/calculate_dose');
      url.searchParams.append('distance', finalDistance);
      url.searchParams.append('source_type', setupData.sourceType);
      url.searchParams.append('initial_activity', setupData.initialActivity);
      url.searchParams.append('shielding_material', setupData.shieldingMaterial);
      url.searchParams.append('shield_thickness', thickness);
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
        const data = await response.json();
        setSimulationData(data);
        setFluctuatingDoseRate(data.level);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setSimulationData(null);
      }
    };

    getDoseRate();
  }, [positionId, setupData]);

  useEffect(() => {
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
  }, [simulationData]);

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
    color: 'white',
    borderRadius: '10px',
    zIndex: 100, // Ensure it's on top
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  };

  return (
    <div className="Simulasi" style={{ overflow: "hidden" }}>
      <div>
        <div style={{ marginTop: '50px'}}>
          <h1 className="nusa">Nuclear Radiation Simulation </h1>
          <p className="ket">
            (gunakan tombol W = ↗, A = ↙, Q = ↖, S = ↘ pada keyboard untuk
            menggerakan karakter dan arahkan cursor ke benda sekitar)
          </p>
        </div>
        <Container className="cont d-flex justify-content-center align-items-center">
          <Col>
            <div style={{ position: 'relative' }}>
              {showMissionAlert && (
                <div style={notificationStyle}>
                  Misi Belum Selesai!
                </div>
              )}
              <GameArea 
                positionId={positionId} 
                onPositionChange={setPositionId}
                simulationData={simulationData}
                coordinates={coordinates}
                targetPoints={targetPoints}
                visitedPoints={visitedPoints}
                onFinishMission={handleFinishMission}
                isMissionComplete={allPointsVisited}
              />
              <HudComponent data={hudData} />
            </div>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Simulasi;
