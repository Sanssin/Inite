import React from 'react';
import { backendDataService } from '../services/BackendDataService';
import './SetupCards.css';

const DynamicSourceCard = ({ source, sourceData, isSelected, onClick }) => {
  if (!sourceData) {
    return (
      <div className="setup-card source-card">
        <div className="card-header">
          <div className="card-icon">⏳</div>
          <div>
            <h4 className="card-title">Loading...</h4>
            <p className="card-subtitle">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  const icon = backendDataService.getIsotopeIcon(source);

  return (
    <div 
      className={`setup-card source-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(source)}
    >
      <div className="card-header">
        <div className="card-icon">
          {icon}
        </div>
        <div>
          <h4 className="card-title">{sourceData.name}</h4>
          <p className="card-subtitle">{backendDataService.getIsotopeSymbol(source)}</p>
        </div>
      </div>

      <div className="card-details">
        <div className="card-detail-item">
          <span className="card-detail-label">Tgl. Produksi:</span>
          <span className="card-detail-value">{formatProductionDate(sourceData.production_date)}</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">Waktu Paruh:</span>
          <span className="card-detail-value">{sourceData.half_life_years} tahun</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">Energi Gamma:</span>
          <span className="card-detail-value">{sourceData.gamma_energy}</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">Konstanta Gamma:</span>
          <span className="card-detail-value">{sourceData.gamma_constant?.toFixed(3) || 'N/A'}</span>
        </div>
      </div>

      <div className="card-description">
        {backendDataService.getIsotopeDescription(source)}
      </div>
    </div>
  );
};

// Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
const formatProductionDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

export default DynamicSourceCard;