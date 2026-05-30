// src/body/SimulasiWaktu.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const SimulationWaktu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mengambil data kiriman dari SetupSimulasiWaktu
  const setupData = location.state?.setupData || { sourceType: 'Cs-137', initialActivity: 10, distance: 1 };

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [accumulatedDose, setAccumulatedDose] = useState(0);

  // Estimasi Laju Dosis kasar berdasarkan rumus (Activity / d^2) 
  // Nilai ini idealnya didapat via fetch stream dari backend Python-mu
  const doseRatePerHour = (setupData.initialActivity * 0.33) / Math.pow(setupData.distance, 2); 
  const doseRatePerSecond = doseRatePerHour / 3600;

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setAccumulatedDose((prevDose) => prevDose + doseRatePerSecond);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, doseRatePerSecond]);

  const handleFinish = () => {
    setIsRunning(false);
    // Pindah ke halaman hasil dengan membawa skor data eksperimen
    navigate('/hasil-simulasi-waktu', { state: { seconds, accumulatedDose, setupData } });
  };

  return (
    <Container className="text-center my-5" style={{ color: '#fff', fontFamily: 'Poppins' }}>
      <h2 style={{ color: '#cca60b' }}>Eksperimen Simulasi Waktu Paparan</h2>
      <p>Menguji akumulasi dosis serap berdasarkan durasi tinggal (Stay Time)</p>
      
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Card bg="dark" text="white" className="p-4 border-secondary">
            <h5>Informasi Sumber</h5>
            <p>Isotop: {setupData.sourceType} | Jarak: {setupData.distance} m</p>
            <hr style={{ backgroundColor: '#fff' }} />
            
            <h3>⏱️ {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</h3>
            <p className="text-muted">Durasi Paparan (Menit:Detik)</p>
            
            <h2 className="text-warning mt-3">{accumulatedDose.toFixed(5)} µSv</h2>
            <p className="text-muted">Total Akumulasi Dosis Terabsorpsi</p>
            
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant={isRunning ? "danger" : "success"} onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? "Jeda (Pause)" : "Mulai Eksperimen"}
              </Button>
              <Button variant="warning" onClick={handleFinish}>
                Selesai & Lihat Hasil
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SimulationWaktu;
