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
        
        {/* Dynamic Radiation Waves based on Level */}
        <g className="radiation-waves" style={{ opacity: level >= 2 ? Math.min(1, level * 0.2) : 0, transition: 'opacity 1s ease' }}>
          {[1, 2, 3, 4].map((i) => (
            <circle 
              key={i} cx="-20" cy="150" r={i * 60} fill="none" 
              stroke={level >= 4 ? '#ef4444' : bodyColor} 
              strokeWidth={level >= 4 ? "4" : "2"} 
              className={`wave w${i} ${level >= 2 ? 'anim-play' : 'anim-pause'}`} 
              style={{ animationDuration: `${3 - (level * 0.3)}s` }}
            />
          ))}
        </g>

        {/* Radiation Particles (Active when level > 0) */}
        <g className="radiation-particles" style={{ opacity: level > 0 ? Math.min(1, level * 0.25) : 0, stroke: level >= 4 ? '#ef4444' : bodyColor }}>
          {[80, 140, 200, 260, 320].map((y, idx) => (
            <line 
              key={idx} x1="-30" y1={y} x2="-10" y2={y} 
              className={`particle p${idx + 1} ${level > 0 ? 'anim-play' : 'anim-pause'}`} 
              strokeWidth={level >= 4 ? 4 : 2} strokeLinecap="round" 
              style={{ animationDuration: `${(Math.random() * 1.5 + 1) - (level * 0.1)}s` }}
            />
          ))}
        </g>
        
        {/* Main Body Silhouette - Realistic Anatomical Shape */}
        <g transform="translate(0, 5)">
          {/* Head & Body Path */}
          <path
            d="M 99.7 15.2 C 92.5 15.2 86.8 21.6 86.8 29.5 C 86.8 37.4 92.5 43.8 99.7 43.8 C 106.9 43.8 112.7 37.4 112.7 29.5 C 112.7 21.6 106.9 15.2 99.7 15.2 Z M 99.7 49.5 C 85.3 49.5 73.1 57.3 65.8 67.8 C 61.2 74.4 56.4 86.6 52.8 104 C 48.7 123.6 46.1 148.6 45.4 159 C 44.9 166.7 54.3 169.8 58.7 163.5 C 62.4 158 66.8 136.2 71.3 113.8 C 73.8 101.4 75.9 96.6 77.9 96.6 C 79.8 96.6 81.3 103.7 82.2 119.5 C 83.3 138.8 83.9 184 81.3 226 C 78.4 274.2 73.2 341.2 73.1 352.5 C 72.8 368.5 87.2 370.2 92.9 356.5 C 97.4 345.5 101.2 291 101.7 248 L 99.7 236 L 97.8 248 C 98.3 291 102 345.5 106.6 356.5 C 112.3 370.2 126.7 368.5 126.3 352.5 C 126.3 341.2 121.1 274.2 118.2 226 C 115.6 184 116.1 138.8 117.3 119.5 C 118.1 103.7 119.7 96.6 121.6 96.6 C 123.6 96.6 125.6 101.4 128.1 113.8 C 132.6 136.2 137 158 140.7 163.5 C 145.2 169.8 154.5 166.7 154.1 159 C 153.4 148.6 150.8 123.6 146.6 104 C 143 86.6 138.2 74.4 133.7 67.8 C 126.3 57.3 114.2 49.5 99.7 49.5 Z"
            fill={bodyColor}
            style={{ transition: 'fill 0.5s ease', filter: level > 0 ? `url(#glow) drop-shadow(0 0 ${level * 5}px ${bodyColor})` : 'none' }}
          />

          {/* Level 3+: Gastrointestinal Tract */}
          <g className={level >= 3 ? "pulse-stomach" : ""} style={{ opacity: level >= 3 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M 100 125 C 115 120 118 135 110 145 C 95 150 85 135 90 125 Z" fill="#facc15" />
            <path d="M 85 150 C 70 150 75 160 85 160 C 95 160 90 170 85 170 C 75 170 80 180 95 180 C 110 180 115 170 105 170 C 95 170 100 160 110 160 C 120 160 125 150 110 150 Z" fill="#facc15" opacity="0.8" />
          </g>

          {/* Level 4+: Hematopoietic System (Bones) */}
          <g className={level >= 4 ? "pulse-bones" : ""} style={{ opacity: level >= 4 ? 1 : 0, transition: 'opacity 1s ease' }}>
            {/* Spine */}
            <line x1="99.7" y1="55" x2="99.7" y2="180" stroke="#fff" strokeWidth="4" strokeDasharray="6 3" strokeLinecap="round" />
            {/* Ribs */}
            <path d="M 99.7 80 Q 85 80 82 95 M 99.7 80 Q 114 80 117 95" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 99.7 95 Q 82 95 79 110 M 99.7 95 Q 117 95 120 110" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 99.7 110 Q 82 110 80 125 M 99.7 110 Q 117 110 119 125" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Pelvis & Femurs */}
            <path d="M 85 185 Q 99.7 195 114 185 Q 105 170 85 185" fill="#fff" opacity="0.8" />
            <path d="M 85 195 L 81 275 M 114 195 L 118 275" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path d="M 81 285 L 78 350 M 118 285 L 121 350" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Level 5: Central Nervous System (Brain) */}
          <g className={level >= 5 ? "pulse-brain" : ""} style={{ opacity: level >= 5 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M 94 20 C 89 16 93 12 100 15 C 106 12 110 16 105 20 C 112 25 111 35 103 38 C 100 40 99 40 96 38 C 88 35 87 25 94 20 Z" fill="#e0e7ff" />
            <path d="M 97 16 C 100 20 97 30 100 36 M 102 16 C 99 20 102 30 99 36" stroke="#8b5cf6" strokeWidth="1" fill="none" />
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
