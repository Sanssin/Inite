import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import rektaDatar from '../assets/rekta datar.png';
import rektaSenang from '../assets/rekta senang.png';
import rektaSedih from '../assets/rekta sedih.png';
import rektaTegang from '../assets/rekta tegang.png';
import rektaPingsan from '../assets/rekta pingsan.png';
import { backendDataService } from '../services/BackendDataService';
import { APIClient } from '../classes/APIClient';


// 1. Acuan Regulasi: Perka BAPETEN No. 4 Tahun 2013
const REGULASI_BAPETEN = {
  pekerja: 10.0,    // 20 mSv/tahun -> ~10 µSv/jam
  masyarakat: 0.114 // 1 mSv/tahun  -> ~0.114 µSv/jam
};

// Tentukan target avatar
const STATUS_AVATAR = 'pekerja'; 
const NBD_LIMIT = REGULASI_BAPETEN[STATUS_AVATAR]; 

const Simulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tangkap data dari SetupSim2.jsx
  const setupData = useMemo(() => {
   return location.state?.setupData || {
    mode: 'simulasi',
    sourceType: 'cs-137',
    initialActivity: 10,
    shieldingMaterial: 'lead',
    shieldingThickness: 0.1,
    distance: 1 
  };
}, [location.state]);
  // State untuk alur simulasi
  const [simState, setSimState] = useState('idle'); // 'idle' | 'running' | 'finished'
  const [currentDoseRate, setCurrentDoseRate] = useState(0);
  const [simProgress, setSimProgress] = useState(0);
  
  // State untuk target hasil perhitungan akhir
  const [targetDoseRate, setTargetDoseRate] = useState(0);
  const [transmissionPercentage, setTransmissionPercentage] = useState(0);

  // Klien API untuk perhitungan presisi di backend
  const apiClientRef = useRef(new APIClient());

  // MESIN FISIKA: Hitung Hasil Akhir sesaat setelah halaman dimuat
  useEffect(() => {
    const calculateFinalDose = async () => {
      let finalCalculatedDoseRate = null;
      let unshieldedDoseAtDistance = null;

      // Ambil detail isotop fallback terlebih dahulu untuk perhitungan unshielded & fallback
      const fallbackIsotopeData = backendDataService.getFallbackIsotopeData();
      const isotope = fallbackIsotopeData[setupData.sourceType] || fallbackIsotopeData['cs-137'];
      
      // Hitung aktivitas saat ini dengan peluruhan (decay)
      const today = new Date();
      const prodDate = new Date(isotope.production_date);
      const timeElapsedYears = (today - prodDate) / (1000 * 60 * 60 * 24 * 365.25);
      const currentActivity = setupData.initialActivity * Math.pow(0.5, timeElapsedYears / isotope.half_life_years);
      
      // unshielded dose rate at 1m in µSv/hr (1 rem = 10,000 µSv, 1 Ci = 1,000,000 µCi)
      const initialDoseRate1m = (isotope.gamma_constant * currentActivity * 10000) / 1000000.0;
      unshieldedDoseAtDistance = initialDoseRate1m / Math.pow(setupData.distance, 2);

      try {
        const apiClient = apiClientRef.current;
        const result = await apiClient.calculateDose(
          setupData.distance,
          setupData.sourceType,
          setupData.initialActivity,
          setupData.shieldingMaterial,
          setupData.shieldingThickness
        );

        if (result.isSuccess && result.data && !result.data.error) {
          finalCalculatedDoseRate = result.data.level;
        }
      } catch (error) {
        console.warn("Backend calculation failed in Simulasi2, using fallback:", error.message);
      }

      // Jika backend gagal atau offline, gunakan kalkulasi fallback NIST presisi tinggi
      if (finalCalculatedDoseRate === null) {
        const fallbackMaterialData = backendDataService.getFallbackMaterialData(setupData.sourceType);
        const keyMapping = {
          lead: 'timbal',
          concrete: 'beton',
          glass: 'kaca',
          steel: 'baja'
        };
        const fallbackKey = keyMapping[setupData.shieldingMaterial.toLowerCase()] || setupData.shieldingMaterial.toLowerCase();
        const material = fallbackMaterialData[fallbackKey] || fallbackMaterialData['timbal'];
        
        const mu = material.attenuation_coefficient || 1.0;
        const transmissionFactor = Math.exp(-mu * setupData.shieldingThickness);
        const doseRateAfterShielding = initialDoseRate1m * transmissionFactor;
        
        finalCalculatedDoseRate = doseRateAfterShielding / Math.pow(setupData.distance, 2);
      }

      setTargetDoseRate(finalCalculatedDoseRate);
      
      if (unshieldedDoseAtDistance > 0) {
        setTransmissionPercentage((finalCalculatedDoseRate / unshieldedDoseAtDistance) * 100);
      } else {
        setTransmissionPercentage(0);
      }
    };

    calculateFinalDose();
  }, [setupData]);

  // LOGIKA WAKTU: Mesin Simulasi (Timer & Akumulasi Dosis)
  useEffect(() => {
    let interval;
    if (simState === 'running') {
      const duration = 4000; // Simulasi animasi berjalan selama 4 detik
      const intervalTime = 50; 
      const totalSteps = duration / intervalTime;
      const doseIncrement = targetDoseRate / totalSteps;
      let currentStep = 0;

      interval = setInterval(() => {
        currentStep++;
        setCurrentDoseRate((prev) => Math.min(prev + doseIncrement, targetDoseRate));
        setSimProgress((currentStep / totalSteps) * 100);

        if (currentStep >= totalSteps) {
          clearInterval(interval);
          setSimState('finished');
        }
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [simState, targetDoseRate]);

  // Handler Tombol Navigasi
  const handleStartSimulation = () => {
    setSimState('running');
    setCurrentDoseRate(0);
    setSimProgress(0);
  };

  const handleGoToResults = () => {
    navigate('/hasil-simulasi2', { // mengarah ke /hasil-simulasi2
      state: { 
        finalDoseRate: targetDoseRate, 
        percentage: transmissionPercentage,
        setupData: setupData 
      } 
    });
  };

  // LOGIKA UI: Reaksi Wajah Avatar Berdasarkan NBD BAPETEN
  const getAvatarFace = () => {
    let currentImage = rektaDatar; // Default

    if (simState === 'idle') {
      currentImage = rektaDatar;
    } else if (currentDoseRate > NBD_LIMIT * 5) {
      currentImage = rektaPingsan;
    } else if (currentDoseRate > NBD_LIMIT) {
      currentImage = rektaSedih;
    } else if (currentDoseRate > NBD_LIMIT * 0.5) {
      currentImage = rektaTegang;
    } else {
      currentImage = rektaSenang;
    }

    return (
      <img 
        src={currentImage} 
        alt="Status Avatar Rekta" 
        style={{ 
          width: '120px', 
          height: '120px', 
          objectFit: 'contain', 
          transition: 'all 0.3s ease',
          // Menambahkan efek glow merah jika melewati NBD
          filter: currentDoseRate > NBD_LIMIT ? 'drop-shadow(0px 4px 15px rgba(220,53,69,0.8))' : 'none'
        }} 
      />
    );
  };

  // Kamus warna perisai
  const materialColors = {
    lead: '#2c3e50',
    concrete: '#95a5a6',
    steel: '#7f8c8d',
    glass: 'rgba(52, 152, 219, 0.4)'
  };

  return (
    <div className="Simulasi" style={{ minHeight: '100vh', paddingBottom: '50px', backgroundColor: '#0a0a0a', color: '#e6e6e6', fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        
        {/* HEADER */}
        <div style={{ paddingTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="nusa" style={{ color: '#cca60b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Dasbor Eksperimen Shielding
          </h1>
          <p className="ket" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            Status Sistem: {simState === 'running' ? <span style={{color: '#dc3545', fontWeight:'bold'}}>EKSEKUSI BERJALAN...</span> : simState === 'finished' ? <span style={{color: '#28a745', fontWeight:'bold'}}>SELESAI</span> : 'STANDBY'}
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={12}>
            <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', border: simState === 'running' ? '1px solid #dc3545' : '1px solid #cca60b', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', transition: 'border 0.3s ease' }}>
              <Card.Body className="p-4 p-md-5">
                
                {/* 1. VISUALISASI BLOK (SUMBER -> PERISAI -> JARAK -> DETEKTOR) */}
                <Row className="align-items-stretch text-center mb-5 justify-content-center">
                  
                  {/* Blok Sumber */}
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#dc3545', fontWeight: 'bold' }}>SUMBER RADIASI</h5>
                      <div style={{ margin: '20px auto', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: simState === 'running' ? '0 0 25px #dc3545' : '0 0 10px #dc3545', fontSize: '2rem', transition: 'box-shadow 0.3s ease' }}>☢️</div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{setupData.sourceType.toUpperCase()}</h4>
                      <small style={{ color: '#aaa' }}>I₀: {setupData.initialActivity} Ci</small>
                    </div>
                  </Col>

                  {/* Animasi Gelombang Radiasi 1 */}
                  <Col md={1} className="d-none d-md-flex align-items-center justify-content-center">
                    <span style={{ fontSize: '2rem', color: '#dc3545', opacity: simState === 'running' ? 1 : 0.2, animation: simState === 'running' ? 'pulse 0.5s infinite' : 'none' }}>⚡</span>
                  </Col>

                  {/* Blok Perisai */}
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(253, 126, 20, 0.1)', border: '2px solid #fd7e14', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#fd7e14', fontWeight: 'bold' }}>PERISAI</h5>
                      <div style={{ margin: '20px 0', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ 
                          width: `${Math.min(40 + setupData.shieldingThickness * 2, 100)}px`, 
                          height: '60px', 
                          backgroundColor: materialColors[setupData.shieldingMaterial] || '#7f8c8d',
                          borderRadius: '6px', border: '2px solid #fff'
                        }} />
                      </div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{t(`common:materials.${setupData.shieldingMaterial}`)}</h4>
                      <small style={{ color: '#aaa' }}>x: {setupData.shieldingThickness} cm</small>
                    </div>
                  </Col>

                  {/* Info Jarak & Gelombang Radiasi 2 (Atenuasi) */}
                  <Col md={2} className="d-none d-md-flex flex-column align-items-center justify-content-center">
                    <span style={{ fontSize: '1.5rem', color: transmissionPercentage > 20 ? '#ffc107' : '#28a745', opacity: simState === 'running' ? 1 : 0.2 }}>〰️〰️👉</span>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', marginTop: '10px' }}>
                      <small style={{ color: '#cca60b', fontWeight: 'bold' }}>Jarak: {setupData.distance} m</small>
                    </div>
                  </Col>

                  {/* Blok Detektor / Avatar */}
                  <Col md={3} className="d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: currentDoseRate > NBD_LIMIT ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.1)', border: `2px solid ${currentDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745'}`, borderRadius: '12px', height: '100%', transition: 'all 0.3s ease' }}>
                      <h5 style={{ color: currentDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>DOSIMETER PERSONAL</h5>
                      
                      {/* Pemanggilan tag img dari fungsi getAvatarFace */}
                      <div style={{ margin: '10px 0', transition: 'all 0.3s ease' }}>
                        {getAvatarFace()}
                      </div>
                      
                      <h4 style={{ color: currentDoseRate > NBD_LIMIT ? '#dc3545' : '#fff', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
                        {currentDoseRate.toFixed(4)}
                      </h4>
                      <small style={{ color: '#aaa' }}>µSv/jam (Laju Dosis)</small>
                      
                      {simState === 'finished' && (
                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: currentDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                          {currentDoseRate > NBD_LIMIT ? "⚠️ MELEBIHI NBD BAPETEN" : "✅ AMAN SESUAI BAPETEN"}
                        </div>
                      )}
                    </div>
                  </Col>

                </Row>

                {/* 2. PROGRESS BAR EKSKUSI */}
                <div className="mt-4 mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 style={{ color: '#aaa' }}>Progres Paparan Radiasi</h5>
                    <h5 style={{ fontWeight: 'bold', color: '#fff' }}>{Math.round(simProgress)}%</h5>
                  </div>
                  <ProgressBar 
                    now={simProgress} 
                    variant={simState === 'finished' ? "success" : "warning"}
                    animated={simState === 'running'}
                    style={{ height: '15px', borderRadius: '8px', backgroundColor: '#222' }}
                  />
                </div>

                {/* 3. KONTROL UTAMA & NAVIGASI */}
                <div className="text-center mt-4">
                  {simState === 'idle' && (
                    <button onClick={handleStartSimulation} className="btn btn-danger btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', letterSpacing: '2px', boxShadow: '0 4px 15px rgba(220,53,69,0.5)' }}>
                      🔴 MULAI PAPARAN RADIASI
                    </button>
                  )}

                  {simState === 'running' && (
                    <button disabled className="btn btn-outline-danger btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', cursor: 'not-allowed' }}>
                      MENSIMULASIKAN...
                    </button>
                  )}

                  {simState === 'finished' && (
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button onClick={() => setSimState('idle')} className="btn btn-secondary btn-lg rounded-5 px-4">
                        Ulangi Adegan
                      </button>
                      <button onClick={handleGoToResults} className="btn btn-success btn-lg rounded-5 px-5" style={{ fontWeight: 'bold', boxShadow: '0 4px 15px rgba(40,167,69,0.5)' }}>
                        Lihat Hasil Survei ➡️
                      </button>
                    </div>
                  )}
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
