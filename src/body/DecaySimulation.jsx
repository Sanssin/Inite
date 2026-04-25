import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DecaySimulation.css';

const DecaySimulation = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('simulation');
  const currentLang = i18n.language || 'id';

  return (
    <div className="simulation-wrapper">
      <div className="simulation-navbar">
        <button className="btn-back" onClick={() => navigate('/simulations')}>
          ← {t('decay.backToMenu', 'Kembali ke Menu')}
        </button>
        <span className="simulation-title">{t('decay.title', 'Simulasi Peluruhan Radioaktif')}</span>
      </div>
      
      <div className="iframe-container">
        <iframe 
          src={`/simulations/decay/index.html?lang=${currentLang}&v=${new Date().getTime()}`} 
          title="Radioactive Decay Simulation"
          className="simulation-iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default DecaySimulation;
