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

  const handleStart = () => {
    if (!isFormValid) return;
    const setupData = {
      sourceType,
      initialActivity,
      shieldingMaterial,
      shieldingThickness
    };
    navigate('/game', { state: { setupData } });
  };

  const getInputStyle = (value, limits) => ({
    borderColor: (value >= limits.min && value <= limits.max) ? '' : 'red',
    boxShadow: (value >= limits.min && value <= limits.max) ? '' : '0 0 0 0.25rem rgba(255, 0, 0, 0.25)'
  });

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: 'flex', alignItems: 'center' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold", marginBottom: '30px' }}>Pengaturan Misi Simulasi</h1>
              <div style={{textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: 'white'}}>
                <h4 style={{color: 'white'}}>Misi Anda:</h4>
                <p>Anda ditugaskan untuk melakukan survei radiasi di sebuah fasilitas. Tugas utama Anda adalah <strong>mengukur laju dosis</strong> di lokasi yang telah ditentukan (ditandai dengan kotak khusus dalam simulasi). Gunakan pengetahuan dari materi pembekalan untuk menjaga dosis total yang Anda terima serendah mungkin.</p>
                <p>Atur parameter simulasi di bawah ini untuk memulai.</p>
              </div>

              <Form className="mt-4" style={{textAlign: 'left'}}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold', color: 'white'}}>Sumber Radiasi Gamma:</Form.Label>
                  <Col sm={8}>
                    <Form.Select value={sourceType} onChange={handleSourceChange}>
                      <option value="cs-137">Cesium-137 (Cs-137)</option>
                      <option value="Co-60">Cobalt-60 (Co-60)</option>
                      <option value="Na-22">Sodium-22 (Na-22)</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold', color: 'white'}}>Aktivitas Awal (Ci):</Form.Label>
                  <Col sm={8}>
                    <Form.Control 
                      type="number" 
                      value={initialActivity} 
                      onChange={(e) => setInitialActivity(parseFloat(e.target.value) || 0)} 
                      min={activityLimits.min} 
                      max={activityLimits.max} 
                      style={getInputStyle(initialActivity, activityLimits)}
                    />
                    <Form.Text style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Masukkan nilai antara 1 - 100 Curie (Ci).</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold', color: 'white'}}>Bahan Perisai (Shielding):</Form.Label>
                  <Col sm={8}>
                    <Form.Select value={shieldingMaterial} onChange={handleMaterialChange}>
                      <option value="lead">Timbal (Lead)</option>
                      <option value="concrete">Beton (Concrete)</option>
                      <option value="glass">Kaca (Glass)</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold', color: 'white'}}>Tebal Perisai (cm):</Form.Label>
                  <Col sm={8}>
                    <Form.Control 
                      type="number" 
                      value={shieldingThickness} 
                      onChange={(e) => setShieldingThickness(parseFloat(e.target.value) || 0)} 
                      min={thicknessLimits.min} 
                      max={thicknessLimits.max} 
                      step="0.1"
                      style={getInputStyle(shieldingThickness, thicknessLimits)}
                    />
                     <Form.Text style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Masukkan nilai antara 0,1 - 50 cm.</Form.Text>
                  </Col>
                </Form.Group>

                <div className="text-center mt-5">
                    <button type="button" onClick={handleStart} disabled={!isFormValid} className="btn1 rounded-5" style={{ padding: "15px 50px" }}>
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