import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

import DynamicSourceCard from '../components/DynamicSourceCard';
import DynamicMaterialCard from '../components/DynamicMaterialCard';
import { backendDataService } from '../services/BackendDataService';
import '../components/SetupCards.css';

// Data tebal default 
const defaultThicknesses = {
  'cs-137': { lead: 0.1, concrete: 3.7, glass: 7, steel: 1.5 },
  'co-60': { lead: 0.1, concrete: 5.5, glass: 10, steel: 2 },
  'na-22': { lead: 0.1, concrete: 5.0, glass: 11, steel: 1.8 },
  'am-241': { lead: 0.1, concrete: 4.0, glass: 8, steel: 1.6 },
  'u-235': { lead: 0.1, concrete: 1.8, glass: 0.1, steel: 0.4 },
  'th-232': { lead: 0.1, concrete: 1.0, glass: 0.1, steel: 0.1 },
  'pu-239': { lead: 0.1, concrete: 0.8, glass: 0.1, steel: 0.1 },
  'i-131': { lead: 0.1, concrete: 2.4, glass: 0.4, steel: 0.7 },
};

const getDefaultThickness = (sourceType, material) => defaultThicknesses[sourceType]?.[material] ?? 0.1;
const formatInputValue = (value) => String(value);
const parseInputNumber = (inputValue) => {
  const normalizedValue = inputValue.trim();
  if (normalizedValue === '') return null;
  const numericValue = Number(normalizedValue);
  return Number.isFinite(numericValue) ? numericValue : null;
};
const isValueWithinLimits = (value, limits) => value !== null && value >= limits.min && value <= limits.max;

const SetupSim2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const navigate = useNavigate();
  
  const [sourceType, setSourceType] = useState('cs-137');
  const [initialActivityInput, setInitialActivityInput] = useState('10');
  const [shieldingMaterial, setShieldingMaterial] = useState('lead');
  const [shieldingThicknessInput, setShieldingThicknessInput] = useState(
    formatInputValue(getDefaultThickness('cs-137', 'lead'))
  );

  const [isotopeDetails, setIsotopeDetails] = useState(null);
  const [materialDetails, setMaterialDetails] = useState(null);
  const [availableIsotopes, setAvailableIsotopes] = useState([
    'cs-137', 'co-60', 'na-22', 'am-241', 'u-235', 'th-232', 'pu-239', 'i-131'
  ]);
  const [availableMaterials, setAvailableMaterials] = useState(['lead', 'concrete', 'glass', 'steel']);
  const [backendStatus, setBackendStatus] = useState('loading'); 

  const activityLimits = { min: 1, max: 1000 };
  const thicknessLimits = { min: 0.1, max: 100 };
  const parsedInitialActivity = parseInputNumber(initialActivityInput);
  const parsedShieldingThickness = parseInputNumber(shieldingThicknessInput);
  const isActivityValid = isValueWithinLimits(parsedInitialActivity, activityLimits);
  const isThicknessValid = isValueWithinLimits(parsedShieldingThickness, thicknessLimits);
  const isFormValid = isActivityValid && isThicknessValid;

  useEffect(() => { loadBackendData(); }, []);
  useEffect(() => {
    if (sourceType && backendStatus !== 'loading') {
      loadMaterialData();
    }
  }, [sourceType, backendStatus]);

  const loadBackendData = async () => {
    try {
      setBackendStatus('loading');
      const isotopeResult = await backendDataService.getIsotopeDetails();
      if (isotopeResult.success) {
        setIsotopeDetails(isotopeResult.data);
        setAvailableIsotopes(Object.keys(isotopeResult.data));
        setBackendStatus('connected');
      } else {
        setIsotopeDetails(isotopeResult.data);
        setBackendStatus('fallback');
      }
      await loadMaterialData();
    } catch (error) {
      setBackendStatus('fallback');
      setIsotopeDetails(backendDataService.getFallbackIsotopeData());
      setMaterialDetails(backendDataService.getFallbackMaterialData(sourceType));
    }
  };

  const loadMaterialData = async () => {
    try {
      const materialResult = await backendDataService.getMaterialDetails(sourceType);
      if (materialResult.success) {
        setMaterialDetails(materialResult.data);
        setAvailableMaterials(Object.keys(materialResult.data));
      } else {
        setMaterialDetails(materialResult.data);
      }
    } catch (error) {
      setMaterialDetails(backendDataService.getFallbackMaterialData(sourceType));
    }
  };

  const handleSourceCardClick = (newSource) => {
    setSourceType(newSource);
    const newThickness = getDefaultThickness(newSource, shieldingMaterial);
    setShieldingThicknessInput(formatInputValue(newThickness));
  };

  const handleMaterialCardClick = (newMaterial) => {
    const materialKey = backendDataService.convertMaterialKey(newMaterial) || newMaterial;
    setShieldingMaterial(materialKey);
    const newThickness = getDefaultThickness(sourceType, materialKey);
    setShieldingThicknessInput(formatInputValue(newThickness));
  };

  // FUNGSI UTAMA: Mengirim semua data parameter ke halaman Game!
  const handleStart = () => {
    if (!isFormValid) return;

    const setupData = {
      mode: 'simulasi',
      sourceType,
      initialActivity: parsedInitialActivity,
      shieldingMaterial: shieldingMaterial,
      shieldingThickness: parsedShieldingThickness
    };

    // Pindah ke rute '/game2'
    navigate('/game2', { state: { setupData } });
  };

  const getInputStyle = (isValid) => ({
    borderColor: isValid ? '' : 'red',
    boxShadow: isValid ? '' : '0 0 0 0.25rem rgba(255, 0, 0, 0.25)'
  });

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", paddingBottom: '50px' }}>
      <Container fluid className="px-0">
        <div className="header-box mx-0 mt-4">
          <Row className="justify-content-center text-center w-100 mx-0">
            <Col lg={8} md={10} xs={12} className="px-2">
              <h1 style={{ color: "#cca60b", fontWeight: "bold" }}>Lab Proteksi Radiasi Ekater</h1>
              
              <div style={{ textAlign: 'justify', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: '#e6e6e6', marginTop: '20px' }}>
                <h4 style={{ color: '#cca60b', textAlign: 'center', marginBottom: '15px' }}>Prinsip Pelindung Radiasi</h4>
                <p>Di lab ini, Anda memiliki kebebasan penuh. Pilih sumber radiasi dan rancang pelindung Anda sendiri.</p>
                <p><strong>Ingat Prinsip Fisika:</strong> Setiap jenis material memiliki kekuatan atenuasi yang berbeda. Semakin tebal pelindung yang Anda gunakan, semakin drastis pula penurunan dosis radiasi yang akan bocor melewatinya. Uji berbagai kombinasi ketebalan dan material untuk melihat efeknya secara real-time!</p>
              </div>

              <Form className="mt-4" style={{ textAlign: 'left' }}>
                <div className="setup-cards-container">
                  <h5 className="cards-section-title" style={{ color: '#fff' }}>1. Pilih Sumber Radiasi</h5>
                  <div className="cards-grid">
                    {availableIsotopes.map(isotope => (
                      <DynamicSourceCard
                        key={isotope}
                        source={isotope}
                        sourceData={isotopeDetails ? isotopeDetails[isotope] : null}
                        isSelected={sourceType === isotope}
                        onClick={handleSourceCardClick}
                      />
                    ))}
                  </div>
                </div>

                <Form.Group className="mb-4 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2" style={{ color: '#fff' }}>Aktivitas Awal (Bq)</Form.Label>
                  <Form.Control
                    type="number"
                    value={initialActivityInput}
                    onChange={(e) => setInitialActivityInput(e.target.value)}
                    min={activityLimits.min}
                    max={activityLimits.max}
                    style={{ ...getInputStyle(isActivityValid), maxWidth: '200px', textAlign: 'center' }}
                  />
                </Form.Group>

                <div className="setup-cards-container mt-5">
                  <h5 className="cards-section-title" style={{ color: '#fff' }}>2. Pilih Material Pelindung</h5>
                  <div className="cards-grid">
                    {availableMaterials.map(material => {
                      const materialKey = backendDataService.convertMaterialKey(material) || material;
                      return (
                        <DynamicMaterialCard
                          key={materialKey}
                          material={materialKey}
                          materialData={materialDetails ? materialDetails[material] : null}
                          isSelected={shieldingMaterial === materialKey}
                          onClick={handleMaterialCardClick}
                        />
                      );
                    })}
                  </div>
                </div>

                <Form.Group className="mb-4 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2" style={{ color: '#fff' }}>Ketebalan Pelindung (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    value={shieldingThicknessInput}
                    onChange={(e) => setShieldingThicknessInput(e.target.value)}
                    min={thicknessLimits.min}
                    max={thicknessLimits.max}
                    step="0.1"
                    style={{ ...getInputStyle(isThicknessValid), maxWidth: '200px', textAlign: 'center' }}
                  />
                  <Form.Text className="text-muted mt-2">
                    Ubah angka ini untuk melihat efek pengurangan dosis berdasarkan ketebalan.
                  </Form.Text>
                </Form.Group>

                <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
                  <button type="button" onClick={() => navigate('/select-mode')} className="btn2 rounded-5">
                    Kembali
                  </button>
                  <button type="button" onClick={handleStart} disabled={!isFormValid} className="btn1 rounded-5">
                    Mulai Eksperimen!
                  </button>
                </div>

              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default SetupSim2;
