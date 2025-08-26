import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Container, Col } from "react-bootstrap";
import GameArea from "./game/GameArea";
import InfoCards from "./InfoCards"; // Impor komponen baru

// Logika dan data yang sebelumnya di GameArea, sekarang di sini
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

export const Simulasi = () => {
  const [positionId, setPositionId] = useState(22);
  const [simulationData, setSimulationData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [shieldThickness, setShieldThickness] = useState(0);
  
  const [gameAreaWidth, setGameAreaWidth] = useState(0);
  const gameAreaRef = useRef(null);

  useLayoutEffect(() => {
    if (gameAreaRef.current) {
      setGameAreaWidth(gameAreaRef.current.offsetWidth);
    }
  }, []); // Hanya dijalankan sekali saat mount

  useEffect(() => {
    const getDoseRate = async () => {
      const avatarLogicalCoord = logicalCoordinates[positionId];
      if (!avatarLogicalCoord) return;

      const calculatedDistance = Math.sqrt(Math.pow(avatarLogicalCoord.lx, 2) + Math.pow(avatarLogicalCoord.ly, 2));
      const finalDistance = calculatedDistance === 0 ? 0.1 : calculatedDistance;
      setDistance(finalDistance);

      const isShielded = isAvatarShielded(positionId);
      const thickness = isShielded ? 4 : 0;
      setShieldThickness(thickness);
      
      const url = `http://localhost:8000/calculate_dose?distance=${finalDistance}&shield_thickness=${thickness}&source_type=cs-137`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
        const data = await response.json();
        setSimulationData(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setSimulationData(null);
      }
    };

    getDoseRate();
  }, [positionId]);

  const infoCardsData = simulationData ? {
    ...simulationData,
    distance: distance,
    shield_thickness: shieldThickness
  } : null;

  return (
    <div className="Simulasi" style={{ overflow: "hidden" }}>
      <div>
        <div>
          <h1 className="nusa">Nuclear Radiation Simulation </h1>
          <p className="ket">
            (gunakan tombol W = ↗, A = ↙, Q = ↖, S = ↘ pada keyboard untuk
            menggerakan karakter dan arahkan cursor ke benda sekitar)
          </p>
        </div>
        <Container className="cont d-flex justify-content-center align-items-center">
          <Col>
            <div ref={gameAreaRef}>
              <GameArea 
                positionId={positionId} 
                onPositionChange={setPositionId}
                simulationData={simulationData}
                coordinates={coordinates}
              />
            </div>
            <div style={{ width: gameAreaWidth, margin: '0 auto' }}>
              <InfoCards data={infoCardsData} />
            </div>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Simulasi;