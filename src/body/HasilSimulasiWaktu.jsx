import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const POSTTEST_FORM_URL = 'https://forms.gle/TEraBC2SuJqBiRRQ8';

// Evaluasi efek biologis berdasarkan total Akumulasi Dosis Serap (μSv) setelah paparan waktu
const getAccumulatedDoseEffect = (totalDose, t) => {
  // Nilai pembatas berbasis asumsi proporsionalitas NBD fisis mikro-Sievert
  const AMAN_TAHUNAN = 10.0; 
  const WASPADA = 100.0;
  const BAHAYA_TINGGI = 1000.0; // 1 mSv

  if (totalDose <= AMAN_TAHUNAN) {
    return {
      level: t('simulation:results.veryLow.level', { defaultValue: 'Sangat Aman' }),
      description: t('simulation:results.veryLow.description', { defaultValue: 'Dosis berada di bawah ambang batas intervensi proteksi.' }),
      effects: t('simulation:results.veryLow.effects', { defaultValue: 'Tidak ada efek biologis merugikan secara klinis (Aman).' }),
      variant: 'success'
    };
  } else if (totalDose <= WASPADA) {
    return {
      level: t('simulation:results.low.level', { defaultValue: 'Rendah (Batas Wajar)' }),
      description: t('simulation:results.low.description', { defaultValue: 'Dosis akumulasi setara dengan paparan latar alami tahunan.' }),
      effects: t('simulation:results.low.effects', { defaultValue: 'Efek stokastik dapat diabaikan berdasarkan asas ALARA.' }),
      variant: 'info'
    };
  } else if (totalDose <= BAHAYA_TINGGI) {
    return {
      level: t('simulation:results.moderate.level', { defaultValue: 'Waspada Tinggi' }),
      description: t('simulation:results.moderate.description', { defaultValue: 'Akumulasi dosis mulai melampaui limitasi waktu kerja normal.' }),
      effects: t('simulation:results.moderate.effects', { defaultValue: 'Peningkatan risiko efek stokastik jangka panjang secara linear.' }),
      variant: 'warning'
    };
  } else {
    return {
      level: t('simulation:results.high.level', { defaultValue: 'Bahaya Radiasi' }),
      description: t('simulation:results.high.description', { defaultValue: 'Total paparan dosis melebihi ambang batas aman praktikum.' }),
      effects: t('simulation:results.high.effects', { defaultValue: 'Potensi risiko kerusakan selular molekuler. Diperlukan tindakan detoksifikasi lapangan.' }),
      variant: 'danger'
    };
  }
};

const HasilSimulasi3 = () => {
  const { t } = useTranslation(['simulation', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tangkap data kiriman dari SimulasiWaktu.jsx
  const { 
    totalDoseAccumulated = 0, // Total Dosis Akhir (μSv)
    elapsedTime = 0,          // Waktu stopwatch berjalan (detik)
    setupData = {
      sourceType: 'unknown',
      initialActivity: 0,
      distance: 0,
      maxDuration: 0          // Target Stay Time batas aman (detik)
    }
  } = location.state || {};
  
  const [hasOpenedPosttest, setHasOpenedPosttest] = useState(false);

  // Kalkulasi efek berdasarkan akumulasi dosis
  const result = getAccumulatedDoseEffect(totalDoseAccumulated, t);

  // Cek apakah waktu pengerjaan melanggar batasan Stay Time
  const isOvertime = elapsedTime > setupData.maxDuration;

  const handleRestart = () => {
    // Kembali ke konfigurasi parameter waktu (SetupSim3 / SetupSimulasiWaktu)
    navigate('/setup-waktu'); 
  };

  const handleOpenPosttest = () => {
    setHasOpenedPosttest(true);
    window.open(POSTTEST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    border: isOvertime ? '1px solid #dc3545' : '1px solid #28a745', // Merah jika overtime, hijau jika aman
    color: "#e6e6e6",
    boxShadow: isOvertime ? '0 0 15px rgba(220,53,69,0.2)' : '0 0 15px rgba(40,167,69,0.2)'
  };

  const listGroupItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: "#e6e6e6",
    padding: '1.2rem 1.25rem'
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: "#e6e6e6", paddingBottom: '60px', minHeight: '100vh' }}>
      <Container>
        <div className="header-box" style={{ paddingTop: '50px' }}>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: "#cca60b", fontWeight: 'bold', marginBottom: '30px', textTransform: 'uppercase' }}>
                Laporan Simulasi Waktu Radiasi
              </h1>
              
              <Card style={cardStyle}>
                <Card.Header as="h4" style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '15px' }}>
                  Total Akumulasi Dosis Serap
                </Card.Header>
                <Card.Body style={{ padding: '30px' }}>
                  
                  {/* Angka Dosis Akumulasi Efektif */}
                  <p style={{ fontSize: '3.8rem', fontWeight: 'bold', color: isOvertime ? '#dc3545' : '#28a745', margin: '0', letterSpacing: '-1px' }}>
                    {totalDoseAccumulated.toFixed(5)} <span style={{ fontSize: '1.5rem', color: '#aaa' }}>µSv</span>
                  </p>

                  {/* Status Manajemen Waktu (Stay Time) */}
                  <div className="mt-2 mb-4">
                    {isOvertime ? (
                      <Badge bg="danger" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        ⚠️ MELEBIHI TARGET STAY TIME (+{(elapsedTime - setupData.maxDuration).toFixed(1)}s)
                      </Badge>
                    ) : (
                      <Badge bg="success" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        ✓ BERHASIL EVAKUASI SEBELUM SELESAI STAY TIME
                      </Badge>
                    )}
                  </div>
                  
                  {/* Parameter Pengujian */}
                  {setupData.sourceType !== 'unknown' && (
                    <div className="mb-4 p-3 rounded text-start" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderLeft: '3px solid #cca60b' }}>
                      <small style={{ color: '#ccc', lineHeight: '1.6' }}>
                        • Sumber Radiasi: <strong>{setupData.sourceType.toUpperCase()}</strong> ({setupData.initialActivity} Ci)<br />
                        • Jarak Detektor Ke Sumber: <strong>{setupData.distance} m</strong><br />
                        • Durasi stopwatch di Medan Radiasi: <strong>{elapsedTime.toFixed(1)} detik</strong> (Batas Rencana: {setupData.maxDuration}s)
                      </small>
                    </div>
                  )}

                  <ListGroup variant="flush" className="text-start">
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>Tingkat Paparan Terakumulasi:</strong> 
                      <Badge bg={result.variant} className="ms-3" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                        {result.level}
                      </Badge>
                    </ListGroup.Item>
                    
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>Analisis Kondisi Kerja:</strong><br />
                      <span style={{ color: '#bbb', fontSize: '0.95rem' }}>{result.description}</span>
                    </ListGroup.Item>
                    
                    <ListGroup.Item style={{...listGroupItemStyle, borderBottom: 'none'}}>
                      <strong>Konsekuensi Efek Biologis:</strong><br />
                      <span style={{ color: '#bbb', fontSize: '0.95rem' }}>{result.effects}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Bagian Navigasi & Post-test */}
              <p className="mt-4 mb-2" style={{ color: '#f8f9fa' }}>
                {hasOpenedPosttest ? t('simulation:results.posttestUnlocked') : t('simulation:results.posttestRequired')}
              </p>
              
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px", fontWeight: 'bold' }} onClick={handleOpenPosttest}>
                  {t('simulation:results.fillPosttest')}
                </button>
                <button
                  type="button"
                  className="btn1 rounded-5"
                  style={{ padding: "15px 30px" }}
                  onClick={() => navigate('/edukasi-radiasi')}
                >
                  {t('simulation:results.learnEffects')}
                </button>
                <button
                  type="button"
                  className="btn2 rounded-5" 
                  style={{ padding: "15px 30px" }}
                  onClick={handleRestart}
                >
                  Ulangi Simulasi Waktu
                </button>
              </div>

            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HasilSimulasi3;
