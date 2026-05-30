import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import rektaDatar from '../assets/rekta datar.png';
import rektaSenang from '../assets/rekta senang.png';
import rektaSedih from '../assets/rekta sedih.png';
import rektaTegang from '../assets/rekta tegang.png';
import rektaPingsan from '../assets/rekta pingsan.png';

// 1. Konstanta Laju Dosis Gamma (µSv/h per MBq pada 1 meter)
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
    desc: 'Isotop radioaktif buatan yang memancarkan radiasi Beta dan Gamma dengan waktu paruh sekitar 30.17 tahun. Banyak digunakan pada kalibrasi alat ukur radiasi, industri densitometer, serta brakiterapi medis.',
    energy: 'Sinar Gamma utama pada energi 0.662 MeV.',
  },
  'co-60': {
    name: 'Cobalt-60 (Co-60)',
    desc: 'Isotop pemancar Gamma energi tinggi dengan waktu paruh 5.27 tahun. Diproduksi melalui aktivasi neutron di reaktor nuklir, sangat vital untuk radioterapi kanker dan sterilisasi industri makanan.',
    energy: 'Dua puncak energi Gamma tajam pada 1.17 MeV dan 1.33 MeV.',
  },
  'na-22': {
    name: 'Natrium-22 (Na-22)',
    desc: 'Isotop pemancar positron (Beta+) dan Gamma dengan waktu paruh 2.6 tahun. Sering dimanfaatkan dalam studi laboratorium fisika nuklir tingkat lanjut dan sebagai sumber kalibrasi untuk spektroskopi annihilasi.',
    energy: 'Energi foton Gamma hasil penyerapan energi positron sebesar 1.275 MeV.',
  },
  'am-241': {
    name: 'Amerisium-241 (Am-241)',
    desc: 'Isotop hasil peluruhan Plutonium dengan waktu paruh 432 tahun. Memancarkan partikel Alfa dominan serta sinar Gamma energi rendah. Sering ditemui pada detektor asap komersial lawas dan alat logging sumur minyak.',
    energy: 'Foton Gamma energi rendah sebesar 59.5 keV.',
  },
  'u-235': {
    name: 'Uranium-235 (U-235)',
    desc: 'Isotop alami yang bersifat fisil dan menjadi bahan bakar utama bagi Pembangkit Listrik Tenaga Nuklir (PLTN) serta reaktor riset.',
    energy: 'Emisi Gamma bervariasi dengan spektrum utama di kisaran 185.7 keV.',
  },
  'th-232': {
    name: 'Torium-232 (Th-232)',
    desc: 'Isotop radioaktif alami yang meluruh sangat lambat dengan waktu paruh sekitar 14 miliar tahun. Torium digadang-gadang sebagai kandidat bahan bakar nuklir masa depan.',
    energy: 'Peluruhan Gamma berantai didominasi oleh anak luruh Th-232.',
  },
  'pu-239': {
    name: 'Plutonium-239 (Pu-239)',
    desc: 'Isotop fisil buatan yang dihasilkan dari tangkapan neutron Uranium-238. Digunakan sebagai bahan bakar reaktor pembiak serta dalam aplikasi riset nuklir.',
    energy: 'Spektrum Gamma energi rendah yang kompleks bercampur emisi partikel Alfa kuat.',
  },
  'i-131': {
    name: 'Iodium-131 (I-131)',
    desc: 'Isotop radioaktif dengan waktu paruh pendek sekitar 8 hari. Sering digunakan dalam diagnosis dan terapi kanker kelenjar tiroid.',
    energy: 'Foton Gamma dominan dipancarkan pada energi 364 keV.',
  },
};

const NBD_LIMIT_DOSIS_TOTAL = 10.0; // Ambang batas dosis aman simulasi dalam µSv

const SimulasiWaktu = () => {
  const location = useLocation();
  const hasilRef = useRef(null);

  useEffect(() => {
    const navbar = document.querySelector('nav') || document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = 'block';
    };
  }, []);

  const setupData = useMemo(() => {
    return location.state?.setupData || {
      sourceType: 'cs-137',
      initialActivity: 10,
      distance: 1,
      maxDuration: 10,
    };
  }, [location.state]);

  const [simState, setSimState] = useState('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentDoseRate, setCurrentDoseRate] = useState(0);
  const [accumulatedDose, setAccumulatedDose] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const validDistance = Math.max(setupData.distance ?? 1, 0.1);
    const activityMBq = (setupData.initialActivity ?? 10) * 37000;
    const gamma = gammaConstants[setupData.sourceType] ?? 0.1;
    const initialDoseRate1m = activityMBq * gamma;
    const finalCalculatedDoseRate = initialDoseRate1m / (validDistance * validDistance);
    setCurrentDoseRate(finalCalculatedDoseRate);
  }, [setupData]);

  useEffect(() => {
    let interval;

    if (simState === 'running') {
      const intervalTime = 100;
      interval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const nextTime = prevTime + intervalTime / 1000;
          const currentDoseSpent = currentDoseRate * (nextTime / 3600);
          setAccumulatedDose(currentDoseSpent);

          if (nextTime >= setupData.maxDuration) {
            clearInterval(interval);
            setSimState('finished');
            setShowResults(true);
            return setupData.maxDuration;
          }

          return nextTime;
        });
      }, intervalTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [simState, currentDoseRate, setupData.maxDuration]);

  const handleStartSimulation = () => {
    setElapsedTime(0);
    setAccumulatedDose(0);
    setShowResults(false);
    setSimState('running');
  };

  const handleResetSimulation = () => {
    setElapsedTime(0);
    setAccumulatedDose(0);
    setShowResults(false);
    setSimState('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToResults = () => {
    if (hasilRef.current) {
      hasilRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getAvatarFace = () => {
    if (simState === 'idle') {
      return rektaDatar;
    }
    if (accumulatedDose > NBD_LIMIT_DOSIS_TOTAL * 2) {
      return rektaPingsan;
    }
    if (accumulatedDose > NBD_LIMIT_DOSIS_TOTAL) {
      return rektaSedih;
    }
    if (accumulatedDose > NBD_LIMIT_DOSIS_TOTAL * 0.5) {
      return rektaTegang;
    }
    return rektaSenang;
  };

  const progressPercent = setupData.maxDuration > 0 ? Math.min(100, Math.max(0, (elapsedTime / setupData.maxDuration) * 100)) : 0;
  const currentSourceInfo = sourceDescriptions[setupData.sourceType] || { name: 'Isotop Tidak Diketahui', desc: '-', energy: '-' };
  const elapsedHours = elapsedTime / 3600;
  const safeHours = NBD_LIMIT_DOSIS_TOTAL / Math.max(currentDoseRate, 1e-6);

  return (
    <div className="SimulasiWaktu" style={{ minHeight: '100vh', paddingBottom: '100px', backgroundColor: '#0a0a0a', color: '#e6e6e6', fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        <div style={{ paddingTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ color: '#28a745', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Dasbor Eksperimen Waktu Paparan
          </h1>
          <p style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            Status Sistem: {simState === 'running' ? <span style={{ color: '#dc3545', fontWeight: 'bold' }}>PENCATATAN AKTIF...</span> : simState === 'finished' ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>WAKTU HABIS</span> : 'STANDBY'}
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={12}>
            <Card style={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', border: simState === 'running' ? '1px solid #dc3545' : '1px solid #28a745', borderRadius: '15px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <Card.Body className="p-4 p-md-5">
                <Row className="align-items-stretch text-center mb-5 justify-content-center">
                  <Col md={3} className="mb-4 mb-md-0 d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545', borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: '#dc3545', fontWeight: 'bold' }}>SUMBER RADIASI</h5>
                      <div style={{ margin: '20px auto', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: simState === 'running' ? '0 0 25px #dc3545' : '0 0 10px #dc3545', fontSize: '2rem' }}>☢️</div>
                      <h4 style={{ color: '#fff', margin: '5px 0' }}>{setupData.sourceType.toUpperCase()}</h4>
                      <small style={{ color: '#aaa' }}>Aktivitas: {setupData.initialActivity} Ci</small>
                    </div>
                  </Col>

                  <Col md={3} className="d-flex flex-column align-items-center justify-content-center mb-4 mb-md-0">
                    <div style={{ padding: '15px', backgroundColor: 'rgba(255, 193, 7, 0.05)', border: '1px dashed #ffc107', borderRadius: '10px', width: '100%' }}>
                      <span style={{ fontSize: '1.5rem', color: '#ffc107' }}>📡 Laju Dosis</span>
                      <h4 style={{ color: '#fff', margin: '5px 0', fontFamily: 'monospace' }}>{Number.isFinite(currentDoseRate) ? currentDoseRate.toFixed(2) : '0.00'}</h4>
                      <small style={{ color: '#aaa' }}>µSv/jam (Konstan di Jarak {setupData.distance} m)</small>
                    </div>
                  </Col>

                  <Col md={4} className="d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px', backgroundColor: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.1)', border: `2px solid ${accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? '#dc3545' : '#28a745'}`, borderRadius: '12px', height: '100%' }}>
                      <h5 style={{ color: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>TOTAL DOSIS TERSERAP</h5>
                      <div style={{ margin: '10px 0' }}>
                        <img
                          src={getAvatarFace()}
                          alt="Status Avatar Rekta"
                          style={{ width: '120px', height: '120px', objectFit: 'contain', transition: 'all 0.3s ease', filter: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? 'drop-shadow(0px 4px 15px rgba(220,53,69,0.8))' : 'none' }}
                        />
                      </div>
                      <h3 style={{ color: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? '#dc3545' : '#28a745', fontWeight: 'bold', fontFamily: "'Courier New', monospace" }}>
                        {Number.isFinite(accumulatedDose) ? accumulatedDose.toFixed(6) : '0.000000'}
                      </h3>
                      <small style={{ color: '#aaa' }}>µSv (Dosis Terakumulasi)</small>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4 mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 style={{ color: '#aaa' }}>Stopwatch Durasi Paparan</h5>
                    <h5 style={{ fontWeight: 'bold', color: '#fff', fontFamily: "'Courier New', monospace" }}>
                      {elapsedTime.toFixed(1)} / {setupData.maxDuration} Detik
                    </h5>
                  </div>
                  <ProgressBar
                    now={progressPercent}
                    variant={simState === 'finished' ? 'success' : 'danger'}
                    animated={simState === 'running'}
                    style={{ height: '18px', borderRadius: '8px', backgroundColor: '#222' }}
                  />
                </div>

                <div className="text-center mt-4">
                  {simState === 'idle' && (
                    <button onClick={handleStartSimulation} className="btn btn-success btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
                      ⏱️ MULAI PENCATATAN WAKTU
                    </button>
                  )}

                  {simState === 'running' && (
                    <button disabled className="btn btn-outline-danger btn-lg rounded-5 px-5 py-3" style={{ fontWeight: 'bold', cursor: 'not-allowed' }}>
                      PAPARAN BERLANGSUNG ({elapsedTime.toFixed(1)}s)...
                    </button>
                  )}

                  {simState === 'finished' && (
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button onClick={handleResetSimulation} className="btn btn-secondary btn-lg rounded-5 px-4">
                        Reset Simulasi
                      </button>
                      <button onClick={handleScrollToResults} className="btn btn-success btn-lg rounded-5 px-5" style={{ fontWeight: 'bold' }}>
                        Buka Analisis Waktu Fisika ↓
                      </button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {showResults && (
          <div ref={hasilRef} style={{ paddingTop: '60px', marginTop: '40px' }}>
            <hr style={{ borderColor: '#28a745', marginBottom: '50px', opacity: 0.4 }} />
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ color: '#28a745', fontWeight: 'bold', textTransform: 'uppercase' }}>
                🗂️ Laporan Analisis Dosis dan Waktu Paparan
              </h2>
              <p style={{ color: '#aaa' }}>Kajian prinsip proteksi radiasi berbasis kontrol durasi operasional pekerja</p>
            </div>

            <Row className="g-4">
              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #dc3545', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>⚛️</span>
                      <h4 style={{ color: '#dc3545', fontWeight: 'bold', margin: 0 }}>Karakteristik Sumber</h4>
                    </div>
                    <h5 style={{ color: '#fff', fontWeight: '600' }}>{currentSourceInfo.name}</h5>
                    <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6' }}>{currentSourceInfo.desc}</p>
                    <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #dc3545', marginTop: '15px' }}>
                      <small style={{ color: '#aaa', display: 'block', fontWeight: 'bold' }}>Energi Utama Foton:</small>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{currentSourceInfo.energy}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #ffc107', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🧮</span>
                      <h4 style={{ color: '#ffc107', fontWeight: 'bold', margin: 0 }}>Hukum Waktu (*Time Principle*)</h4>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Dosis total berbanding lurus secara linier dengan lamanya waktu pekerja berada di dekat medan radiasi:</p>
                    <div style={{ textAlign: 'center', padding: '15px 0', backgroundColor: '#070707', borderRadius: '8px', border: '1px dashed #333', marginBottom: '15px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', fontFamily: "'Courier New', monospace" }}>E = H × t</div>
                    </div>
                    <ul style={{ color: '#ccc', fontSize: '0.85rem', paddingLeft: '20px', lineHeight: '1.7' }}>
                      <li><b>E (Dosis Akumulasi):</b> Total energi radiasi yang diserap tubuh dalam µSv. Nilai akhirmu: <span style={{ color: '#28a745', fontWeight: 'bold' }}>{accumulatedDose.toFixed(4)} µSv</span>.</li>
                      <li><b>H (Laju Dosis):</b> Kekuatan radiasi lingkungan per jam: <span style={{ fontFamily: 'monospace' }}>{currentDoseRate.toFixed(2)} µSv/jam</span>.</li>
                      <li><b>t (Durasi Waktu):</b> Total waktu paparan dikonversi ke jam: <span style={{ fontFamily: 'monospace' }}>{elapsedTime.toFixed(1)} detik / 3600</span>.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card style={{ backgroundColor: '#111', border: '1px solid #28a745', borderRadius: '15px', height: '100%' }}>
                  <Card.Body className="p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🛡️</span>
                      <h4 style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>Optimasi Proteksi</h4>
                    </div>
                    <div style={{ backgroundColor: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                      <b style={{ color: accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? '#dc3545' : '#28a745' }}>
                        {accumulatedDose > NBD_LIMIT_DOSIS_TOTAL ? '🚨 BAHAYA PAPARAN OVER-LIMIT:' : '✅ DOSIS RADIASI AMAN:'}
                      </b>
                      <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>
                        {accumulatedDose > NBD_LIMIT_DOSIS_TOTAL
                          ? `Total penerimaan dosis telah menembus ambang batas uji aman (${NBD_LIMIT_DOSIS_TOTAL} µSv). Kurangi durasi paparan atau gunakan jarak lebih jauh.`
                          : `Total dosis masih berada di bawah batas aman (${NBD_LIMIT_DOSIS_TOTAL} µSv). Teruskan kontrol durasi paparan dengan bijak.`}
                      </p>
                    </div>
                    <div style={{ backgroundColor: '#070707', borderRadius: '10px', padding: '15px', border: '1px solid #333' }}>
                      <p style={{ color: '#ccc', marginBottom: '8px' }}><b>Durasi Paparan Saat Ini:</b> {elapsedTime.toFixed(1)} detik ({elapsedHours.toFixed(4)} jam).</p>
                      <p style={{ color: '#ccc', marginBottom: 0 }}><b>Perkiraan Batas Aman:</b> {safeHours.toFixed(3)} jam / {Math.min(safeHours * 3600, 999999).toFixed(0)} detik pada laju dosis ini.</p>
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

export default SimulasiWaktu;
