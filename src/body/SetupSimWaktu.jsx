import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form } from "react-bootstrap";

import DynamicSourceCard from '../components/DynamicSourceCard';
import { backendDataService } from '../services/BackendDataService';
import '../components/SetupCards.css';

const parseInputNumber = (inputValue) => {
  const normalizedValue = inputValue.trim();
  if (normalizedValue === '') return null;
  const numericValue = Number(normalizedValue);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const isValueWithinLimits = (value, limits) => value !== null && value >= limits.min && value <= limits.max;

const SetupSimulasiWaktu = () => {
  const navigate = useNavigate();
  
  // State Utama Kendali Simulasi Waktu
  const [sourceType, setSourceType] = useState('cs-137');
  const [initialActivityInput, setInitialActivityInput] = useState('10');
  const [distanceInput, setDistanceInput] = useState('1'); 
  const [durationInput, setDurationInput] = useState('20'); // State Baru untuk Batas Waktu Eksperimen

  const [isotopeDetails, setIsotopeDetails] = useState(null);
  const [availableIsotopes, setAvailableIsotopes] = useState([
    'cs-137', 'co-60', 'na-22', 'am-241', 'u-235', 'th-232', 'pu-239', 'i-131'
  ]);
  const [, setBackendStatus] = useState('loading'); 

  // Batasan parameter fisis uji (Limits)
  const activityLimits = { min: 1, max: 1000 };
  const distanceLimits = { min: 0.1, max: 500 }; 
  const durationLimits = { min: 1, max: 3600 }; // Batas durasi dari 1 detik hingga 1 jam

  // Parsing data input string ke numerik fisis
  const parsedInitialActivity = parseInputNumber(initialActivityInput);
  const parsedDistance = parseInputNumber(distanceInput); 
  const parsedDuration = parseInputNumber(durationInput);

  // Validasi kecocokan ambang batas aman instrumen
  const isActivityValid = isValueWithinLimits(parsedInitialActivity, activityLimits);
  const isDistanceValid = isValueWithinLimits(parsedDistance, distanceLimits); 
  const isDurationValid = isValueWithinLimits(parsedDuration, durationLimits);
  
  // Form dinyatakan valid jika ketiga parameter utama terpenuhi (Tanpa Shielding)
  const isFormValid = isActivityValid && isDistanceValid && isDurationValid;

  // Efek siklus hidup komponen untuk memuat data isotop laboratorium dari backend
  useEffect(() => { 
    loadBackendIsotopeData(); 
  }, []);

  const loadBackendIsotopeData = async () => {
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
    } catch (error) {
      console.error('Failed to load isotope data for time simulation:', error);
      setBackendStatus('fallback');
      setIsotopeDetails(backendDataService.getFallbackIsotopeData());
    }
  };

  const handleSourceCardClick = (newSource) => {
    setSourceType(newSource);
  };

  // Pengiriman paket parameter setup menuju halaman visualisasi running dashboard
  const handleStart = () => {
    if (!isFormValid) return;

    const setupData = {
      mode: 'waktu-radiasi', // Identifikasi mode menu baru
      sourceType,
      initialActivity: parsedInitialActivity,
      distance: parsedDistance,
      maxDuration: parsedDuration
    };

    // Navigasi dialihkan menuju rute dasbor simulasi waktu berjalan
    navigate('/simulations/exposure/running', { state: { setupData } });
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
              <h1 style={{ color: "#28a745", fontWeight: "bold" }}>Simulasi Waktu Radiasi</h1>
              
              <div style={{ textAlign: 'justify', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: '#e6e6e6', marginTop: '20px' }}>
                <h4 style={{ color: '#28a745', textAlign: 'center', marginBottom: '15px' }}>Prinsip Paparan Berwaktu (Stay Time)</h4>
                <p>Pada menu simulasi ini, fokus utama pengujian difokuskan pada hubungan linear antara waktu paparan terhadap akumulasi dosis serap yang diterima oleh objek dalam medan radiasi konstan.</p>
                <p><strong>Hukum Proteksi Radiasi:</strong> Semakin lama Anda berada di dekat sumber radioaktif, maka akumulasi dosis akan meningkat secara linear ($E = H \times t$). Atur batasan waktu stopwatch untuk mencari batas aman zona kerja.</p>
              </div>

              <Form className="mt-4" style={{ textAlign: 'left' }}>
                
                {/* Bagian 1: Pemilihan Kartu Sumber Radiasi */}
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

                {/* Bagian 2: Input Kuantitas Aktivitas Awal */}
                <Form.Group className="mb-4 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2" style={{ color: '#fff' }}>Aktivitas Awal (Ci)</Form.Label>
                  <Form.Control
                    type="number"
                    value={initialActivityInput}
                    onChange={(e) => setInitialActivityInput(e.target.value)}
                    min={activityLimits.min}
                    max={activityLimits.max}
                    style={{ ...getInputStyle(isActivityValid), maxWidth: '200px', textAlign: 'center' }}
                  />
                  <Form.Text className="text-muted mt-2">
                    Masukkan nilai aktivitas antara 1 - 1000 Ci
                  </Form.Text>
                </Form.Group>

                {/* Bagian 3: Input Parameter Jarak Geometris */}
                <Form.Group className="mb-4 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2" style={{ color: '#fff' }}>Jarak dari Sumber Radiasi (m)</Form.Label>
                  <Form.Control
                    type="number"
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value)}
                    min={distanceLimits.min}
                    max={distanceLimits.max}
                    step="0.1"
                    style={{ ...getInputStyle(isDistanceValid), maxWidth: '200px', textAlign: 'center' }}
                  />
                  <Form.Text className="text-muted mt-2">
                    Masukkan jarak deteksi antara 0,1 - 500 m
                  </Form.Text>
                </Form.Group>

                {/* Bagian 4: Input Batasan Durasi Waktu Simulasi */}
                <Form.Group className="mb-4 d-flex flex-column align-items-center">
                  <Form.Label className="mb-2" style={{ color: '#fff' }}>Batas Durasi Paparan (Detik)</Form.Label>
                  <Form.Control
                    type="number"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    min={durationLimits.min}
                    max={durationLimits.max}
                    step="1"
                    style={{ ...getInputStyle(isDurationValid), maxWidth: '200px', textAlign: 'center' }}
                  />
                  <Form.Text className="text-muted mt-2">
                    Tentukan limit hitungan stopwatch otomatis (1 - 3600 detik)
                  </Form.Text>
                </Form.Group>

                {/* Navigasi Tombol Aksi */}
                <div className="text-center mt-5 d-flex justify-content-center gap-3 flex-wrap">
                  <button type="button" onClick={() => navigate('/simulations')} className="btn2 rounded-5">
                    Kembali ke Menu
                  </button>
                  <button 
                    type="button" 
                    onClick={handleStart} 
                    disabled={!isFormValid} 
                    className="btn1 rounded-5"
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                  >
                    Mulai Eksperimen Waktu!
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

export default SetupSimulasiWaktu;
