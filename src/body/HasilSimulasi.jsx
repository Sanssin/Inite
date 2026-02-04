import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const getDoseEffect = (dose, t) => {
  if (dose <= 0.1) {
    return {
      level: t('simulation:results.veryLow.level'),
      description: t('simulation:results.veryLow.description'),
      effects: t('simulation:results.veryLow.effects'),
      variant: 'success'
    };
  } else if (dose <= 10) {
    return {
      level: t('simulation:results.low.level'),
      description: t('simulation:results.low.description'),
      effects: t('simulation:results.low.effects'),
      variant: 'success'
    };
  } else if (dose <= 100) {
    return {
      level: t('simulation:results.moderate.level'),
      description: t('simulation:results.moderate.description'),
      effects: t('simulation:results.moderate.effects'),
      variant: 'warning'
    };
  } else if (dose <= 500) {
    return {
      level: t('simulation:results.high.level'),
      description: t('simulation:results.high.description'),
      effects: t('simulation:results.high.effects'),
      variant: 'danger'
    };
  } else {
    return {
      level: t('simulation:results.veryHigh.level'),
      description: t('simulation:results.veryHigh.description'),
      effects: t('simulation:results.veryHigh.effects'),
      variant: 'danger'
    };
  }
};

const HasilSimulasi = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalDose } = location.state || { totalDose: 0 };

  const result = getDoseEffect(totalDose, t);

  const handleRestart = () => {
    navigate('/setup');
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #fd7e14',
    color: 'white'
  };

  const listGroupItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    padding: '1rem 1.25rem'
  }

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: 'white', paddingBottom: '60px' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: '#E0CC0B', fontWeight: 'bold', marginBottom: '30px' }}>{t('simulation:results.missionTitle')}</h1>
              <Card style={cardStyle}>
                <Card.Header as="h4" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>{t('simulation:results.totalDoseReceived')}</Card.Header>
                <Card.Body style={{ padding: '30px' }}>
                  <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#E0CC0B' }}>
                    {totalDose.toFixed(4)} µSv
                  </p>
                  <ListGroup variant="flush" className="mt-4 text-start">
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>{t('simulation:results.exposureLevel')}</strong> <Badge bg={result.variant} className="ms-2">{result.level}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>{t('simulation:results.description')}</strong> {result.description}
                    </ListGroup.Item>
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>{t('simulation:results.biologicalEffects')}</strong> {result.effects}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px" }} onClick={() => navigate('/edukasi-radiasi')}>
                  {t('simulation:results.learnEffects')}
                </button>
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px" }} onClick={handleRestart}>
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

export default HasilSimulasi;
