import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import mascot from './game/assets/avatar/Bawah-Kanan.png';
import { useTranslation } from 'react-i18next';

const KenalanRekta = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('character');

  const handleNext = () => {
    navigate('/introsim');
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Container fluid className="px-0">
        <div className="header-box mx-0">
          <Row className="align-items-center justify-content-center w-100 mx-0">
            <Col lg={4} md={5} className="d-flex justify-content-center align-items-center mb-2 mb-md-0 order-1 order-md-1 px-2">
              <img 
                src={mascot} 
                alt="Rekta Mascot" 
                className="img-fluid" 
                style={{ maxWidth: '300px', maxHeight: '300px', width: '100%', height: 'auto' }} 
              />
            </Col>
            <Col lg={8} md={7} className="order-2 order-md-2 px-2" style={{ textAlign: 'justify' }}>
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold", textAlign: 'center' }}>{t('title')}</h1>
              <p style={{ fontSize: '1.1rem', textAlign: 'justify', lineHeight: '1.6' }}>
                {t('intro')}
              </p>
              <p style={{ fontSize: '1.1rem', textAlign: 'justify', lineHeight: '1.6' }}>
                {t('mission')}
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px'}}>
                <h5 style={{color: 'white'}}>{t('funFactTitle')}</h5>
                <p style={{ fontSize: '1rem', textAlign: 'justify', marginBottom: '0', lineHeight: '1.5'}}>
                  {t('funFact')}
                </p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  onClick={handleNext}
                  className="btn1 rounded-5"
                  style={{ cursor: 'pointer' }}
                >
                  {t('nextButton')}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default KenalanRekta;
