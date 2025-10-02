import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from "react-bootstrap";

// Data tebal default (sekitar 80% HVL, dengan override untuk timbal)
const defaultThicknesses = {
  'cs-137': { lead: 0.1, concrete: 3.7, glass: 7 },
  'co-60': { lead: 0.1, concrete: 5.5, glass: 10 },
  'Na-22': { lead: 0.1, concrete: 5.0, glass: 11}
};

const SetupSim = () => {
  const navigate = useNavigate();
  const [sourceType, setSourceType] = useState('cs-137');
  const [initialActivity, setInitialActivity] = useState(10);
  const [shieldingMaterial, setShieldingMaterial] = useState('lead');
  // Atur nilai awal tebal berdasarkan sourceType dan shieldingMaterial awal
  const [shieldingThickness, setShieldingThickness] = useState(defaultThicknesses['cs-137']['lead']);
  const [isFormValid, setIsFormValid] = useState(true);

  const activityLimits = { min: 1, max: 100 };
  const thicknessLimits = { min: 0.1, max: 50 };

  // Validasi form saat input berubah
  useEffect(() => {
    const isActivityValid = initialActivity >= activityLimits.min && initialActivity <= activityLimits.max;
    const isThicknessValid = shieldingThickness >= thicknessLimits.min && shieldingThickness <= thicknessLimits.max;
    setIsFormValid(isActivityValid && isThicknessValid);
  }, [initialActivity, shieldingThickness]);

  // Handler untuk mengubah sumber radiasi
  const handleSourceChange = (e) => {
    const newSource = e.target.value;
    setSourceType(newSource);
    // Perbarui tebal ke nilai default untuk kombinasi baru
    const newThickness = defaultThicknesses[newSource][shieldingMaterial];
    setShieldingThickness(newThickness);
  };

  // Handler untuk mengubah material perisai
  const handleMaterialChange = (e) => {
    const newMaterial = e.target.value;
    setShieldingMaterial(newMaterial);
    // Perbarui tebal ke nilai default untuk kombinasi baru
    const newThickness = defaultThicknesses[sourceType][newMaterial];
    setShieldingThickness(newThickness);
  };

  const getDisplayName = (material) => {
    const displayNames = {
      'lead': 'Timbal (Lead)',
      'concrete': 'Beton (Concrete)', 
      'glass': 'Kaca (Glass)'
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

  const handleStartOOP = () => {
    if (!isFormValid) return;
    
    const setupData = {
      sourceType,
      initialActivity,
      shieldingMaterial: getDisplayName(shieldingMaterial),
      shieldingThickness
    };
    
    navigate('/game-oop', { state: { setupData } });
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
              <div style={{textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', color: 'white'}}>
                <h4 style={{color: 'white'}}>Misi Anda:</h4>
                <p>Anda ditugaskan untuk melakukan survei radiasi di sebuah fasilitas. Tugas utama Anda adalah <strong>mengukur laju dosis</strong> di lokasi yang telah ditentukan (ditandai dengan kotak khusus dalam simulasi). Gunakan pengetahuan dari materi pembekalan untuk menjaga dosis total yang Anda terima serendah mungkin.</p>
                <p>Atur parameter simulasi di bawah ini untuk memulai.</p>
              </div>

              <Form className="mt-3" style={{textAlign: 'left'}}>
                {/* Mobile-first form layout */}
                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Sumber Radiasi Gamma:</Form.Label>
                  <Form.Select 
                    value={sourceType} 
                    onChange={handleSourceChange}
                    className="form-control"
                  >
                    <option value="cs-137">Cesium-137 (Cs-137)</option>
                    <option value="Co-60">Cobalt-60 (Co-60)</option>
                    <option value="Na-22">Sodium-22 (Na-22)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Aktivitas Awal (Ci):</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={initialActivity} 
                    onChange={(e) => setInitialActivity(parseFloat(e.target.value) || 0)} 
                    min={activityLimits.min} 
                    max={activityLimits.max} 
                    style={getInputStyle(initialActivity, activityLimits)}
                    className="form-control"
                  />
                  <Form.Text className="form-text">Masukkan nilai antara 1 - 100 Curie (Ci).</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Bahan Perisai (Shielding):</Form.Label>
                  <Form.Select 
                    value={shieldingMaterial} 
                    onChange={handleMaterialChange}
                    className="form-control"
                  >
                    <option value="lead">Timbal (Lead)</option>
                    <option value="concrete">Beton (Concrete)</option>
                    <option value="glass">Kaca (Glass)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Tebal Perisai (cm):</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={shieldingThickness} 
                    onChange={(e) => setShieldingThickness(parseFloat(e.target.value) || 0)} 
                    min={thicknessLimits.min} 
                    max={thicknessLimits.max} 
                    step="0.1"
                    style={getInputStyle(shieldingThickness, thicknessLimits)}
                    className="form-control"
                  />
                  <Form.Text className="form-text">Masukkan nilai antara 0,1 - 50 cm.</Form.Text>
                </Form.Group>

                <div className="text-center mt-4">
                    <div style={{ marginBottom: '15px' }}>
                      <button 
                        type="button" 
                        onClick={handleStart} 
                        disabled={!isFormValid} 
                        className="btn1 rounded-5"
                        style={{ marginRight: '10px' }}
                      >
                          Mulai Misi (Original)
                      </button>
                      <button 
                        type="button" 
                        onClick={handleStartOOP} 
                        disabled={!isFormValid} 
                        className="btn1 rounded-5"
                        style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                      >
                          🚀 Mulai Misi (OOP Enhanced)
                      </button>
                    </div>
                    <small style={{ color: '#666', fontSize: '0.8rem' }}>
                      OOP Enhanced: Arsitektur berorientasi objek dengan maintainability dan extensibility yang lebih baik
                    </small>
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