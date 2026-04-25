import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './EdukasiRadiasi.css'; // We will create this for specific animations

const HumanSilhouette = ({ level }) => {
  // Color mapping based on radiation level
  const getBodyColor = (lvl) => {
    const colors = [
      '#4ade80', // Level 0: Safe Green
      '#fbbf24', // Level 1: Low Yellow
      '#f97316', // Level 2: Moderate Orange
      '#ea580c', // Level 3: High Orange-Red
      '#dc2626', // Level 4: Very High Red
      '#7f1d1d'  // Level 5: Extreme Dark Red
    ];
    return colors[lvl] || colors[0];
  };

  const bodyColor = getBodyColor(level);

  return (
    <div className="human-svg-container" style={{ position: 'relative', width: '100%', maxWidth: '250px', margin: '0 auto' }}>
      <svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: '400px' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main Body Silhouette - More detailed anatomical outline */}
        <g transform="scale(1, 0.85) translate(0, 5)">
          <path
            d="M100,10 C115,10 122,25 122,40 C122,55 110,65 100,65 C90,65 78,55 78,40 C78,25 85,10 100,10 Z M65,75 C80,70 120,70 135,75 C150,80 160,110 160,120 L150,210 C148,220 135,220 135,210 L140,130 L125,130 L125,240 L135,460 C138,480 115,485 110,460 L102,280 L98,280 L90,460 C85,485 62,480 65,460 L75,240 L75,130 L60,130 L65,210 C65,220 52,220 50,210 L40,120 C40,110 50,80 65,75 Z"
            fill={bodyColor}
            style={{ transition: 'fill 0.5s ease', filter: level > 0 ? 'url(#glow)' : 'none' }}
          />

          {/* Level 3+: Gastrointestinal Tract (Stomach & Intestines) - Nausea/Vomiting */}
          <g className={level >= 3 ? "pulse-stomach" : ""} style={{ display: level >= 3 ? 'block' : 'none', opacity: 0, transformOrigin: '100px 180px' }}>
            <path d="M105,145 C120,145 125,160 115,170 C100,185 80,175 85,155 C88,150 95,145 105,145 Z" fill="#facc15" />
            <path d="M85,180 C75,180 75,195 85,195 C95,195 95,210 85,210 C75,210 75,225 85,225 L115,225 C125,225 125,210 115,210 C105,210 105,195 115,195 C125,195 125,180 115,180 Z" fill="#facc15" opacity="0.8" />
          </g>

          {/* Level 4+: Hematopoietic System (Bone Marrow) - Blood Cell Destruction */}
          <g className={level >= 4 ? "pulse-bones" : ""} style={{ display: level >= 4 ? 'block' : 'none', opacity: 0 }}>
            <path d="M100,75 L100,230" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="10, 5" />
            <path d="M85,235 C100,225 115,235 120,245 C110,255 90,255 80,245 C85,235 100,225 85,235 Z" fill="#fff" />
            <path d="M85,250 L80,345 M115,250 L120,345" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <path d="M80,355 L75,435 M120,355 L125,435" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M65,95 L55,150 M135,95 L145,150" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M55,160 L50,200 M145,160 L150,200" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Level 5: Central Nervous System (Brain) - Severe Neural Damage */}
          <g className={level >= 5 ? "pulse-brain" : ""} style={{ display: level >= 5 ? 'block' : 'none', opacity: 0, transformOrigin: '100px 35px' }}>
            <path d="M88,25 C88,15 100,12 112,25 C118,35 115,45 100,48 C85,45 82,35 88,25 Z" fill="#e0e7ff" />
            <path d="M95,18 C100,25 95,35 100,45 M105,18 C100,25 105,35 100,45 M90,30 C95,30 100,25 105,30 M90,40 C95,40 100,35 105,40" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
            <path d="M100,48 L100,60" stroke="#e0e7ff" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
};

const EdukasiRadiasi = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('education');
  const [activeLevel, setActiveLevel] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const radiationLevels = [0, 1, 2, 3, 4, 5].map(i => ({
    level: t(`radiationEffects.levels.${i}.level`),
    sources: t(`radiationEffects.levels.${i}.sources`),
    effects: t(`radiationEffects.levels.${i}.effects`)
  }));

  const handleLevelChange = (lvl) => {
    if (lvl === activeLevel) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveLevel(lvl);
      setIsFading(false);
    }, 200);
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${['#4ade80', '#fbbf24', '#f97316', '#ea580c', '#dc2626', '#7f1d1d'][activeLevel]}`,
    color: '#e6e6e6',
    transition: 'border-color 0.5s ease'
  };

  return (
    <div className="startsim education-page" style={{ fontFamily: "'Poppins', sans-serif", background: '#0a0a0a', color: '#e6e6e6', padding: '80px 0 60px 0', minHeight: '100vh' }}>
      <Container>
        <h1 className="text-center mb-5" style={{ color: '#cca60b', fontWeight: 'bold' }}>
          {t('radiationEffects.title')}
        </h1>
        
        <Row className="align-items-center justify-content-center">
          {/* Left Side: Visuals & Control */}
          <Col lg={5} md={6} className="text-center mb-5 mb-md-0">
            <div className="visual-container mb-4">
              <HumanSilhouette level={activeLevel} />
            </div>
            
            <div className="dosage-control px-4">
              <h5 className="mb-3" style={{ color: '#eb7415' }}>{t('radiationEffects.selectDoseLevel')}</h5>
              
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`btn rounded-circle fw-bold d-flex align-items-center justify-content-center ${activeLevel === lvl ? 'active-level-btn' : ''}`}
                    style={{
                      width: '45px',
                      height: '45px',
                      backgroundColor: activeLevel === lvl ? ['#4ade80', '#fbbf24', '#f97316', '#ea580c', '#dc2626', '#7f1d1d'][lvl] : 'transparent',
                      color: activeLevel === lvl ? (lvl === 0 || lvl === 1 ? '#000' : '#fff') : '#aaa',
                      border: `2px solid ${['#4ade80', '#fbbf24', '#f97316', '#ea580c', '#dc2626', '#7f1d1d'][lvl]}`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-3 px-1 w-100 mx-auto" style={{ maxWidth: '300px', fontWeight: 'bold', fontSize: '1rem' }}>
                <span style={{ color: '#4ade80', textShadow: '0 0 10px rgba(74, 222, 128, 0.3)' }}>{t('radiationEffects.safeLabel')}</span>
                <span style={{ color: '#dc2626', textShadow: '0 0 10px rgba(220, 38, 38, 0.3)' }}>{t('radiationEffects.lethalLabel')}</span>
              </div>
            </div>
          </Col>

          {/* Right Side: Information */}
          <Col lg={6} md={6}>
            <Card style={cardStyle} className={`info-card ${isFading ? 'fade-out' : 'fade-in'}`}>
              <Card.Body style={{ padding: '2.5rem' }}>
                <div className="level-badge mb-3" style={{ 
                  display: 'inline-block', 
                  padding: '5px 15px', 
                  borderRadius: '20px', 
                  backgroundColor: ['#4ade80', '#fbbf24', '#f97316', '#ea580c', '#dc2626', '#7f1d1d'][activeLevel],
                  color: activeLevel === 0 ? '#000' : '#fff',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  Level {activeLevel}
                </div>
                
                <h3 className="mb-4" style={{ fontWeight: 'bold' }}>{radiationLevels[activeLevel].level}</h3>
                
                <div className="mb-4">
                  <h5 style={{ color: '#eb7415', fontWeight: 'bold' }}>{t('radiationEffects.sourceLabel')}</h5>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{radiationLevels[activeLevel].sources}</p>
                </div>
                
                <div className="mb-2">
                  <h5 style={{ color: '#eb7415', fontWeight: 'bold' }}>{t('radiationEffects.effectLabel')}</h5>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>{radiationLevels[activeLevel].effects}</p>
                </div>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-5">
              <button type="button" className="btn1 rounded-5" style={{ padding: "12px 40px", backgroundColor: '#eb7415', border: 'none' }} onClick={() => navigate(-1)}>
                {t('radiationEffects.backButton')}
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EdukasiRadiasi;
