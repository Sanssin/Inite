import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import rektaDatar from '../assets/rekta datar.png';
import rektaSenang from '../assets/rekta senang.png';
import rektaSedih from '../assets/rekta sedih.png';
import rektaTegang from '../assets/rekta tegang.png';
import rektaPingsan from '../assets/rekta pingsan.png';

// 1. Kamus Koefisien Atenuasi Linier (mu) dalam cm^-1 
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

// 2. Konstanta Laju Dosis Gamma (Gamma) dalam (µSv/h) / MBq pada jarak 1 meter
const gammaConstants = {
  'cs-137': 0.089,
  'co-60': 0.35,
  'na-22': 0.32,
  'am-241': 0.004,
  'u-235': 0.02,
  'th-232': 0.04,
  'pu-239': 0.001,
  'i-131': 0.059,
};

// 3. Acuan Regulasi: Perka BAPETEN No. 4 Tahun 2013
const REGULASI_BAPETEN = {
  pekerja: 10.0,    // 20 mSv/tahun -> ~10 µSv/jam
  masyarakat: 0.114 // 1 mSv/tahun  -> ~0.114 µSv/jam
};

const STATUS_AVATAR = 'pekerja'; 
const NBD_LIMIT = REGULASI_BAPETEN[STATUS_AVATAR]; 

const Simulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tangkap data dengan fallback aman
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

  // State alur simulasi
  const [simState, setSimState] = useState('idle'); // 'idle' | 'running' | 'finished'
  const [currentDoseRate, setCurrentDoseRate] = useState(0);
  const [simProgress, setSimProgress] = useState(0);

  // OPTIMASI FISIKA: Menghitung target langsung menggunakan useMemo (menghindari useEffect pasif)
  const physicsResults = useMemo(() => {
    const activityMBq = setupData.initialActivity * 37000;
    const gamma = gammaConstants[setupData.sourceType] || 0.1;
    const initialDoseRate1m = activityMBq * gamma;

    const mu = muValues[setupData.sourceType]?.[setupData.shieldingMaterial] || 0.5;
    const transmissionFactor = Math.exp(-mu * setupData.shieldingThickness);
    const doseRateAfterShielding = initialDoseRate1m * transmissionFactor;
    
    const distanceFactor = Math.pow(setupData.distance, 2);
    const finalCalculatedDoseRate = doseRateAfterShielding / distanceFactor;
    
    const unshieldedDoseAtDistance = initialDoseRate1m / distanceFactor;
    const transmissionPercentage = unshieldedDoseAtDistance > 0 
      ? (finalCalculatedDoseRate / unshieldedDoseAtDistance) * 100 
      : 0;

    return {
      targetDoseRate: finalCalculatedDoseRate,
      transmissionPercentage
    };
  }, [setupData]);

  const { targetDoseRate, transmissionPercentage } = physicsResults;

  // PERBAIKAN LOGIKA WAKTU: Pembersihan interval yang super aman dari memory leak
  useEffect(() => {
    if (simState !== 'running') return;

    const duration = 4000; 
    const intervalTime = 50; 
    const totalSteps = duration / intervalTime;
    const doseIncrement = targetDoseRate / totalSteps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setCurrentDoseRate((prev) => {
        const nextDose = prev + doseIncrement;
        return nextDose >= targetDoseRate ? targetDoseRate : nextDose;
      });
      setSimProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        setSimState('finished');
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [simState, targetDoseRate]);

  const handleStartSimulation = () => {
    setCurrentDoseRate(0);
    setSimProgress(0);
    setSimState('running');
  };

  const handleGoToResults = () => {
    navigate('/hasil-simulasi2', { 
      state: { 
        finalDoseRate: targetDoseRate, 
        percentage: transmissionPercentage,
        setupData: setupData 
      } 
    });
  };

  // OPTIMASI UI: Wajah avatar ditentukan menggunakan useMemo agar tidak merender ulang gambar mentah
  const avatarImage = useMemo(() => {
    if (simState === 'idle') return rektaDatar;
    if (currentDoseRate > NBD_LIMIT * 5) return rektaPingsan;
    if (currentDoseRate > NBD_LIMIT) return rektaSedih;
    if (currentDoseRate > NBD_LIMIT * 0.5) return rektaTegang;
    return rektaSenang;
  }, [simState, currentDoseRate]);

  const materialColors = {
    lead: '#2c3e50',
    concrete: '#95a5a6',
    steel: '#7f8c8d',
    glass: 'rgba(52, 152, 219, 0.4)'
  };

  return (
    <div className="Simulasi" style={{ minHeight: '100vh', paddingBottom: '50px', backgroundColor: '#0a0a0a', color: '#e6e6e6', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* STYLE INJEKSI: Menghidupkan animasi denyut petir (pulse) */}
      <style>{`
        @keyframes radiationPulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 8px #dc3545); }
          100% { transform: scale(1); opacity: 0.3; }
        }
        .pulsing-energy {
          animation: radiationPulse 0.6s infinite ease-in-out;
        }
      `}</style>

      <Container>
        {/* HEADER */}
        <div style={{ paddingTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ color: '#cca60b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Dasbor Eksperimen Shielding
          </h1>
          <p style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            Status Sistem: {simState === 'running' ? <span style={{color: '#dc3545', fontWeight:'bold'}}>EKSEKUSI BERJALAN...</span> : simState === 'finished' ? <span style={{color: '#28a745', fontWeight:'bold'}}>SELESAI</span> : 'STANDBY'}
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={12}>
            <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', border: simState === 'running' ? '1px solid #dc3545' : '1px solid #cca60b', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', transition: 'border 0.3s ease' }}>
              <Card.Body className="p-4 p-md-5">
                
                {/* 1. VISUALISASI BLOK */}
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
                    <span 
                      className={simState === 'running' ? 'pulsing-energy' : ''} 
                      style={{ fontSize: '2.3rem', color: '#dc3545', opacity: simState === 'running' ? 1 : 0.2, transition: 'all 0.3s' }}
                    >
                      ⚡
                    </span>
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

                  {/* Info Jarak & Gelombang Radiasi 2 */}
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
                      
                      <div style={{ margin: '10px 0' }}>
                        <img 
                          src={avatarImage} 
                          alt="Status Avatar Rekta" 
                          style={{ 
                            width: '120px', 
                            height: '120px', 
                            objectFit: 'contain', 
                            transition: 'transform 0.2s ease, filter 0.3s ease',
                            filter: currentDoseRate > NBD_LIMIT ? 'drop-shadow(0px 4px 15px rgba(220,53,69,0.8))' : 'none'
                          }} 
                        />
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

                {/* 2. PROGRESS BAR */}
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

                {/* 3. KONTROL UTAMA */}
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
                      <button onClick={() => { setSimState('idle'); setCurrentDoseRate(0); setSimProgress(0); }} className="btn btn-secondary btn-lg rounded-5 px-4">
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

export default <Simulasi3></Simulasi3>;
