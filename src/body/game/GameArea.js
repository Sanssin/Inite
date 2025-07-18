import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./GameArea.css";
import SVGComponent from "./assets/svgviewer-react-output";
import characterUpLeft from "./assets/avatar/Atas-Kiri.png";
import characterUpRight from "./assets/avatar/Atas-Kanan.png";
import characterDownLeft from "./assets/avatar/Bawah-Kiri.png";
import characterDownRight from "./assets/avatar/Bawah-Kanan.png";
// import { hover } from "@testing-library/user-event/dist/hover";

const gridCellSize = 25; // Ukuran tiap sel grid
const sourcePosition = { x: 18.2, y: 15 }; // Posisi sumber radiasi

const GameArea = () => {
  const [positionId, setPositionId] = useState(22); // initial position ID
  const [direction, setDirection] = useState("downLeft");
  const [message, setMessage] = useState({
    level: "0.00",
    description: "Selamat datang di simulasi! Gerakkan avatar untuk memulai.",
  });

  const coordinates = useMemo(() => [
    { id: 1, x: 14, y: 20.5 },
    { id: 2, x: 15.9, y: 19.5 },
    { id: 3, x: 17.5, y: 18.5 },
    { id: 4, x: 19.4, y: 17.5 },
    { id: 5, x: 21, y: 16.5 },
    { id: 6, x: 22.6, y: 15.5 },
    { id: 7, x: 24.2, y: 14.5 },
    { id: 8, x: 26.1, y: 13.5 },
    // { id: 9, x: 12.3 ,y: 19.5 },
    { id: 10, x: 12.3, y: 19.5 },
    { id: 11, x: 14.1, y: 18.5 },
    { id: 12, x: 15.8, y: 17.5 },
    { id: 13, x: 17.6, y: 16.5 },
    { id: 14, x: 19.3, y: 15.5 },
    { id: 15, x: 21.1, y: 14.5 },
    { id: 16, x: 22.9, y: 13.5 },
    { id: 17, x: 24.5, y: 12.5 },
    // { id: 18, x: 10.6 ,y: 18.5 },
    { id: 19, x: 10.6, y: 18.5 },
    { id: 20, x: 12.3, y: 17.5 },
    { id: 21, x: 14, y: 16.7 },
    { id: 22, x: 15.9, y: 15.5 },
    // { id: 23, x: 21.8 ,y: 11.5 },
    // { id: 24, x: 22.8 ,y: 11.5 },
    { id: 25, x: 21, y: 12.5 },
    { id: 26, x: 22.8, y: 11.5 },
    // { id: 27, x: 8.9 ,y: 17.5 },
    { id: 28, x: 8.9, y: 17.5 },
    { id: 29, x: 10.5, y: 16.7 },
    { id: 30, x: 12.2, y: 15.5 },
    { id: 31, x: 14.1, y: 14.5 },
    // { id: 32, x: 22.8 ,y: 11.5 },
    // { id: 33, x: 22.8 ,y: 11.5 },
    { id: 34, x: 19.1, y: 11.5 },
    // { id: 35, x: 22.8 ,y: 11.5 },
    // { id: 36, x: 7.2 ,y: 16.7 },
    { id: 37, x: 7.2, y: 16.7 },
    { id: 38, x: 9, y: 15.7 },
    { id: 39, x: 10.6, y: 14.5 },
    { id: 40, x: 12.4, y: 13.5 },
    { id: 41, x: 14, y: 12.5 },
    { id: 42, x: 15.9, y: 11.5 },
    { id: 43, x: 17.5, y: 10.5 },
    { id: 44, x: 19.2, y: 9.5 },
    // { id: 45, x: 5.5 ,y: 15.7 },
    { id: 46, x: 5.5, y: 15.7 },
    { id: 47, x: 7.2, y: 14.7 },
    { id: 48, x: 8.7, y: 13.6 },
    { id: 49, x: 10.7, y: 12.5 },
    { id: 50, x: 12.4, y: 11.7 },
    { id: 51, x: 14.1, y: 10.5 },
    { id: 52, x: 15.9, y: 9.5 },
    { id: 53, x: 17.5, y: 8.7 },
    // { id: 54, x: 3.7 ,y: 14.7 },
    { id: 55, x: 3.7, y: 14.7 },
    { id: 56, x: 5.4, y: 13.7 },
    { id: 57, x: 7.1, y: 12.7 },
    { id: 58, x: 9, y: 11.5 },
    { id: 59, x: 10.7, y: 10.7 },
    { id: 60, x: 12.5, y: 9.5 },
    { id: 61, x: 14.1, y: 8.7 },
    { id: 62, x: 15.9, y: 7.7 },
    // { id: 63, x: 22.8 ,y: 11.5 },
    // { id: 64, x: 22.8 ,y: 11.5 },
    { id: 65, x: 3.6, y: 12.7 },
    { id: 66, x: 5.5, y: 11.7 },
    // { id: 67, x: 22.8 ,y: 11.5 },
    { id: 68, x: 8.9, y: 9.6 },
    // { id: 69, x: 22.8 ,y: 11.5 },
    { id: 70, x: 12.5, y: 7.7 },
    { id: 71, x: 14.1, y: 6.7 },
  ], []);

  const getDoseRate = useCallback(async (distance) => {
    try {
      const response = await fetch(`http://localhost:8000/calculate_dose?distance=${distance}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setMessage({
        level: "Error",
        description: "Tidak dapat mengambil data dari server. Pastikan server Python berjalan.",
      });
    }
  }, [setMessage]);

  const moveCharacter = useCallback((newId, newDirection) => {
    const newCoordinate = coordinates.find((coord) => coord.id === newId);
    if (newCoordinate) {
      setPositionId(newId);
      setDirection(newDirection);
      
      // Hitung jarak dari avatar ke sumber radiasi
      const distance = Math.sqrt(
        Math.pow(newCoordinate.x - sourcePosition.x, 2) +
        Math.pow(newCoordinate.y - sourcePosition.y, 2)
      );

      // Dapatkan status dan laju dosis dari API
      getDoseRate(distance);
    }
  }, [coordinates, setPositionId, setDirection, getDoseRate]);

  // Calculate initial dose on mount
  useEffect(() => {
    const initialCoordinate = coordinates.find((coord) => coord.id === positionId);
    if (initialCoordinate) {
      const distance = Math.sqrt(
        Math.pow(initialCoordinate.x - sourcePosition.x, 2) +
        Math.pow(initialCoordinate.y - sourcePosition.y, 2)
      );
      getDoseRate(distance);
    }
  }, [positionId, coordinates, getDoseRate]);

useEffect(() => {
  const handleKeyDown = (event) => {
    switch (event.key.toLowerCase()) { // convert to lowercase for comparison
      case "q":
      case "Q":
        moveCharacter(positionId + 9, "upLeft");
        break;
      case "w":
      case "W":
        moveCharacter(positionId + 1, "upRight");
        break;
      case "a":
      case "A":
        moveCharacter(positionId - 1, "downLeft");
        break;
      case "s":
      case "S":
        moveCharacter(positionId - 9, "downRight");
        break;
      default:
        break;
    }
  };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [positionId, moveCharacter]); // Added moveCharacter to dependency array

  const characterPositionStyle = {
    top: `${
      coordinates.find((coord) => coord.id === positionId).y * gridCellSize
    }px`,
    left: `${
      coordinates.find((coord) => coord.id === positionId).x * gridCellSize
    }px`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
  };
  const [sumberOpacity, setSumberOpacity] = useState(0);
  const [kontainerOpacity, setKontainerOpacity] = useState(0);
  const [ShieldingOpacity, setShieldingOpacity] = useState(0);
  const [KaktusOpacity, setKaktusOpacity] = useState(0);
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
    <div className="game-area">
      <SVGComponent className="room" />
      <div className="character" style={characterPositionStyle}>
        <img
          src={
            direction === "upLeft"
              ? characterUpLeft
              : direction === "upRight"
              ? characterUpRight
              : direction === "downLeft"
              ? characterDownLeft
              : characterDownRight
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
        onMouseOver={() => {
          setSumberOpacity(1); // set opacity to 1 on mouseover
        }}
        onMouseOut={() => {
          setSumberOpacity(0); // set opacity to 0 on mouseout
        }}
      >
        Sumber : Cs-137
        <br />
        Jenis Radiasi : Gamma
        <br />
        Aktivitas : 2mCi
      </div>
      <div
        className="kontainer"
        style={KontainerPositionStyle}
        onMouseOver={() => {
          setKontainerOpacity(1); // set opacity to 1 on mouseover
        }}
        onMouseOut={() => {
          setKontainerOpacity(0); // set opacity to 0 on mouseout
        }}
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
        onMouseOver={() => {
          setShieldingOpacity(1); // set opacity to 1 on mouseover
        }}
        onMouseOut={() => {
          setShieldingOpacity(0); // set opacity to 0 on mouseout
        }}
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
        onMouseOver={() => {
          setKaktusOpacity(1); // set opacity to 1 on mouseover
        }}
        onMouseOut={() => {
          setKaktusOpacity(0); // set opacity to 0 on mouseout
        }}
      >
        Hai Aku Kaktus 😊
      </div>
    </div>
  );
};
export default GameArea;