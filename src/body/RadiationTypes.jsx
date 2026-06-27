import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './RadiationTypes.css';

const RadiationTypes = () => {
  const { t } = useTranslation('simulation'); // Changed to 'simulation' namespace
  const [obstacle, setObstacle] = useState('none'); // none, paper, aluminum, lead
  const [filter, setFilter] = useState('all'); // all, alpha, beta, gamma
  const [particles, setParticles] = useState([]);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const types = ['alpha', 'beta', 'gamma'];
      
      for (let i = 0; i < 20; i++) {
        types.forEach((type) => {
          if (filter !== 'all' && filter !== type) return;
          
          const delay = Math.random() * 4; // 0 to 4s delay for continuous flow
          const topOffset = 25 + Math.random() * 50; // 25% to 75% of the emitter height
          
          newParticles.push({
            id: `${type}-${i}-${Date.now()}`,
            type,
            delay,
            topOffset
          });
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    // Periodically refresh particles to keep animation looping forever cleanly
    const interval = setInterval(generateParticles, 4000);
    return () => clearInterval(interval);
  }, [filter]);

  // SVG Components (Inline Vector Graphics)
  const GunSVG = () => (
    <svg viewBox="0 0 100 200" className="rt-emitter-svg">
      <defs>
        <linearGradient id="gunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2c3e50" />
          <stop offset="100%" stopColor="#34495e" />
        </linearGradient>
        <linearGradient id="hazard" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
          <stop offset="0%" stopColor="#f1c40f" />
          <stop offset="50%" stopColor="#f1c40f" />
          <stop offset="50%" stopColor="#2c3e50" />
          <stop offset="100%" stopColor="#2c3e50" />
        </linearGradient>
      </defs>
      <rect x="10" y="20" width="70" height="160" rx="10" fill="url(#gunGrad)" stroke="#1a252f" strokeWidth="4" />
      <rect x="20" y="30" width="50" height="140" fill="url(#hazard)" rx="5" />
      <rect x="80" y="80" width="20" height="40" fill="#1a252f" />
      <rect x="85" y="85" width="15" height="30" fill="#000" />
    </svg>
  );

  const PaperSVG = () => (
    <svg viewBox="0 0 40 200" className="rt-obstacle-svg">
      <rect x="15" y="10" width="10" height="180" fill="#fdfdfd" stroke="#ccc" strokeWidth="1" />
      <line x1="17" y1="30" x2="23" y2="30" stroke="#ddd" strokeWidth="1"/>
      <line x1="17" y1="40" x2="23" y2="40" stroke="#ddd" strokeWidth="1"/>
      <line x1="17" y1="50" x2="23" y2="50" stroke="#ddd" strokeWidth="1"/>
    </svg>
  );

  const AluminumSVG = () => (
    <svg viewBox="0 0 40 200" className="rt-obstacle-svg">
      <defs>
        <linearGradient id="alum" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b3b8c2" />
          <stop offset="50%" stopColor="#eef2f5" />
          <stop offset="100%" stopColor="#8a919e" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="20" height="180" fill="url(#alum)" stroke="#7a828e" strokeWidth="2" rx="2" />
    </svg>
  );

  const LeadSVG = () => (
    <svg viewBox="0 0 60 200" className="rt-obstacle-svg">
      <rect x="0" y="10" width="60" height="180" fill="#3a3c42" stroke="#1d1e21" strokeWidth="4" rx="5" />
      <circle cx="15" cy="30" r="2" fill="#2a2c30" />
      <circle cx="45" cy="70" r="3" fill="#2a2c30" />
      <circle cx="20" cy="120" r="2" fill="#2a2c30" />
      <circle cx="40" cy="160" r="2" fill="#2a2c30" />
    </svg>
  );

  const renderObstacle = () => {
    switch (obstacle) {
      case 'paper': return <div className="rt-obstacle-wrapper"><PaperSVG /><div className="rt-obstacle-label">{t('radiationTypes.obsPaper')}</div></div>;
      case 'aluminum': return <div className="rt-obstacle-wrapper"><AluminumSVG /><div className="rt-obstacle-label">{t('radiationTypes.obsAlum')}</div></div>;
      case 'lead': return <div className="rt-obstacle-wrapper"><LeadSVG /><div className="rt-obstacle-label">{t('radiationTypes.obsLead')}</div></div>;
      default: return <div className="rt-obstacle-wrapper empty"></div>;
    }
  };

  const getAnimationClass = (type) => {
    if (obstacle === 'none') return 'pass';
    if (obstacle === 'paper') {
      return type === 'alpha' ? 'block' : 'pass';
    }
    if (obstacle === 'aluminum') {
      return type === 'gamma' ? 'pass' : 'block';
    }
    if (obstacle === 'lead') {
      // For simplicity in this visual simulation, lead blocks everything
      return 'block';
    }
    return 'pass';
  };

  return (
    <div className="rt-container">
      <div className="rt-header">
        <Link to="/simulations" className="rt-back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t('radiationTypes.back')}
        </Link>
        <h1 className="rt-title">{t('radiationTypes.title')}</h1>
      </div>

      <div className="rt-simulation-area">
        {/* LEGEND ADDED HERE */}
        <div className="rt-legend-panel">
          <div className="rt-legend-title">{t('radiationTypes.legend')}</div>
          
          <div className="rt-legend-item">
            <div className="rt-legend-icon">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <circle cx="10" cy="10" r="5" fill="#e74c3c" />
                <circle cx="14" cy="14" r="5" fill="#e74c3c" />
                <circle cx="14" cy="10" r="5" fill="#3498db" />
                <circle cx="10" cy="14" r="5" fill="#3498db" />
              </svg>
            </div>
            <div><strong>α:</strong> {t('radiationTypes.legendAlpha')}</div>
          </div>
          
          <div className="rt-legend-item">
            <div className="rt-legend-icon">
              <svg viewBox="0 0 16 16" width="12" height="12">
                <circle cx="8" cy="8" r="6" fill="#f1c40f" />
              </svg>
            </div>
            <div><strong>β:</strong> {t('radiationTypes.legendBeta')}</div>
          </div>
          
          <div className="rt-legend-item">
            <div className="rt-legend-icon">
              <svg viewBox="0 0 40 10" width="20" height="10" preserveAspectRatio="none">
                <path d="M0,5 Q5,0 10,5 T20,5 T30,5 T40,5" fill="none" stroke="#9b59b6" strokeWidth="3" />
              </svg>
            </div>
            <div><strong>γ:</strong> {t('radiationTypes.legendGamma')}</div>
          </div>
        </div>

        <div className="rt-zone emitter-zone">
          <GunSVG />
          <div className="rt-zone-label">{t('radiationTypes.source')}</div>
        </div>

        <div className="rt-zone particles-zone">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`rt-particle ${p.type} ${getAnimationClass(p.type)}`}
              style={{
                top: `${p.topOffset}%`,
                animationDelay: `${p.delay}s`
              }}
            >
              {p.type === 'alpha' && (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <circle cx="10" cy="10" r="5" fill="#e74c3c" />
                  <circle cx="14" cy="14" r="5" fill="#e74c3c" />
                  <circle cx="14" cy="10" r="5" fill="#3498db" />
                  <circle cx="10" cy="14" r="5" fill="#3498db" />
                  <text x="12" y="16" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">α</text>
                </svg>
              )}
              {p.type === 'beta' && (
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <circle cx="8" cy="8" r="6" fill="#f1c40f" />
                  <text x="8" y="12" fontSize="10" fill="black" textAnchor="middle" fontWeight="bold">β</text>
                </svg>
              )}
              {p.type === 'gamma' && (
                <svg viewBox="0 0 40 10" width="40" height="10" preserveAspectRatio="none">
                  <path d="M0,5 Q5,0 10,5 T20,5 T30,5 T40,5" fill="none" stroke="#9b59b6" strokeWidth="2.5" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="rt-zone obstacle-zone">
          {renderObstacle()}
        </div>
      </div>

      <div className="rt-controls-container">
        <div className="rt-control-group">
          <h3>{t('radiationTypes.selectObstacle')}</h3>
          <div className="rt-buttons">
            <button className={`rt-btn ${obstacle === 'none' ? 'active' : ''}`} onClick={() => setObstacle('none')}>{t('radiationTypes.obsNone')}</button>
            <button className={`rt-btn ${obstacle === 'paper' ? 'active' : ''}`} onClick={() => setObstacle('paper')}>{t('radiationTypes.obsPaper')}</button>
            <button className={`rt-btn ${obstacle === 'aluminum' ? 'active' : ''}`} onClick={() => setObstacle('aluminum')}>{t('radiationTypes.obsAlum')}</button>
            <button className={`rt-btn ${obstacle === 'lead' ? 'active' : ''}`} onClick={() => setObstacle('lead')}>{t('radiationTypes.obsLead')}</button>
          </div>
        </div>

        <div className="rt-control-group">
          <h3>{t('radiationTypes.selectRadiation')}</h3>
          <div className="rt-buttons">
            <button className={`rt-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{t('radiationTypes.radAll')}</button>
            <button className={`rt-btn ${filter === 'alpha' ? 'active' : ''}`} onClick={() => setFilter('alpha')}>Alfa (α)</button>
            <button className={`rt-btn ${filter === 'beta' ? 'active' : ''}`} onClick={() => setFilter('beta')}>Beta (β)</button>
            <button className={`rt-btn ${filter === 'gamma' ? 'active' : ''}`} onClick={() => setFilter('gamma')}>Gamma (γ)</button>
          </div>
        </div>
      </div>
      
      <div className="rt-info-panel">
        <div className="rt-info-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#cca60b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
        <div className="rt-info-text">
          {obstacle === 'none' && <span>{t('radiationTypes.infoNone')}</span>}
          {obstacle === 'paper' && <span>{t('radiationTypes.infoPaper')}</span>}
          {obstacle === 'aluminum' && <span>{t('radiationTypes.infoAlum')}</span>}
          {obstacle === 'lead' && <span>{t('radiationTypes.infoLead')}</span>}
        </div>
      </div>

      <div className="rt-theory-section">
        <h2>{t('radiationTypes.theoryTitle')}</h2>
        <p>{t('radiationTypes.theoryContent1')}</p>
        <p>{t('radiationTypes.theoryContent2')}</p>
      </div>
    </div>
  );
};

export default RadiationTypes;
