import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DynamicSourceCard from '../components/DynamicSourceCard';
import DynamicMaterialCard from '../components/DynamicMaterialCard';
import { backendDataService } from '../services/BackendDataService';
import '../components/SetupCards.css';

// Data tebal default (sekitar 80% HVL, dengan override untuk timbal)
const defaultThicknesses = {
  'cs-137': { lead: 0.1, concrete: 3.7, glass: 7, steel: 1.5 },
  'co-60': { lead: 0.1, concrete: 5.5, glass: 10, steel: 2 },
  'na-22': { lead: 0.1, concrete: 5.0, glass: 11, steel: 1.8 },
  'am-241': { lead: 0.1, concrete: 4.0, glass: 8, steel: 1.6 },
};

const SetupSim = () => {
  const navigate = useNavigate();
  const [sourceType, setSourceType] = useState('cs-137');
  const [initialActivity, setInitialActivity] = useState(10);
  const [shieldingMaterial, setShieldingMaterial] = useState('lead');
  // Atur nilai awal tebal berdasarkan sourceType dan shieldingMaterial awal
  const [shieldingThickness, setShieldingThickness] = useState(defaultThicknesses['cs-137']['lead']);
  const [isFormValid, setIsFormValid] = useState(true);

  // Backend data states
  const [isotopeDetails, setIsotopeDetails] = useState(null);
  const [materialDetails, setMaterialDetails] = useState(null);
  const [availableIsotopes, setAvailableIsotopes] = useState(['cs-137', 'co-60', 'na-22']);
  const [availableMaterials, setAvailableMaterials] = useState(['lead', 'concrete', 'glass']);
  const [backendStatus, setBackendStatus] = useState('loading'); // 'loading', 'connected', 'fallback'

  const activityLimits = { min: 1, max: 1000 };
  const thicknessLimits = { min: 0.1, max: 100 };

  // Load data from backend on component mount
  useEffect(() => {
    loadBackendData();
  }, []);

  // Reload material data when source type changes
  useEffect(() => {
    if (sourceType && backendStatus !== 'loading') {
      loadMaterialData();
    }
  }, [sourceType, backendStatus]);

  const loadBackendData = async () => {
    try {
      setBackendStatus('loading');
      
      // Load isotope details
      const isotopeResult = await backendDataService.getIsotopeDetails();
      if (isotopeResult.success) {
        setIsotopeDetails(isotopeResult.data);
        setAvailableIsotopes(Object.keys(isotopeResult.data));
        setBackendStatus('connected');
      } else {
        setIsotopeDetails(isotopeResult.data); // Fallback data
        setBackendStatus('fallback');
      }

      // Load initial material details
      await loadMaterialData();
      
    } catch (error) {
      console.error('Failed to load backend data:', error);
      setBackendStatus('fallback');
      // Use fallback data
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
        setMaterialDetails(materialResult.data); // Fallback data
      }
    } catch (error) {
      console.error('Failed to load material data:', error);
      setMaterialDetails(backendDataService.getFallbackMaterialData(sourceType));
    }
  };

  // Validasi form saat input berubah
  useEffect(() => {
    const isActivityValid = initialActivity >= activityLimits.min && initialActivity <= activityLimits.max;
    const isThicknessValid = shieldingThickness >= thicknessLimits.min && shieldingThickness <= thicknessLimits.max;
    setIsFormValid(isActivityValid && isThicknessValid);
  }, [initialActivity, shieldingThickness]);

  // Handler untuk mengubah sumber radiasi dari card
  const handleSourceCardClick = (newSource) => {
    setSourceType(newSource);
    // Perbarui tebal ke nilai default untuk kombinasi baru
    const newThickness = defaultThicknesses[newSource][shieldingMaterial] || 0.1;
    setShieldingThickness(newThickness);
  };

  // Handler untuk mengubah material perisai dari card
  const handleMaterialCardClick = (newMaterial) => {
    // Convert material key if needed
    const materialKey = backendDataService.convertMaterialKey(newMaterial) || newMaterial;
    setShieldingMaterial(materialKey);
    // Perbarui tebal ke nilai default untuk kombinasi baru
    const newThickness = defaultThicknesses[sourceType][materialKey] || 0.1;
    setShieldingThickness(newThickness);
  };



  const getDisplayName = (material) => {
    const displayNames = {
      'lead': 'Timbal (Lead)',
      'concrete': 'Beton (Concrete)', 
      'glass': 'Kaca (Glass)',
      'steel': 'Baja (Steel)',
    };
    return displayNames[material] || material;
  };

  const handleStart = () => {
    if (!isFormValid) return;
    
    const setupData = {
      sourceType,
      initialActivity,
      shieldingMaterial: getDisplayName(shieldingMaterial),
      shieldingThickness
    };
    
    navigate('/game', { state: { setupData } });
  };

  const getInputStyle = (value, limits) => ({
    borderColor: (value >= limits.min && value <= limits.max) ? '' : 'red',
    boxShadow: (value >= limits.min && value <= limits.max) ? '' : '0 0 0 0.25rem rgba(255, 0, 0, 0.25)'
  });

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Container fluid className="px-0">
        <div className="header-box mx-0">
          <Row className="justify-content-center text-center w-100 mx-0">
            <Col lg={8} md={10} xs={12} className="px-2">
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold" }}>Pengaturan Misi Simulasi</h1>
              <div style={{textAlign: 'justify', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', color: 'white'}}>
                <h4 style={{color: 'white'}}>Misi Anda:</h4>
                <p>Anda ditugaskan untuk melakukan survei radiasi di sebuah fasilitas. Tugas utama Anda adalah <strong>mengukur laju dosis</strong> di lokasi yang telah ditentukan (ditandai dengan kotak khusus dalam simulasi). Gunakan pengetahuan dari materi pembekalan untuk menjaga dosis total yang Anda terima serendah mungkin.</p>
                <p>Atur parameter simulasi di bawah ini untuk memulai.</p>
              </div>

              <Form className="mt-3" style={{textAlign: 'left'}}>
                {/* Source Selection Cards */}
                <div className="setup-cards-container">
                  <h5 className="cards-section-title">
                    Pilih Sumber Radiasi Gamma:
                    {backendStatus === 'fallback' && (
                      <small style={{ color: '#ffc107', marginLeft: '10px' }}>
                        (Mode Offline)
                      </small>
                    )}
                  </h5>
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



                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2">Aktivitas Awal (Ci):</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={initialActivity} 
                    onChange={(e) => setInitialActivity(parseFloat(e.target.value) || 0)} 
                    min={activityLimits.min} 
                    max={activityLimits.max} 
                    style={{
                      ...getInputStyle(initialActivity, activityLimits),
                      maxWidth: '200px'
                    }}
                    className="form-control"
                  />
                  <Form.Text className="form-text text-center">Masukkan nilai antara 1 - 1000 Curie (Ci).</Form.Text>
                </Form.Group>

                {/* Material Selection Cards */}
                <div className="setup-cards-container">
                  <h5 className="cards-section-title">
                    Pilih Bahan Perisai (Shielding):
                    {backendStatus === 'fallback' && (
                      <small style={{ color: '#ffc107', marginLeft: '10px' }}>
                        (Mode Offline)
                      </small>
                    )}
                  </h5>
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



                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2">Tebal Perisai (cm):</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={shieldingThickness} 
                    onChange={(e) => setShieldingThickness(parseFloat(e.target.value) || 0)} 
                    min={thicknessLimits.min} 
                    max={thicknessLimits.max} 
                    step="0.1"
                    style={{
                      ...getInputStyle(shieldingThickness, thicknessLimits),
                      maxWidth: '200px'
                    }}
                    className="form-control"
                  />
                  <Form.Text className="form-text text-center">Masukkan nilai antara 0,1 - 100 cm.</Form.Text>
                </Form.Group>

                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={handleStart} 
                    disabled={!isFormValid} 
                    className="btn1 rounded-5"
                  >
                    Mulai Misi
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

export default SetupSim;