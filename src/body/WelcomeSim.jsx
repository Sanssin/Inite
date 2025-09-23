import { Container, Row, Col } from "react-bootstrap";
import muke from "../assets/maskot2.png";
import { useNavigate } from "react-router-dom";

export const WelcomeSim = () => {
  let navigate = useNavigate();

  return (
    <div className="startsim" style={{ paddingInline: "40px", backgroundColor: "black", color: "white", fontFamily: "'Poppins', sans-serif" }}>
      <div className="d-flex justify-content-center align-items-center w-100 min-vh-100">
        <Container>
          <Row className="header-box align-items-center" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <img
                className="img-fluid"
                src={muke}
                alt="Welcome Mascot"
                style={{ maxWidth: "300px" }}
              />
            </Col>
            <Col md={8}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ color: "white", fontWeight: "bold" }}>Radiation Officer</h1>
                <h2 style={{ color: "#E0CC0B", fontStyle: "italic" }}>The ALARA Challenge</h2>
                <p style={{ marginTop: "20px", fontSize: "1.3rem" }}>
                  Anda adalah calon Petugas Proteksi Radiasi. Sebuah misi menanti Anda untuk menguji kemampuan Anda dalam menghadapi tantangan di zona radiasi dengan aman. Apakah Anda siap?
                </p>
                <div style={{ marginTop: "30px", borderTop: "1px solid #555", paddingTop: "20px" }}>
                  <h4 style={{color: "white"}}>Apa itu Petugas Proteksi Radiasi?</h4>
                  <p style={{textAlign: "justify", fontSize: "1.0rem"}}>
                    Seorang <strong>Petugas Proteksi Radiasi (PPR)</strong> atau <i>Radiation Protection Officer (RPO)</i> adalah seorang profesional yang bertanggung jawab untuk memastikan keselamatan personil, masyarakat, dan lingkungan dari bahaya radiasi pengion. Mereka merancang dan menerapkan program proteksi radiasi, memantau tingkat radiasi, dan memastikan semua aktivitas mematuhi peraturan keselamatan dan prinsip ALARA (As Low As Reasonably Achievable), yang berarti menjaga paparan radiasi serendah mungkin.
                  </p>
                </div>
                <button
                  style={{
                    padding: "15px 50px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginTop: "30px"
                  }}
                  className="btn1 rounded-5"
                  onClick={() => navigate("/kenalan-rekta")}
                >
                  Let's Go
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default WelcomeSim;
