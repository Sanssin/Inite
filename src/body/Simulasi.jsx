import { Container, Col } from "react-bootstrap";
import GameArea from "../body/game/GameArea";

export const Simulasi = () => {
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
            <GameArea />
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Simulasi;
