import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const POSTTEST_FORM_URL = 'https://forms.gle/TEraBC2SuJqBiRRQ8';

// Evaluasi efek biologis dan level bahaya berdasarkan NBD BAPETEN
const getDoseEffect = (doseRate, t) => {
  const BATAS_MASYARAKAT = 0.114; // µSv/jam
  const BATAS_PEKERJA = 10.0;     // µSv/jam

  if (doseRate <= BATAS_MASYARAKAT) {
    return {
      level: t('simulation:results.veryLow.level'),
      description: t('simulation:results.veryLow.description'),
      effects: t('simulation:results.veryLow.effects'),
      variant: 'success' // Aman untuk semua (Hijau)
    };
  } else if (doseRate <= BATAS_PEKERJA) {
    return {
      level: t('simulation:results.low.level'),
      description: t('simulation:results.low.description'),
      effects: t('simulation:results.low.effects'),
      variant: 'info' // Batas Wajar Pekerja (Biru)
    };
  } else if (doseRate <= BATAS_PEKERJA * 5) {
    return {
      level: t('simulation:results.moderate.level'),
      description: t('simulation:results.moderate.description'),
      effects: t('simulation:results.moderate.effects'),
      variant: 'warning' // Waspada / Melebihi NBD (Kuning)
    };
  } else if (doseRate <= BATAS_PEKERJA * 50) {
    return {
      level: t('simulation:results.high.level'),
      description: t('simulation:results.high.description'),
      effects: t('simulation:results.high.effects'),
      variant: 'danger' // Bahaya Tinggi (Merah)
    };
  } else {
    return {
      level: t('simulation:results.veryHigh.level'),
      description: t('simulation:results.veryHigh.description'),
      effects: t('simulation:results.veryHigh.effects'),
      variant: 'dark' // Sangat Fatal (Hitam/Gelap)
    };
  }
};

const HasilSimulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // PERBAIKAN DI SINI: Tangkap data dengan nilai bawaan (fallback) yang aman
  const { 
    finalDoseRate = 0, 
    percentage = 0, 
    setupData = {
      sourceType: 'unknown',
      initialActivity: 0,
      shieldingMaterial: 'unknown',
      shieldingThickness: 0,
      distance: 0
    }
  } = location.state || {};
  
  const [hasOpenedPosttest, setHasOpenedPosttest] = useState(false);

  const result = getDoseEffect(finalDoseRate, t);

  const handleRestart = () => {
    // rute mengarah ke SetupSim2
    navigate('/setup-simulasi'); 
  };

  const handleOpenPosttest = () => {
    setHasOpenedPosttest(true);
    window.open(POSTTEST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #fd7e14',
    color: "#e6e6e6"
  };

  const listGroupItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)', // Tambahan pemisah visual tipis
    color: "#e6e6e6",
    padding: '1.2rem 1.25rem'
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: "#e6e6e6", paddingBottom: '60px', minHeight: '100vh' }}>
      <Container>
        <div className="header-box" style={{ paddingTop: '50px' }}>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: "#cca60b", fontWeight: 'bold', marginBottom: '30px', textTransform: 'uppercase' }}>
                {t('simulation:results.missionTitle')}
              </h1>
              
              <Card style={cardStyle}>
                <Card.Header as="h4" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '15px' }}>
                  Laju Dosis Diterima
                </Card.Header>
                <Card.Body style={{ padding: '30px' }}>
                  
                  {/* Angka Laju Dosis */}
                  <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: "#cca60b", margin: '0' }}>
                    {finalDoseRate.toFixed(4)} <span style={{ fontSize: '1.5rem', color: '#aaa' }}>µSv/jam</span>
                  </p>
                  
                  {/* Ringkasan Parameter Uji (Optional tp membantu user) */}
                  {setupData.sourceType !== 'unknown' && (
                    <div className="mt-3 mb-4 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', display: 'inline-block' }}>
                      <small style={{ color: '#aaa' }}>
                        Berdasarkan pengujian Sumber <strong>{setupData.sourceType.toUpperCase()}</strong> ({setupData.initialActivity} Ci) 
                        dengan Perisai <strong>{t(`common:materials.${setupData.shieldingMaterial}`)}</strong> ({setupData.shieldingThickness} cm) 
                        pada jarak <strong>{setupData.distance} m</strong>.
                        <br/>(Kebocoran fluks: {percentage.toFixed(2)}%)
                      </small>
                    </div>
                  )}

                  <ListGroup variant="flush" className="mt-4 text-start">
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>{t('simulation:results.exposureLevel')}</strong> 
                      <Badge bg={result.variant} className="ms-3" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                        {result.level}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>{t('simulation:results.description')}</strong><br/>
                      <span style={{ color: '#bbb' }}>{result.description}</span>
                    </ListGroup.Item>
                    <ListGroup.Item style={{...listGroupItemStyle, borderBottom: 'none'}}>
                      <strong>{t('simulation:results.biologicalEffects')}</strong><br/>
                      <span style={{ color: '#bbb' }}>{result.effects}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Bagian Navigasi & Post-test */}
              <p className="mt-4 mb-2" style={{ color: '#f8f9fa' }}>
                {hasOpenedPosttest ? t('simulation:results.posttestUnlocked') : t('simulation:results.posttestRequired')}
              </p>
              
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px", fontWeight: 'bold' }} onClick={handleOpenPosttest}>
                  {t('simulation:results.fillPosttest')}
                </button>
                <button
                  type="button"
                  className="btn1 rounded-5"
                  style={{ padding: "15px 30px" }}
                  onClick={() => navigate('/edukasi-radiasi')}
                >
                  {t('simulation:results.learnEffects')}
                </button>
                <button
                  type="button"
                  className="btn2 rounded-5" 
                  style={{ padding: "15px 30px" }}
                  onClick={handleRestart}
                >
                  {t('simulation:results.repeatMission')}
                </button>
              </div>

            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HasilSimulasi2;
