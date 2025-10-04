import React from 'react';
import { backendDataService } from '../services/BackendDataService';
import './SetupCards.css';

const DynamicMaterialCard = ({ material, materialData, isSelected, onClick }) => {
  if (!materialData) {
    return (
      <div className="setup-card material-card">
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

  const icon = backendDataService.getMaterialIcon(material);
  const materialKey = materialData.key || material;

  return (
    <div 
      className={`setup-card material-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(materialKey)}
    >
      <div className="card-header">
        <div className="card-icon">
          {icon}
        </div>
        <div>
          <h4 className="card-title">{materialData.name}</h4>
          <p className="card-subtitle">{getMaterialSymbol(materialKey)}</p>
        </div>
      </div>

      <div className="card-details">
        <div className="card-detail-item">
          <span className="card-detail-label">Densitas:</span>
          <span className="card-detail-value">{materialData.density?.toFixed(2) || 'N/A'} g/cm³</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">No. Atom:</span>
          <span className="card-detail-value">{materialData.atomic_number}</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">HVL:</span>
          <span className="card-detail-value">{materialData.hvl?.toFixed(2) || 'N/A'} cm</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">Koef. Atenuasi:</span>
          <span className="card-detail-value">{materialData.attenuation_coefficient?.toFixed(3) || 'N/A'} cm⁻¹</span>
        </div>
      </div>

      <div className="card-description">
        {backendDataService.getMaterialDescription(materialKey)}
      </div>
    </div>
  );
};

const getMaterialSymbol = (materialKey) => {
  const symbols = {
    'lead': 'Pb',
    'concrete': 'Concrete',
    'glass': 'Lead Glass',
    'timbal': 'Pb',
    'beton': 'Concrete',
    'kaca': 'Lead Glass'
  };
  
  return symbols[materialKey.toLowerCase()] || materialKey.toUpperCase();
};

export default DynamicMaterialCard;