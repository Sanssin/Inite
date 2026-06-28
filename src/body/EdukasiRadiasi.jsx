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
            d="M 100 10 A 19 22 0 1 0 100 54 A 19 22 0 1 0 100 10 Z 
               M 90 51 
               L 90 58 
               C 65 58 40 65 30 85 
               C 20 105 20 160 23 185 
               C 25 205 40 205 43 185 
               C 47 150 45 110 50 100 
               C 58 110 63 150 65 190 
               C 68 220 63 270 63 320 
               C 63 340 85 340 85 320 
               L 92 210 
               C 96 185 104 185 108 210 
               L 115 320 
               C 115 340 137 340 137 320 
               C 137 270 132 220 135 190 
               C 137 150 142 110 150 100 
               C 155 110 153 150 157 185 
               C 160 205 175 205 177 185 
               C 180 160 180 105 170 85 
               C 160 65 135 58 110 58 
               L 110 51 
               Z"
            fill={bodyColor}
            style={{ transition: 'fill 0.5s ease', filter: level > 0 ? `url(#glow) drop-shadow(0 0 ${level * 5}px ${bodyColor})` : 'none' }}
          />

          {/* Level 3+: Gastrointestinal Tract */}
          <g className={level >= 3 ? "pulse-stomach" : ""} style={{ opacity: level >= 3 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M 100 125 C 115 120 120 135 110 145 C 92 152 82 135 90 125 Z" fill="#facc15" />
            <path d="M 85 150 C 70 150 75 160 85 160 C 95 160 90 170 85 170 C 75 170 80 185 95 185 C 110 185 115 170 105 170 C 95 170 100 160 110 160 C 120 160 125 150 110 150 Z" fill="#facc15" opacity="0.8" />
          </g>

          {/* Level 4+: Hematopoietic System (Bones) */}
          <g className={level >= 4 ? "pulse-bones" : ""} style={{ opacity: level >= 4 ? 1 : 0, transition: 'opacity 1s ease' }}>
            {/* Spine */}
            <line x1="100" y1="58" x2="100" y2="185" stroke="#fff" strokeWidth="5" strokeDasharray="6 3" strokeLinecap="round" />
            {/* Ribs */}
            <path d="M 100 85 Q 82 85 78 100 M 100 85 Q 118 85 122 100" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 100 100 Q 80 100 76 115 M 100 100 Q 120 100 124 115" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 100 115 Q 82 115 78 130 M 100 115 Q 118 115 122 130" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Pelvis & Femurs */}
            <path d="M 85 185 Q 100 195 115 185 Q 105 170 85 185" fill="#fff" opacity="0.8" />
            <path d="M 85 195 L 77 260 M 115 195 L 123 260" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <path d="M 77 270 L 73 325 M 123 270 L 127 325" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Level 5: Central Nervous System (Brain) */}
          <g className={level >= 5 ? "pulse-brain" : ""} style={{ opacity: level >= 5 ? 1 : 0, transition: 'opacity 1s ease' }}>
            <path d="M 94 22 C 87 18 92 12 100 15 C 108 12 113 18 106 22 C 114 28 113 40 104 44 C 100 46 99 46 96 44 C 87 40 86 28 94 22 Z" fill="#e0e7ff" />
            <path d="M 97 18 C 100 22 97 34 100 40 M 103 18 C 100 22 103 34 100 40" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
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
