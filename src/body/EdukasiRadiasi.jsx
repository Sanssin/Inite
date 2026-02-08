import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Accordion, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EdukasiRadiasi = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('education');

  const radiationLevels = [0, 1, 2, 3, 4, 5].map(i => ({
    level: t(`radiationEffects.levels.${i}.level`),
    sources: t(`radiationEffects.levels.${i}.sources`),
    effects: t(`radiationEffects.levels.${i}.effects`)
  }));

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #fd7e14',
    color: 'white'
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: 'white', padding: '50px 0 60px 0' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center">
            <Col md={9}>
              <Card style={cardStyle}>
                <Card.Header>
                  <h1 style={{ color: '#E0CC0B', fontWeight: 'bold', textAlign: 'center' }}>{t('radiationEffects.title')}</h1>
                </Card.Header>
                <Card.Body>
                  <Accordion defaultActiveKey="0" flush>
                    {radiationLevels.map((item, index) => (
                      <Accordion.Item eventKey={String(index)} key={index} style={{ backgroundColor: 'transparent', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <Accordion.Header>{item.level}</Accordion.Header>
                        <Accordion.Body style={{ textAlign: 'justify' }}>
                          <p><strong>{t('radiationEffects.sourceLabel')}</strong> {item.sources}</p>
                          <p><strong>{t('radiationEffects.effectLabel')}</strong> {item.effects}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
              <div className="text-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 50px" }} onClick={() => navigate(-1)}>
                  {t('radiationEffects.backButton')}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default EdukasiRadiasi;
