import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const SelectMode = () => {
  const navigate = useNavigate();

  // Menyembunyikan Navbar atas bawaan secara otomatis saat masuk ke halaman ini
  useEffect(() => {
    const navbar = document.querySelector('nav') || document.querySelector('.navbar');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      if (navbar) navbar.style.display = 'block';
    };
  }, []);

  // Fungsi untuk menangani navigasi berdasarkan mode yang dipilih
  const handleSelectMode = (modeType) => {
    if (modeType === 'Misi') {
      navigate('/setup-misi'); 
    } else if (modeType === 'Simulasi') { 
      navigate('/setup-simulasi'); 
    } else if (modeType === 'SimulasiWaktu') {
      // PERBAIKAN: Diarahkan langsung ke path komponen SetupSimulasiWaktu baru kamu!
      navigate('/setup-waktu'); 
    }
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <Container>
        <div className="header-box text-center">
          <h1 style={{ color: "#cca60b", fontWeight: "bold", marginBottom: '10px' }}>
            Pilih Mode Eksperimen
          </h1>
          <p style={{ color: '#e6e6e6', marginBottom: '50px', fontSize: '1.1rem' }}>
            Pilih jenis eksperimen radiasi yang ingin Anda jalankan hari ini.
          </p>

          <Row className="justify-content-center g-4">
            
            {/* Kartu Pilihan Mode 1: SIMULASI SHIELDING */}
            <Col md={4}>
              <Card 
                className="h-100 text-white" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cca60b'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => handleSelectMode('Simulasi')} 
              >
                <Card.Body className="d-flex flex-column align-items-center p-4">
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(204, 166, 11, 0.2)', borderRadius: '50%', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🧪</span> 
                  </div>
                  <Card.Title style={{ color: "#cca60b", fontWeight: "bold", fontSize: '1.4rem' }}>Simulasi Shielding Radiasi</Card.Title>
                  <Card.Text style={{ color: '#cccccc', textAlign: 'center', flexGrow: 1, fontSize: '0.95rem' }}>
                    Atur sendiri jenis sumber radiasi, ketebalan perisai, dan jarak detektor untuk melihat interaksi redaman energinya. 
                  </Card.Text>
                  <button className="btn1 rounded-5 mt-3 w-100">Pilih Mode Ini</button>
                </Card.Body>
              </Card>
            </Col>

            {/* Kartu Pilihan Mode 2: SIMULASI WAKTU PAPARAN RADIASI */}
            <Col md={4}>
              <Card 
                className="h-100 text-white" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#28a745'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => handleSelectMode('SimulasiWaktu')} 
              >
                <Card.Body className="d-flex flex-column align-items-center p-4">
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(40, 167, 69, 0.2)', borderRadius: '50%', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>⏱️</span> 
                  </div>
                  <Card.Title style={{ color: "#28a745", fontWeight: "bold", fontSize: '1.4rem' }}>Simulasi Waktu Radiasi</Card.Title>
                  <Card.Text style={{ color: '#cccccc', textAlign: 'center', flexGrow: 1, fontSize: '0.95rem' }}>
                    Analisis akumulasi laju dosis secara langsung menggunakan sistem stopwatch maju (*count-up*) penentu durasi paparan aman.
                  </Card.Text>
                  <button className="btn1 rounded-5 mt-3 w-100" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>Pilih Mode Ini</button>
                </Card.Body>
              </Card>
            </Col>

            {/* Kartu Pilihan Mode 3: MISI KASUS */}
            <Col md={4}>
              <Card 
                className="h-100 text-white" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#dc3545'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => handleSelectMode('Misi')}
              >
                <Card.Body className="d-flex flex-column align-items-center p-4">
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(220, 53, 69, 0.2)', borderRadius: '50%', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🏭</span> 
                  </div>
                  <Card.Title style={{ color: "#dc3545", fontWeight: "bold", fontSize: '1.4rem' }}>Simulasi Kasus Kerja</Card.Title>
                  <Card.Text style={{ color: '#cccccc', textAlign: 'center', flexGrow: 1, fontSize: '0.95rem' }}>
                    Selesaikan berbagai tantangan spesifik dan skenario terpandu di dalam area medan radiasi reaktor nuklir industri.
                  </Card.Text>
                  <button className="btn1 rounded-5 mt-3 w-100" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>Pilih Mode Ini</button>
                </Card.Body>
              </Card>
            </Col>

          </Row>

          <div className="mt-5">
            <button onClick={() => navigate('/intro')} className="btn2 rounded-5">
              Kembali
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SelectMode;
