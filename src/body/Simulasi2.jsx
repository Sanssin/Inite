import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Kamus Koefisien Atenuasi Linier (mu) dalam cm^-1 
// Digunakan untuk rumus fisika: I = I0 * e^(-mu * x)
const muValues = {
  'cs-137': { lead: 1.25, concrete: 0.18, glass: 0.20, steel: 0.58 },
  'co-60': { lead: 0.65, concrete: 0.13, glass: 0.14, steel: 0.44 },
  'na-22': { lead: 0.70, concrete: 0.14, glass: 0.15, steel: 0.46 },
  'am-241': { lead: 60.0, concrete: 1.50, glass: 2.00, steel: 10.0 },
  'u-235': { lead: 2.50, concrete: 0.30, glass: 0.40, steel: 1.10 },
  'th-232': { lead: 1.50, concrete: 0.20, glass: 0.30, steel: 0.70 },
  'pu-239': { lead: 50.0, concrete: 1.20, glass: 1.80, steel: 8.00 },
  'i-131': { lead: 2.20, concrete: 0.28, glass: 0.35, steel: 1.00 },
};

const Simulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tangkap data dari SetupSim2.jsx
  const setupData = location.state?.setupData || {
    mode: 'simulasi',
    sourceType: 'cs-137',
    initialActivity: 10,
    shieldingMaterial: 'lead',
    shieldingThickness: 1
  };

  // State untuk kontrol eksperimen langsung di layar
  const [liveActivity, setLiveActivity] = useState(setupData.initialActivity);
  const [liveThickness, setLiveThickness] = useState(setupData.shieldingThickness);
  
  // State untuk menyimpan hasil perhitungan
  const [finalActivity, setFinalActivity] = useState(0);
  const [transmissionPercentage, setTransmissionPercentage] = useState(100);

  // Otak Mesin Fisika: Berjalan otomatis setiap kali slider digeser
  useEffect(() => {
    // 1. Cari nilai koefisien (mu) berdasarkan material dan isotop
    const mu = muValues[setupData.sourceType]?.[setupData.shieldingMaterial] || 0.5;
    
    // 2. Hitung atenuasi dengan rumus Beer-Lambert
    const transmissionFactor = Math.exp(-mu * liveThickness);
    const calculatedFinal = liveActivity * transmissionFactor;
    
    // 3. Simpan hasil untuk ditampilkan di layar
    setFinalActivity(calculatedFinal);
    setTransmissionPercentage(transmissionFactor * 100);
  }, [liveActivity, liveThickness, setupData.sourceType, setupData.shieldingMaterial]);

  // Penentu warna bar keselamatan
  const getProgressBarVariant = (percentage) => {
    if (percentage <= 20) return "success"; // Aman (Hijau)
    if (percentage <= 50) return "warning"; // Awas (Kuning)
    return "danger"; // Bahaya (Merah)
  };

  // Warna khusus untuk masing-masing material perisai
  const materialColors = {
    lead: '#2c3e50',      // Abu-abu gelap (Timbal)
    concrete: '#95a5a6',  // Abu-abu terang (Beton)
    steel: '#7f8c8d',     // Metalik (Baja)
    glass: 'rgba(52, 152, 219, 0.4)' // Biru transparan (Kaca)
  };

  return (
    <div className="Simulasi" style={{ minHeight: '100vh', paddingBottom: '50px', backgroundColor: '#0a0a0a', color: '#e6e6e6', fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        
        {/* HEADER */}
        <div style={{ paddingTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="nusa" style={{ color: '#cca60b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Dasbor Eksperimen Shielding
          </h1>
          <p className="ket">Mode Laboratorium Eksterna</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={11}>
            <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', border: '1px solid #fd7e14', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <Card.Body className="p-4 p-md-5">
                
                {/* 1. VISUALISASI 3 BLOK (SUMBER -> PERISAI -> DETEKTOR) */}
                <Row className="align-items-stretch text-center mb-5 justify-content-center">
                  
                  {/* Blok Sumber Radiasi */}
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#dc3545', fontWeight: 'bold' }}>SUMBER</h5>
                      <div style={{ margin: '20px auto', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px #dc3545', fontSize: '2rem' }}>☢️</div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{setupData.sourceType.toUpperCase()}</h4>
                      <small style={{ color: '#aaa' }}>Aktivitas: {liveActivity} Bq</small>
                    </div>
                  </Col>

                  <Col md={1} className="d-none d-md-flex align-items-center justify-content-center">
                    <span style={{ fontSize: '2rem', color: '#dc3545', animation: 'pulse 1.5s infinite' }}>⚡</span>
                  </Col>

                  {/* Blok Perisai Radiasi */}
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(253, 126, 20, 0.1)', border: '2px solid #fd7e14', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#fd7e14', fontWeight: 'bold' }}>PERISAI</h5>
                      <div style={{ margin: '20px 0', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Ketebalan kotak warna ini akan melar menyesuaikan nilai Ketebalan */}
                        <div style={{ 
                          width: `${Math.min(40 + liveThickness * 2, 100)}px`, 
                          height: '60px', 
                          backgroundColor: materialColors[setupData.shieldingMaterial] || '#7f8c8d',
                          borderRadius: '6px',
                          border: '2px solid #fff',
                          transition: 'width 0.2s ease'
                        }} />
                      </div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{t(`common:materials.${setupData.shieldingMaterial}`)}</h4>
                      <small style={{ color: '#aaa' }}>Tebal: {liveThickness} cm</small>
                    </div>
                  </Col>

                  <Col md={1} className="d-none d-md-flex align-items-center justify-content-center">
                    <span style={{ fontSize: '2rem', color: transmissionPercentage > 20 ? '#ffc107' : '#28a745' }}>👉</span>
                  </Col>

                  {/* Blok Detektor */}
                  <Col md={3} className="d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#28a745', fontWeight: 'bold' }}>DETEKTOR</h5>
                      <div style={{ margin: '20px 0', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📟</div>
                      <h3 style={{ color: '#fff', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
                        {finalActivity.toFixed(4)}
                      </h3>
                      <small style={{ color: '#aaa' }}>Bq (Intensitas Lolos)</small>
                    </div>
                  </Col>

                </Row>

                {/* 2. SLIDER PENGATURAN (Bisa digeser-geser langsung) */}
                <Card className="mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Card.Body>
                    <h5 style={{ color: '#cca60b', marginBottom: '20px' }}>🎛️ Manipulasi Parameter Laboratorium</h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Ubah Aktivitas Awal (I₀): <strong style={{ color: '#fff' }}>{liveActivity} Bq</strong></Form.Label>
                        <Form.Range 
                          min={1} max={1000} 
                          value={liveActivity} 
                          onChange={(e) => setLiveActivity(Number(e.target.value))} 
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Ubah Ketebalan Pelindung (x): <strong style={{ color: '#fff' }}>{liveThickness} cm</strong></Form.Label>
                        <Form.Range 
                          min={0.1} max={100} step={0.1}
                          value={liveThickness} 
                          onChange={(e) => setLiveThickness(Number(e.target.value))} 
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* 3. BAR INDIKATOR STATUS BAHAYA RADIASI */}
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Persentase Kebocoran Fluks Radiasi:</h5>
                    <h4 style={{ fontWeight: 'bold', color: '#fff' }}>{transmissionPercentage.toFixed(2)}%</h4>
                  </div>
                  <ProgressBar 
                    now={transmissionPercentage} 
                    variant={getProgressBarVariant(transmissionPercentage)}
                    style={{ height: '30px', borderRadius: '8px', backgroundColor: '#222' }}
                  />
                  <div className="d-flex justify-content-between mt-2" style={{ color: '#aaa', fontSize: '0.85rem' }}>
                    <span>0% (Teratenuasi Sempurna / Aman)</span>
                    <span>100% (Tanpa Pelemahan / Bahaya)</span>
                  </div>
                </div>

                {/* 4. TOMBOL KELUAR */}
                <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate('/select-mode')} className="btn2 rounded-5">
                    Ganti Mode Simulasi
                  </button>
                  <button onClick={() => navigate('/')} className="btn1 rounded-5">
                    Keluar Ke Menu Utama
                  </button>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Simulasi2;
