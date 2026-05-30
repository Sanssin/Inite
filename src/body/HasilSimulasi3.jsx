import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const POSTTEST_FORM_URL = 'https://forms.gle/TEraBC2SuJqBiRRQ8';

const BATAS_MASYARAKAT = 0.114;
const BATAS_PEKERJA = 10.0;

const getDoseEffect = (doseRate, t) => {
  if (doseRate <= BATAS_MASYARAKAT) {
    return { level: t('simulation:results.veryLow.level', 'Sangat Rendah'), description: t('simulation:results.veryLow.description', ''), effects: t('simulation:results.veryLow.effects', ''), variant: 'success' };
  } else if (doseRate <= BATAS_PEKERJA) {
    return { level: t('simulation:results.low.level', 'Rendah'), description: t('simulation:results.low.description', ''), effects: t('simulation:results.low.effects', ''), variant: 'info' };
  } else if (doseRate <= BATAS_PEKERJA * 5) {
    return { level: t('simulation:results.moderate.level', 'Sedang'), description: t('simulation:results.moderate.description', ''), effects: t('simulation:results.moderate.effects', ''), variant: 'warning' };
  } else if (doseRate <= BATAS_PEKERJA * 50) {
    return { level: t('simulation:results.high.level', 'Tinggi'), description: t('simulation:results.high.description', ''), effects: t('simulation:results.high.effects', ''), variant: 'danger' };
  } else {
    return { level: t('simulation:results.veryHigh.level', 'Sangat Tinggi'), description: t('simulation:results.veryHigh.description', ''), effects: t('simulation:results.veryHigh.effects', ''), variant: 'dark' };
  }
};

const HasilSimulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    finalDoseRate = 0, 
    percentage = 0, 
    setupData = { sourceType: 'unknown', initialActivity: 0, shieldingMaterial: 'unknown', shieldingThickness: 0, distance: 0 }
  } = location.state || {};

  const [hasOpenedPosttest, setHasOpenedPosttest] = useState(false);

  const result = useMemo(() => getDoseEffect(finalDoseRate, t), [finalDoseRate, t]);

  const handleRestart = () => navigate('/setup-simulasi');
  const handleOpenPosttest = () => {
    setHasOpenedPosttest(true);
    window.open(POSTTEST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000', color: "#e6e6e6", paddingBottom: '60px', minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center text-center" style={{ paddingTop: '50px' }}>
          <Col md={8}>
            <h1 style={{ color: "#cca60b", fontWeight: 'bold', marginBottom: '30px', textTransform: 'uppercase' }}>
              {t('simulation:results.missionTitle', 'Hasil Simulasi')}
            </h1>

            <Card className="dose-card">
              <Card.Header as="h4">Laju Dosis Diterima</Card.Header>
              <Card.Body>
                <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: "#cca60b", margin: '0' }}>
                  {finalDoseRate.toFixed(4)} <span style={{ fontSize: '1.5rem', color: '#aaa' }}>µSv/jam</span>
                </p>

                {setupData.sourceType !== 'unknown' && (
                  <div className="mt-3 mb-4 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', display: 'inline-block' }}>
                    <small style={{ color: '#aaa' }}>
                      Sumber <strong>{setupData.sourceType.toUpperCase()}</strong> ({setupData.initialActivity} Ci) 
                      dengan Perisai <strong>{setupData.shieldingMaterial !== 'unknown' ? t(`common:materials.${setupData.shieldingMaterial}`) : 'N/A'}</strong> ({setupData.shieldingThickness} cm) 
                      pada jarak <strong>{setupData.distance} m</strong>.
                      <br/>(Kebocoran fluks: {percentage.toFixed(2)}%)
                    </small>
                  </div>
                )}

                <ListGroup variant="flush" className="mt-4 text-start">
                  <ListGroup.Item>
                    <strong>{t('simulation:results.exposureLevel', 'Level Paparan')}</strong> 
                    <Badge bg={result.variant} className="ms-3">{result.level}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>{t('simulation:results.description', 'Deskripsi')}</strong><br/>
                    <span style={{ color: '#bbb' }}>{result.description}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>{t('simulation:results.biologicalEffects', 'Efek Biologis')}</strong><br/>
                    <span style={{ color: '#bbb' }}>{result.effects}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>

            <p className="mt-4 mb-2" style={{ color: '#f8f9fa' }}>
              {hasOpenedPosttest ? t('simulation:results.posttestUnlocked', 'Posttest sudah dibuka') : t('simulation:results.posttestRequired', 'Silakan isi posttest')}
            </p>

            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-4">
              <button type="button" className="btn btn-warning rounded-5" onClick={handleOpenPosttest}>
                {t('simulation:results.fillPosttest', 'Isi Posttest')}
              </button>
              <button type="button" className="btn btn-info rounded-5" onClick={() => navigate('/edukasi-radiasi')}>
                {t('simulation:results.learnEffects', 'Pelajari Efek Radiasi')}
              </button>
              <button type="button" className="btn btn-secondary rounded-5" onClick={handleRestart}>
                {t('simulation:results.repeatMission', 'Ulangi Simulasi')}
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HasilSimulasi2;
