import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SimulationMenu.css';

// Import SVG Assets
import decayIcon from '../assets/simulations/decay-icon.svg';
import radiationTypesIcon from '../assets/simulations/radiation-types-icon.svg';
import rutherfordIcon from '../assets/simulations/rutherford-icon.svg';
import reactorIcon from '../assets/simulations/reactor-icon.svg';
import detectorIcon from '../assets/simulations/detector-icon.svg';

const SimulationMenu = () => {
  const { t } = useTranslation('common');

  const simulations = [
    {
      id: 'radioactive-decay',
      icon: decayIcon,
      path: '/simulations/decay',
      status: 'available', // Or 'coming_soon'
      priority: 1
    },
    {
      id: 'radiation-types',
      icon: radiationTypesIcon,
      path: '/simulations/types',
      status: 'coming_soon',
      priority: 1
    },
    {
      id: 'rutherford-scattering',
      icon: rutherfordIcon,
      path: '/simulations/rutherford',
      status: 'coming_soon',
      priority: 1
    },
    {
      id: 'nuclear-reactor',
      icon: reactorIcon,
      path: '/simulations/reactor',
      status: 'coming_soon',
      priority: 2
    },
    {
      id: 'radiation-detector',
      icon: detectorIcon,
      path: '/simulations/detector',
      status: 'coming_soon',
      priority: 2
    }
  ];

  return (
    <div className="simulation-menu-container">
      <div className="simulation-menu-header">
        <h1 className="simulation-menu-title">{t('simulationMenu.title', 'Daftar Simulasi')}</h1>
        <p className="simulation-menu-subtitle">
          {t('simulationMenu.subtitle', 'Pilih modul simulasi interaktif untuk mempelajari konsep fisika nuklir dan proteksi radiasi secara visual.')}
        </p>
      </div>

      <div className="simulation-grid">
        {simulations.map((sim, index) => (
          <div 
            key={sim.id} 
            className={`simulation-card ${sim.status}`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="simulation-card-badge">
              {sim.priority === 1 ? '⭐ Fundamental' : '🌟 Lanjutan'}
            </div>
            
            <div className="simulation-icon-wrapper">
              <img src={sim.icon} alt={sim.id} className="simulation-icon" />
            </div>
            
            <div className="simulation-card-content">
              <h3>{t(`simulationMenu.items.${sim.id}.title`, sim.id.replace('-', ' ').toUpperCase())}</h3>
              <p>{t(`simulationMenu.items.${sim.id}.description`, 'Deskripsi simulasi akan segera hadir.')}</p>
            </div>

            <div className="simulation-card-footer">
              {sim.status === 'available' ? (
                <Link to={sim.path} className="btn-start-simulation">
                  {t('simulationMenu.startBtn', 'Mulai Simulasi')}
                </Link>
              ) : (
                <span className="badge-coming-soon">
                  {t('simulationMenu.comingSoon', 'Segera Hadir')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationMenu;