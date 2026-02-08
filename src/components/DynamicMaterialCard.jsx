import React from 'react';
import { useTranslation } from 'react-i18next';
import { backendDataService } from '../services/BackendDataService';
import './SetupCards.css';

const DynamicMaterialCard = ({ material, materialData, isSelected, onClick }) => {
  const { t } = useTranslation(['simulation', 'common']);

  if (!materialData) {
    return (
      <div className="setup-card material-card">
        <div className="card-header">
          <div className="card-icon">⏳</div>
          <div>
            <h4 className="card-title">{t('cards.loading')}</h4>
            <p className="card-subtitle">{t('cards.pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  const icon = backendDataService.getMaterialIcon(material);
  const materialKey = materialData.key || material;
  const materialName = t(`common:materials.${materialKey}`, materialData.name);

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
          <h4 className="card-title">{materialName}</h4>
          <p className="card-subtitle">{t(`cards.materialSymbol.${materialKey}`, materialKey.toUpperCase())}</p>
        </div>
      </div>

      <div className="card-details">
        <div className="card-detail-item">
          <span className="card-detail-label">{t('cards.material.density')}</span>
          <span className="card-detail-value">{materialData.density?.toFixed(2) || 'N/A'} g/cm³</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">{t('cards.material.atomicNumber')}</span>
          <span className="card-detail-value">{materialData.atomic_number}</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">{t('cards.material.hvl')}</span>
          <span className="card-detail-value">{materialData.hvl?.toFixed(2) || 'N/A'} cm</span>
        </div>
        <div className="card-detail-item">
          <span className="card-detail-label">{t('cards.material.attenuationCoef')}</span>
          <span className="card-detail-value">{materialData.attenuation_coefficient?.toFixed(3) || 'N/A'} cm⁻¹</span>
        </div>
      </div>

      <div className="card-description">
        {t(`cards.materialDesc.${materialKey}`, t('cards.materialDesc.default'))}
      </div>
    </div>
  );
};

export default DynamicMaterialCard;