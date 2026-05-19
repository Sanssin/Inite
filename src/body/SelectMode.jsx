import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectMode = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('simulation'); 

  // Fungsi untuk menangani navigasi berdasarkan mode yang dipilih
  const handleSelectMode = (modeType) => {
    if (modeType === 'Misi') {
      navigate('/setup-misi'); 
    } else if (modeType === 'Simulasi') { 
      navigate('/setup-simulasi'); 
    }
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <div className="header-box text-center">
          <h1 style={{ color: "#cca60b", fontWeight: "bold", marginBottom: '10px' }}>
            Pilih Mode
          </h1>
          <p style={{ color: '#e6e6e6', marginBottom: '40px', fontSize: '1.1rem' }}>
            Pilih jenis eksperimen radiasi yang ingin Anda jalankan hari ini.
          </p>

          <Row className="justify-content-center gap-4 gap-md-0">
            {/* Kartu Pilihan Mode 1: EKSPERIMEN BEBAS (SIMULASI) */}
            <Col md={5} lg={4}>
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
                  <Card.Title style={{ color: "#cca60b", fontWeight: "bold", fontSize: '1.5rem' }}>Simulasi Shielding Radiasi Nuklir</Card.Title>
                  <Card.Text style={{ color: '#cccccc', textAlign: 'center', flexGrow: 1 }}>
                    Atur sendiri sumber radiasi, jarak, dan jenis pelindung untuk melihat interaksinya secara langsung. 
                  </Card.Text>
                  <button className="btn1 rounded-5 mt-3 w-100">Pilih Mode Ini</button>
                </Card.Body>
              </Card>
            </Col>

            {/* Kartu Pilihan Mode 2: MISI KASUS (MISI) */}
            <Col md={5} lg={4}>
              <Card 
                className="h-100 text-white" 
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cca60b'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                onClick={() => handleSelectMode('Misi')}
              >
                <Card.Body className="d-flex flex-column align-items-center p-4">
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(204, 166, 11, 0.2)', borderRadius: '50%', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🏭</span> 
                  </div>
                  <Card.Title style={{ color: "#cca60b", fontWeight: "bold", fontSize: '1.5rem' }}>Simulasi Radiasi Nuklir</Card.Title>
                  <Card.Text style={{ color: '#cccccc', textAlign: 'center', flexGrow: 1 }}>
                    Selesaikan tantangan spesifik di lingkungan kerja radiasi.
                  </Card.Text>
                  <button className="btn1 rounded-5 mt-3 w-100">Pilih Mode Ini</button>
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
