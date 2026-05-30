import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
// Import komponen dari Recharts untuk grafik neon interaktif
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import rektaDatar from '../assets/rekta datar.png';
import rektaSenang from '../assets/rekta senang.png';
import rektaSedih from '../assets/rekta sedih.png';
import rektaTegang from '../assets/rekta tegang.png';
import rektaPingsan from '../assets/rekta pingsan.png';

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

const sourceDescriptions = {
  'cs-137': {
    name: 'Cesium-137 (Cs-137)',
    desc: 'Isotop radioaktif buatan yang memancarkan radiasi Beta dan Gamma dengan waktu paruh asli sekitar 30.17 tahun. Dipercepat pada simulasi ini agar peluruhan terlihat fungsional.',
    energy: 'Sinar Gamma utama pada energi 0.662 MeV.',
    halfLifeSec: 4.0
  },
  'co-60': {
    name: 'Cobalt-60 (Co-60)',
    desc: 'Isotop pemancar Gamma energi tinggi dengan waktu paruh asli 5.27 tahun. Vital untuk radioterapi kanker dan sterilisasi industri.',
    energy: 'Dua puncak energi Gamma tajam pada 1.17 MeV dan 1.33 MeV.',
    halfLifeSec: 2.5
  },
  'na-22': {
    name: 'Natrium-22 (Na-22)',
    desc: 'Isotop pemancar positron (Beta+) dan Gamma dengan waktu paruh 2.6 tahun.',
    energy: 'Energi foton Gamma hasil penyerapan energi positron sebesar 1.275 MeV.',
    halfLifeSec: 3.0
  },
  'am-241': {
    name: 'Amerisium-241 (Am-241)',
    desc: 'Isotop hasil peluruhan Plutonium dengan waktu paruh asli 432 tahun.',
    energy: 'Foton Gamma energi rendah sebesar 59.5 keV.',
    halfLifeSec: 8.0
  },
  'u-235': {
    name: 'Uranium-235 (U-235)',
    desc: 'Isotop alami bersifat fisil. Komponen utama bahan bakar PLTN.',
    energy: 'Emisi Gamma bervariasi dengan spektrum utama di kisaran 185.7 keV.',
    halfLifeSec: 6.0
  },
  'th-232': {
    name: 'Torium-232 (Th-232)',
    desc: 'Isotop radioaktif alami kandidat bahan bakar nuklir masa depan yang meluruh sangat lambat.',
    energy: 'Peluruhan Gamma berantai didominasi oleh anak luruh Th-232.',
    halfLifeSec: 10.0
  },
  'pu-239': {
    name: 'Plutonium-239 (Pu-239)',
    desc: 'Isotop fisil buatan dengan waktu paruh asli 24.100 years. Digunakan sebagai bahan bakar breeder.',
    energy: 'Spektrum Gamma kompleks bercampur emisi partikel Alfa kuat.',
    halfLifeSec: 12.0
  },
  'i-131': {
    name: 'Iodium-131 (I-131)',
    desc: 'Isotop dengan waktu paruh pendek (8 hari) untuk ablasi kanker kelenjar tiroid.',
    energy: 'Foton Gamma dominan dipancarkan pada tingkat energi 364 keV.',
    halfLifeSec: 1.5 
  }
};

const REGULASI_BAPETEN = {
  pekerja: 10.0,
  masyarakat: 0.114
};

const STATUS_AVATAR = 'pekerja'; 
const NBD_LIMIT = REGULASI_BAPETEN[STATUS_AVATAR]; 
const TOTAL_DURATION = 8000; 

const Simulasi2 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const hasilRef = useRef(null); 
  const canvasRef = useRef(null); 

  useEffect(() => {
    const navbar = document.querySelector('nav') || document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = 'block';
    };
  }, []);

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

  const [simState, setSimState] = useState('idle'); 
  const [currentDoseRate, setCurrentDoseRate] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(setupData.initialActivity);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [showResults, setShowResults] = useState(false); 
  const [peakDoseRate, setPeakDoseRate] = useState(0); 
  
  const [chartData, setChartData] = useState([]);
  const particlesRef = useRef([]);

  const calculateDoseAtTime = (timeInSeconds) => {
    const sourceInfo = sourceDescriptions[setupData.sourceType] || { halfLifeSec: 5 };
    const halfLife = sourceInfo.halfLifeSec;
    
    const lambda = Math.log(2) / halfLife;
    const decayedActivityCi = setupData.initialActivity * Math.exp(-lambda * timeInSeconds);
    
    const activityMBq = decayedActivityCi * 37000;
    const gamma = gammaConstants[setupData.sourceType] || 0.1;
    const initialDoseRate1m = activityMBq * gamma;

    const mu = muValues[setupData.sourceType]?.[setupData.shieldingMaterial] || 0.5;
    const transmissionFactor = Math.exp(-mu * setupData.shieldingThickness);
    const doseRateAfterShielding = initialDoseRate1m * transmissionFactor;
    
    const distanceFactor = Math.pow(setupData.distance, 2);
    const finalCalculatedDoseRate = doseRateAfterShielding / distanceFactor;

    return {
      doseRate: finalCalculatedDoseRate,
      activityCi: decayedActivityCi
    };
  };

  useEffect(() => {
    const initialPhysic = calculateDoseAtTime(0);
    setCurrentDoseRate(initialPhysic.doseRate);
    setPeakDoseRate(initialPhysic.doseRate);
    setCurrentActivity(initialPhysic.activityCi);
    
    setChartData([{
      time: '0.0',
      'Aktivitas (Ci)': initialPhysic.activityCi,
      'Laju Dosis (µSv/h)': initialPhysic.doseRate
    }]);
  }, [setupData]);

  useEffect(() => {
    let interval;
    if (simState === 'running') {
      const intervalTime = 40; 
      const totalSteps = TOTAL_DURATION / intervalTime;
      let currentStep = 0;
      
      setChartData([]);

      interval = setInterval(() => {
        currentStep++;
        const currentSecondsElapsed = (currentStep * intervalTime) / 1000;
        setElapsedTime(currentSecondsElapsed);

        const statusFisis = calculateDoseAtTime(currentSecondsElapsed);
        setCurrentDoseRate(statusFisis.doseRate);
        setCurrentActivity(statusFisis.activityCi);

        if (currentStep % 4 === 0 || currentStep === totalSteps) {
          setChartData(prevData => [
            ...prevData,
            {
              time: currentSecondsElapsed.toFixed(1) + 's',
              'Aktivitas (Ci)': parseFloat(statusFisis.activityCi.toFixed(3)),
              'Laju Dosis (µSv/h)': parseFloat(statusFisis.doseRate.toFixed(3))
            }
          ]);
        }

        // Pembangkitan partikel meluruh: peluang muncul mengecil seiring turunnya aktivitas A(t)
        if (canvasRef.current && Math.random() < (statusFisis.activityCi / setupData.initialActivity)) {
          const canvas = canvasRef.current;
          particlesRef.current.push({
            x: 20,
            y: Math.random() * (canvas.height - 20) + 10,
            speed: Math.random() * 4 + 4,
            size: Math.random() * 3 + 2,
            alpha: 1,
            hasCheckedShield: false // Penanda agar kalkulasi atenuasi per-partikel hanya dihitung sekali
          });
        }

        if (currentStep >= totalSteps) {
          clearInterval(interval);
          setSimState('finished');
          setShowResults(true); 
        }
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [simState, setupData]);

  // Efek Animasi Canvas dengan Logika Atenuasi & Penembusan Fisis
  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shieldX = canvas.width * 0.65;
      const shieldWidth = Math.min(10 + setupData.shieldingThickness * 30, 45);

      // Gambar representasi fisik material perisai (shielding)
      if (simState === 'running' || simState === 'finished') {
        ctx.fillStyle = materialColors[setupData.shieldingMaterial] || '#7f8c8d';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(shieldX, 0, shieldWidth, canvas.height);
        ctx.globalAlpha = 1.0;
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.speed;

        // Gerbang Interaksi: Tepat ketika partikel masuk ke koordinat X bidang perisai
        if (p.x >= shieldX && p.x <= shieldX + shieldWidth + 5) {
          if (!p.hasCheckedShield) {
            p.hasCheckedShield = true;

            // Ambil koefisien serapan linier material (mu)
            const mu = muValues[setupData.sourceType]?.[setupData.shieldingMaterial] || 0.5;
            // Faktor transmisi fisis Berdasarkan Hukum Beer-Lambert
            const transmissionFactor = Math.exp(-mu * setupData.shieldingThickness);

            // Stochastic Evaluation: Apakah partikel foton lolos tembus atau teratenuasi habis?
            const isTransmitted = Math.random() < transmissionFactor;

            if (!isTransmitted) {
              // Jika diserap: partikel redup, melambat, lalu mati di dalam perisai
              p.alpha = 0.15; 
              p.speed *= 0.2; 
            } else {
              // Jika lolos (tembus): tetap bersinar terang melewati pembatas kanan timbal
              p.alpha = 1.0;
            }
          }
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = '#dc3545';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffc107';
        ctx.fill();
        ctx.restore();

        // Bersihkan array dari partikel mati atau yang sudah keluar area canvas
        return p.x < canvas.width && p.alpha > 0.05 && p.speed > 0.1;
      });

      animationFrameId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animationFrameId);
  }, [simState, setupData]);

  const handleStartSimulation = () => {
    setSimState('running');
    setElapsedTime(0);
    setShowResults(false);
    particlesRef.current = [];
  };

  const handleResetSimulation = () => {
    setSimState('idle');
    setElapsedTime(0);
    setShowResults(false);
    particlesRef.current = [];
    const initialPhysic = calculateDoseAtTime(0);
    setCurrentDoseRate(initialPhysic.doseRate);
    setCurrentActivity(initialPhysic.activityCi);
    setChartData([{
      time: '0.0',
      'Aktivitas (Ci)': initialPhysic.activityCi,
      'Laju Dosis (µSv/h)': initialPhysic.doseRate
    }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToResults = () => {
    if (hasilRef.current) {
      hasilRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getAvatarFace = () => {
    let currentImage = rektaDatar;
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
          width: '110px', 
          height: '110px', 
          objectFit: 'contain', 
          transition: 'all 0.3s ease',
          filter: currentDoseRate > NBD_LIMIT ? 'drop-shadow(0px 4px 15px rgba(220,53,69,0.8))' : 'none'
        }} 
      />
    );
  };

  const materialColors = {
    lead: '#2c3e50', concrete: '#95a5a6', steel: '#7f8c8d', glass: 'rgba(52, 152, 219, 0.4)'
  };

  const progressPercent = (elapsedTime / (TOTAL_DURATION / 1000)) * 100;
  const currentSourceInfo = sourceDescriptions[setupData.sourceType] || { name: 'Isotop Tidak Diketahui', desc: '-', energy: '-', halfLifeSec: 0 };

  return (
    <div className="Simulasi" style={{ minHeight: '100vh', paddingBottom: '100px', backgroundColor: '#0a0a0a', color: '#e6e6e6', fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        
        {/* HEADER */}
        <div style={{ paddingTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="nusa" style={{ color: '#cca60b', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Dasbor Eksperimen Peluruhan & Shielding
          </h1>
          <p className="ket" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            Status Aktivitas Sumber: {simState === 'running' ? <span style={{color: '#fd7e14', fontWeight:'bold'}}>MELURUH SECARA REAL-TIME...</span> : simState === 'finished' ? <span style={{color: '#28a745', fontWeight:'bold'}}>STABIL/SELESAI</span> : 'STANDBY'}
          </p>
        </div>

        {/* UTAMA CARD SIMULASI */}
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', border: simState === 'running' ? '1px solid #fd7e14' : '1px solid #cca60b', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <Card.Body className="p-4 p-md-5">
                
                {/* 1. VISUALISASI BLOK INTERAKTIF DENGAN CANVAS PERCIKAN */}
                <Row className="align-items-stretch text-center mb-4 justify-content-center">
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#dc3545', fontWeight: 'bold' }}>SUMBER RADIASI</h5>
                      <div style={{ margin: '15px auto', width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: simState === 'running' ? '0 0 25px #dc3545' : '0 0 10px #dc3545', fontSize: '1.8rem' }}>☢️</div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{setupData.sourceType.toUpperCase()}</h4>
                      <small style={{ color: '#fd7e14', fontWeight: 'bold', display: 'block' }}>A(t): {currentActivity.toFixed(3)} Ci</small>
                      <small style={{ color: '#aaa', fontSize: '0.75rem' }}>T½ Simulasi: {currentSourceInfo.halfLifeSec} Detik</small>
                    </div>
                  </Col>

                  <Col md={6} className="mb-4 mb-md-0 d-flex flex-column justify-content-center relative">
                    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '160px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                      <canvas ref={canvasRef} width={450} height={160} style={{ width: '100%', height: '100%', display: 'block' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#aaa' }}>Emisi Foton →</div>
                      <div style={{ 
                        position: 'absolute', top: '40px', right: '18%', 
                        backgroundColor: materialColors[setupData.shieldingMaterial], color: '#fff',
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #fff', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                      }}>
                        {t(`common:materials.${setupData.shieldingMaterial}`)} ({setupData.shieldingThickness} cm)
                      </div>
                      <div style={{ position: 'absolute', bottom: '8px', left: '40%', fontSize: '0.8rem', color: '#cca60b' }}>Jarak: {setupData.distance} m</div>
                    </div>
                  </Col>

                  <Col md={3} className="d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: currentDoseRate > NBD_LIMIT ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.1)', border: `2px solid ${currentDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745'}`, borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: currentDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>DOSIMETER PERSONAL</h5>
                      <div style={{ margin: '5px 0' }}>{getAvatarFace()}</div>
                      <h4 style={{ color: currentDoseRate > NBD_LIMIT ? '#dc3545' : '#fff', fontWeight: 'bold', fontFamily: "'Courier New', monospace", fontSize: '1.4rem' }}>
                        {currentDoseRate.toFixed(4)}
                      </h4>
                      <small style={{ color: '#aaa', display: 'block' }}>µSv/jam (Laju Dosis)</small>
                    </div>
                  </Col>
                </Row>

                {/* 2. PROGRESS BAR & TIMELINE PELURUHAN */}
                <div className="mt-4 mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 style={{ color: '#aaa' }}>Waktu Deteksi & Peluruhan Berjalan</h6>
                    <h5 style={{ fontWeight: 'bold', color: '#fff', fontFamily: "'Courier New', monospace" }}>
                      {elapsedTime.toFixed(2)} / {(TOTAL_DURATION / 1000).toFixed(0)} s
                    </h5>
                  </div>
                  <ProgressBar 
                    now={progressPercent} 
                    variant={simState === 'finished' ? "success" : "warning"}
                    animated={simState === 'running'}
                    style={{ height: '12px', borderRadius: '8px', backgroundColor: '#222' }}
                  />
                </div>

                {/* ================= GRAFIK RESPONSIVE RECHARTS ================= */}
                {(simState === 'running' || chartData.length > 1) && (
                  <div className="mt-4 mb-4 p-3 rounded-4" style={{ backgroundColor: '#0d0d0d', border: '1px solid #222' }}>
                    <h6 style={{ color: '#cca60b', fontWeight: 'bold', marginBottom: '15px', paddingLeft: '10px' }}>
                      📈 Grafik Peluruhan Eksponensial Terintegrasi Laju Dosis Real-Time
                    </h6>
                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fd7e14" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#fd7e14" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDose" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#dc3545" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#dc3545" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                          <XAxis dataKey="time" stroke="#666" fontSize={11} />
                          <YAxis stroke="#666" fontSize={11} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', pt: 10 }} />
                          <Area type="monotone" dataKey="Aktivitas (Ci)" stroke="#fd7e14" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
                          <Area type="monotone" dataKey="Laju Dosis (µSv/h)" stroke="#dc3545" strokeWidth={2} fillOpacity={1} fill="url(#colorDose)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 3. KONTROL UTAMA */}
                <div className="text-center mt-4">
                  {simState === 'idle' && (
                    <button onClick={handleStartSimulation} className="btn btn-warning btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', letterSpacing: '1px', color: '#000' }}>
                      ☢️ EMISIKAN & LIHAT PELURUHAN
                    </button>
                  )}

                  {simState === 'running' && (
                    <button disabled className="btn btn-outline-danger btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', cursor: 'not-allowed' }}>
                      ZAT RADIOAKTIF MELURUH ({elapsedTime.toFixed(1)}s)...
                    </button>
                  )}

                  {simState === 'finished' && (
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button onClick={handleResetSimulation} className="btn btn-secondary btn-lg rounded-5 px-4">
                        Ulangi Simulasi
                      </button>
                      <button onClick={handleScrollToResults} className="btn btn-success btn-lg rounded-5 px-5" style={{ fontWeight: 'bold' }}>
                        Buka Berkas Analisis Hukum Peluruhan ↓
                      </button>
                    </div>
                  )}
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* SECTION REVOLUSIONER: EDUKASI, FORMULA & PROTEKSI */}
        {showResults && (
          <div ref={hasilRef} style={{ paddingTop: '50px', marginTop: '20px' }}>
            <hr style={{ borderColor: '#cca60b', marginBottom: '40px', opacity: 0.4 }} />
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ color: '#cca60b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🗂️ Berkas Analisis Ekstraksi Eksperimen Peluruhan
              </h2>
              <p style={{ color: '#aaa' }}>Kajian komparasi efek penahanan perisai terhadap radionuklida tidak stabil</p>
            </div>

            <Row className="g-4">
              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #dc3545', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>⚛️</span>
                      <h4 style={{ color: '#dc3545', fontWeight: 'bold', margin: 0 }}>Profil Radionuklida</h4>
                    </div>
                    <h5 style={{ color: '#fff', fontWeight: '600' }}>{currentSourceInfo.name}</h5>
                    <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'justify' }}>
                      {currentSourceInfo.desc}
                    </p>
                    <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #dc3545', marginTop: '15px' }}>
                      <small style={{ color: '#aaa', display: 'block', fontWeight: 'bold' }}>Konstanta Waktu Paruh Teoretis:</small>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{currentSourceInfo.energy}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #cca60b', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🧮</span>
                      <h4 style={{ color: '#cca60b', fontWeight: 'bold', margin: 0 }}>Hukum Peluruhan & Atenuasi</h4>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Persamaan laju dosis dinamis terintegrasi integral eksponensial terhadap waktu:</p>
                    
                    <div style={{ textAlign: 'center', padding: '15px 0', backgroundColor: '#070707', borderRadius: '8px', border: '1px dashed #333', marginBottom: '15px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', fontFamily: "'Courier New', monospace" }}>
                        I(t) = ( (I₀ × e^(-λt)) × e^(-μx) ) / r²
                      </div>
                    </div>

                    <ul style={{ color: '#ccc', fontSize: '0.85rem', paddingLeft: '20px', lineHeight: '1.7' }}>
                      <li><b style={{ color: '#cca60b' }}>e^(-λt) (Hukum Peluruhan):</b> Menghitung penurunan drastis aktivitas radionuklida seiring berjalannya waktu. Laju dosis puncak awal sebesar <span style={{ fontFamily: 'monospace' }}>{peakDoseRate.toFixed(2)} µSv/h</span> terus berkurang secara simultan.</li>
                      <li><b style={{ color: '#cca60b' }}>e^(-μx) (Hukum Beer-Lambert):</b> Efek pelemahan material tameng fisis dengan nilai koefisien serapan μ = <span style={{ fontFamily: 'monospace' }}>{muValues[setupData.sourceType]?.[setupData.shieldingMaterial] || 0.5}</span>.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #28a745', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🛡️</span>
                      <h4 style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>Kalkulasi Akhir Proteksi</h4>
                    </div>
                    
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                      Aktivitas sisa terdeteksi di akhir paparan jatuh ke angka <b style={{ color: '#fff' }}>{currentActivity.toFixed(4)} Ci</b> dengan laju paparan akhir <b style={{ color: '#fff' }}>{currentDoseRate.toFixed(4)} µSv/jam</b>.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <div style={{ backgroundColor: peakDoseRate > NBD_LIMIT ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <b style={{ color: peakDoseRate > NBD_LIMIT ? '#dc3545' : '#28a745' }}>
                          {peakDoseRate > NBD_LIMIT ? "🚨 PERINGATAN DOSIS AWAL TINGGI:" : "✅ EVALUASI RADIOLOGI AMAN:"}
                        </b>
                        <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>
                          {peakDoseRate > NBD_LIMIT 
                            ? "Meskipun zat radioaktif meluruh dengan cepat, dosis pancaran awal melampaui Batas Dosis Kerja. Perisai atau jarak aman ekstra sangat direkomendasikan!" 
                            : "Aktivitas awal dan akhir seluruhnya berada di bawah limit regulasi keselamatan BAPETEN."}
                        </p>
                      </div>

                      <div style={{ marginTop: '5px' }}>
                        <small style={{ color: '#28a745', fontWeight: 'bold', display: 'block' }}>Mandat Manajemen Keselamatan:</small>
                        <ul style={{ color: '#ccc', fontSize: '0.85rem', paddingLeft: '20px', margin: '5px 0' }}>
                          <li>Gunakan perisai sesuai perhitungan konstanta atenuasi linier material.</li>
                          <li>Manfaatkan prinsip waktu, jarak, dan pelindung kontaminasi partikel.</li>
                        </ul>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

      </Container>
    </div>
  );
};

export default Simulasi2;
