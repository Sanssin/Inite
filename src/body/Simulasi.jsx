import { Container, Col } from "react-bootstrap";
import GameArea from "../body/game/GameArea";
import { useNavigate } from "react-router-dom";

export const Simulasi = () => {
  let navigate = useNavigate();

  return (
    <div className="Simulasi" style={{ overflow: "hidden" }}>
      <div>
        <div>
          <h1 className="nusa">Nuclear Radiation Simulation </h1>
          <p className="ket">
            (gunakan tombol W = ↗, A = ↙, Q = ↖, S = ↘ pada keyboard untuk
            menggerakan karakter dan arahkan cursor ke benda sekitar)
          </p>
          <p className="ket">
            Beri Nilai untuk Web App Kami!, <a href= "https://forms.gle/qYGKChzUUSaEnKPQ7" target="_blank" rel="noopener noreferrer">Ketuk di Sini</a>.</p>
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn rounded-5"
              style={{
                width: "120px",
                height: "40px",
                fontWeight: "bold",
                border: "none",
                background: "#B9441F",
              }}
              onClick={() => navigate("/startsim")}
            >
              Selesai
            </button>
          </div>
        </div>
        <Container className="cont d-flex justify-content-center align-items-center">
          <Col>
            <GameArea />
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Simulasi;
