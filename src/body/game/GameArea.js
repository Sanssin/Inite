import React, { useState, useEffect } from "react";
import "./GameArea.css";
import SVGComponent from "./assets/svgviewer-react-output";
import characterUpLeft from "./assets/avatar/Atas-Kiri.png";
import characterUpRight from "./assets/avatar/Atas-Kanan.png";
import characterDownLeft from "./assets/avatar/Bawah-Kiri.png";
import characterDownRight from "./assets/avatar/Bawah-Kanan.png";
// import { hover } from "@testing-library/user-event/dist/hover";

const gridCellSize = 25; // Ukuran tiap sel grid

const GameArea = () => {
  const [positionId, setPositionId] = useState(22); // initial position ID
  const [direction, setDirection] = useState("downLeft");
  const [message, setMessage] = useState({
    level: 3.4,
    description:
      "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi",
  });

  const coordinates = [
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
  ];

  const moveCharacter = (newId, newDirection) => {
    const newCoordinate = coordinates.find((coord) => coord.id === newId);
    if (newCoordinate) {
      setPositionId(newId);
      setDirection(newDirection);
      const radiationLevel = getRadiationLevel(
        newCoordinate.x,
        newCoordinate.y
      );
      setMessage(radiationLevel);
    }
  };

  const radiationLevels = {
    1: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    2: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    3: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    4: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    5: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    6: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    7: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    8: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding walaupun jarak yang cukup dekat",
    },
    // 9: { level: 22, description: "High radiation" },
    10: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    11: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    12: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    13: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    14: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    15: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    16: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    17: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding yang menahan radiasi dan jarak yang dekat",
    },
    18: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    19: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    20: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    21: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    22: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    // 23: { level: 22, description: "High radiation" },
    // 24: { level: 22, description: "High radiation" },
    25: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding yang menahan radiasi walaupun jarak yang dekat",
    },
    26: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding yang menahan radiasi walaupun jarak yang cukup dekat",
    },
    // 27: { level: 22, description: "High radiation" },
    28: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup jauh",
    },
    29: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    30: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    31: {
      level: 4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang sangat dekat",
    },
    // 32: { level: 22, description: "High radiation" },
    // 33: { level: 22, description: "High radiation" },
    34: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang dekat",
    },
    // 35: { level: 22, description: "High radiation" },
    // 36: { level: 22, description: "High radiation" },
    37: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    38: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    39: {
      level: 3.8,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang dekat",
    },
    40: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding walaupun jarak yang dekat",
    },
    41: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding walaupun jarak yang dekat",
    },
    42: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding walaupun jarak yang dekat",
    },
    43: {
      level: 1.8,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding walaupun jarak yang dekat",
    },
    44: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    // 45: { level: 3.8, description: "High radiation" },
    46: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    47: {
      level: 3.6,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi dan jarak yang cukup dekat",
    },
    48: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    49: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    50: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    51: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    52: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    53: {
      level: 1.6,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup dekat",
    },
    // 54: { level: 22, description: "High radiation" },
    55: {
      level: 3.4,
      description:
        "Pada posisi ini laju paparan terbilang cukup tinggi dikarenakan tidak adanya shielding yang menahan radiasi walaupun jarak yang cukup jauh",
    },
    56: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    57: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    58: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    59: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    60: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    61: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    62: {
      level: 1.4,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang cukup jauh",
    },
    // 63: { level: 0.5, description: "High radiation" },
    // 64: { level: 0.5, description: "High radiation" },
    65: {
      level: 1.2,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh",
    },
    66: {
      level: 1.2,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh",
    },
    67: { level: 22, description: "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh" },
    68: {
      level: 1.2,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh",
    },
    // 69: { level: 22, description: "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh" },
    70: {
      level: 1.2,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh",
    },
    71: {
      level: 1.2,
      description:
        "Pada posisi ini laju paparan terbilang rendah dikarenakan terlindungi oleh shielding dan jarak yang jauh",
    },
    //...
  };
  const getRadiationLevel = (x, y) => {
    const id = coordinates.find((coord) => coord.x === x && coord.y === y).id;
    return radiationLevels[id];
  };

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
  }, [positionId]);

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
