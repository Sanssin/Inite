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
        
        {/* Radiation Particles/Waves (Active when level > 0) */}
        <g className="radiation-particles" style={{ opacity: level > 0 ? Math.min(1, level * 0.25) : 0, stroke: level >= 4 ? '#ef4444' : bodyColor }}>
          {/* Use CSS animation to move particles across */}
          <line x1="-30" y1="80" x2="-10" y2="80" className={`particle p1 ${level > 0 ? 'anim-play' : 'anim-pause'}`} strokeWidth="3" strokeLinecap="round" />
          <line x1="-50" y1="140" x2="-20" y2="140" className={`particle p2 ${level > 0 ? 'anim-play' : 'anim-pause'}`} strokeWidth="4" strokeLinecap="round" />
          <line x1="-20" y1="200" x2="0" y2="200" className={`particle p3 ${level > 0 ? 'anim-play' : 'anim-pause'}`} strokeWidth="3" strokeLinecap="round" />
          <line x1="-60" y1="260" x2="-30" y2="260" className={`particle p4 ${level > 0 ? 'anim-play' : 'anim-pause'}`} strokeWidth="5" strokeLinecap="round" />
          <line x1="-10" y1="320" x2="20" y2="320" className={`particle p5 ${level > 0 ? 'anim-play' : 'anim-pause'}`} strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* Main Body Silhouette - More detailed anatomical outline */}
        <g transform="translate(0, 5)">
          <path
            d="M100 15 A18 18 0 1 0 100 51 A18 18 0 1 0 100 15 Z M70 65 C55 65 50 75 50 85 L50 180 C50 190 65 190 65 180 L65 120 L75 120 L75 350 C75 365 95 365 95 350 L95 220 L105 220 L105 350 C105 365 125 365 125 350 L125 120 L135 120 L135 180 C135 190 150 190 150 180 L150 85 C150 75 145 65 130 65 Z"
            fill={bodyColor}
            style={{ transition: 'fill 0.5s ease', filter: level > 0 ? 'url(#glow)' : 'none' }}
          />

          {/* Level 3+: Gastrointestinal Tract (Stomach & Intestines) */}
          <g className={level >= 3 ? "pulse-stomach" : ""} style={{ opacity: level >= 3 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M100 115 C115 115 120 125 115 135 C105 150 85 140 90 125 C92 120 95 115 100 115 Z" fill="#facc15" />
            <path d="M85 145 C75 145 75 155 85 155 C95 155 95 165 85 165 C75 165 75 175 85 175 L115 175 C125 175 125 165 115 165 C105 165 105 155 115 155 C125 155 125 145 115 145 Z" fill="#facc15" opacity="0.8" />
          </g>

          {/* Level 4+: Hematopoietic System (Bones) */}
          <g className={level >= 4 ? "pulse-bones" : ""} style={{ opacity: level >= 4 ? 1 : 0, transition: 'opacity 1s ease' }}>
            {/* Spine */}
            <line x1="100" y1="65" x2="100" y2="175" stroke="#fff" strokeWidth="5" strokeDasharray="8 4" strokeLinecap="round" />
            {/* Ribs */}
            <path d="M100 90 Q85 90 80 105 M100 90 Q115 90 120 105" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 110 Q80 110 75 125 M100 110 Q120 110 125 125" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Femurs */}
            <path d="M85 185 L85 270 M115 185 L115 270" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M85 280 L85 340 M115 280 L115 340" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Level 5: Central Nervous System (Brain) */}
          <g className={level >= 5 ? "pulse-brain" : ""} style={{ opacity: level >= 5 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M92 22 C88 17 95 12 100 15 C105 12 112 17 108 22 C115 27 115 37 105 42 C100 45 95 45 90 37 C85 32 85 25 92 22 Z" fill="#e0e7ff" />
            <path d="M96 17 C100 22 96 32 100 40 M104 17 C100 22 104 32 100 40" stroke="#8b5cf6" strokeWidth="1" fill="none" />
          </g>
        </g>
        
        {/* DNA Damage Overlay (Level 4 and 5) */}
        <g style={{ opacity: level >= 4 ? 1 : 0, transition: 'opacity 1s ease', transform: 'translate(145px, 20px) scale(0.6)' }}>
          <path d="M10 10 C30 30 10 50 30 70 C50 90 30 110 50 130" fill="none" stroke={level >= 5 ? "#ef4444" : "#f87171"} strokeWidth="4" className={level >= 5 ? "dna-break" : "dna-pulse"} />
          <path d="M50 10 C30 30 50 50 30 70 C10 90 30 110 10 130" fill="none" stroke="#3b82f6" strokeWidth="4" className="dna-pulse" />
          <line x1="20" y1="20" x2="40" y2="20" stroke="#fff" strokeWidth="2" />
          <line x1="15" y1="40" x2="35" y2="40" stroke="#fff" strokeWidth="2" />
          <line x1="20" y1="60" x2="40" y2="60" stroke="#fff" strokeWidth="2" />
          <line x1="25" y1="80" x2="45" y2="80" stroke="#fff" strokeWidth="2" className={level >= 5 ? "base-break" : ""} />
          <line x1="20" y1="100" x2="40" y2="100" stroke="#fff" strokeWidth="2" />
          <line x1="25" y1="120" x2="45" y2="120" stroke="#fff" strokeWidth="2" />
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
