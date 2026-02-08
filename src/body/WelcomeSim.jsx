import { Container, Row, Col } from "react-bootstrap";
import muke from "../assets/maskot2.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const WelcomeSim = () => {
  let navigate = useNavigate();
  const { t } = useTranslation('welcome');

  return (
    <div className="startsim" style={{ backgroundColor: "black", color: "white", fontFamily: "'Poppins', sans-serif" }}>
      <Container fluid className="px-0">
        <Row className="header-box align-items-center justify-content-center mx-0">
          <Col md={4} className="text-center mb-2 mb-md-0 order-1 order-md-1">
            <img
              className="img-fluid"
              src={muke}
              alt="Welcome Mascot"
              style={{ maxWidth: "260px", width: "100%", height: "auto" }}
            />
          </Col>
          <Col md={8} className="order-2 order-md-2 px-2">
            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "white", fontWeight: "bold" }}>{t('title')}</h1>
              <h2 style={{ color: "#E0CC0B", fontStyle: "italic" }}>{t('subtitle')}</h2>
              <p style={{ fontSize: "1.3rem", lineHeight: "1.5" }}>
                {t('description')}
              </p>
              <div style={{ borderTop: "1px solid #555", paddingTop: "10px" }}>
                <h4 style={{color: "white"}}>{t('whatIsPPR')}</h4>
                <p style={{textAlign: "justify", fontSize: "1.0rem", lineHeight: "1.6"}} dangerouslySetInnerHTML={{ __html: t('pprDescription') }}></p>
              </div>
              <div className="d-flex justify-content-center" style={{ marginTop: "15px" }}>
                <button
                  className="btn1 rounded-5"
                  onClick={() => navigate("/kenalan-rekta")}
                  style={{ fontWeight: "bold" }}
                >
                  {t('letsGo')}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomeSim;
