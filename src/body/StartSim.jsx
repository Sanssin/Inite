import { Container, Row } from "react-bootstrap";
import muke from "../assets/Group 44.png";
import { useNavigate } from "react-router-dom";

export const StartSim = () => {
  let navigate = useNavigate();

  return (
    <div className="startsim" style={{ paddingInline: "40px" }}>
      <div className="d-flex justify-content-center align-items-center w-100 min-vh-100">
        <Container>
          <Row className="header-box" style={{ paddingTop: "80px" }}>
            <div className="d-flex justify-content-center align-items-center">
              <img
                className="img-fluid"
                src={muke}
                alt="muke"
                style={{ width: "350px", paddingBottom: 20 }}
              />
            </div>
            <div>
              <h1 style={{ textAlign: "center" }}>
                Nuclear Radiation Simulation
              </h1>
              <p style={{ textAlign: "center" }}>
                Mari simulasi dan mulai mengenali sifat-sifat dan prinsip
                radiasi.
              </p>
              <p style={{ textAlign: "center", color: "#E0CC0B" }}>
                gunakan tombol W = ↗, A = ↙, Q = ↖, S = ↘ pada keyboard untuk
                menggerakan karakter dan arahkan cursor ke benda sekitar
              </p>
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ paddingBottom: "80px" }}
            >
              <button
                style={{
                  width: "25%",
                  paddingBottom: "20px",
                  paddingTop: "20px",
                  alignItems: "center",
                }}
                className="btn1 rounded-5 me-2 mb-xs-0 mb-2"
                onClick={() => navigate("/simulasi")}
              >
                Mulai
              </button>
              <button
                style={{
                  width: "25%",
                  paddingBottom: "20px",
                  paddingTop: "20px",
                  alignItems: "center",
                }}
                className="btn2 rounded-5 me-2 mb-xs-0 mb-2"
                onClick={() => navigate("/")}
              >
                Selesai
              </button>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StartSim;
