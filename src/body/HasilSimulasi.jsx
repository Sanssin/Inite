import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const getDoseEffect = (dose) => {
  if (dose <= 0.1) {
    return {
      level: 'Sangat Rendah',
      description: 'Dosis yang Anda terima sangat rendah, setara atau bahkan lebih rendah dari dosis yang diterima dari satu buah pisang (yang mengandung Kalium-40).',
      effects: 'Tidak ada efek kesehatan yang dapat dideteksi. Jauh di bawah batas aman.',
      color: '#28a745' // Green
    };
  } else if (dose <= 10) {
    return {
      level: 'Rendah',
      description: 'Setara dengan dosis dari beberapa kali perjalanan pesawat antar benua atau beberapa kali rontgen gigi.',
      effects: 'Risiko kesehatan pada tingkat ini dianggap dapat diabaikan dan tidak terdeteksi secara statistik.',
      color: '#28a745' // Green
    };
  } else if (dose <= 100) {
    return {
      level: 'Moderat',
      description: 'Anda telah menerima dosis yang setara dengan beberapa prosedur CT scan. Ini masih dalam rentang variasi radiasi latar tahunan di berbagai belahan dunia.',
      effects: 'Risiko stokastik (misalnya kanker) sedikit meningkat, namun sangat sulit untuk dibedakan dari risiko populasi umum. Batas dosis tahunan untuk masyarakat umum adalah 1000 µSv (1 mSv).',
      color: '#ffc107' // Yellow
    };
  } else if (dose <= 500) {
    return {
      level: 'Tinggi',
      description: 'Dosis ini berada di atas batas tahunan untuk masyarakat umum. Pekerja radiasi memiliki batas yang lebih tinggi (rata-rata 20.000 µSv per tahun).',
      effects: 'Peningkatan risiko kanker yang dapat diukur secara statistik jika paparan seperti ini terjadi berulang kali. Tidak ada efek deterministik (mual, kemerahan kulit) yang akan muncul.',
      color: '#fd7e14' // Orange
    };
  } else {
    return {
      level: 'Sangat Tinggi',
      description: 'Anda telah menerima dosis yang signifikan. Tingkat ini memerlukan pemantauan dan evaluasi lebih lanjut dalam skenario nyata.',
      effects: 'Risiko jangka panjang (stokastik) meningkat secara signifikan. Semakin tinggi dosis, semakin besar risikonya. Mendekati tingkat di mana efek deterministik awal (seperti perubahan pada darah) dapat mulai terdeteksi pada individu yang sensitif.',
      color: '#dc3545' // Red
    };
  }
};

const HasilSimulasi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalDose } = location.state || { totalDose: 0 };

  const result = getDoseEffect(totalDose);

  const handleRestart = () => {
    navigate('/setup');
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: '100vh', background: '#212529', color: 'white', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 style={{ color: '#E0CC0B', fontWeight: 'bold', marginBottom: '20px' }}>Hasil Misi Survei Radiasi</h1>
            <Card style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid ${result.color}` }}>
              <Card.Body style={{ padding: '30px' }}>
                <Card.Title as="h4">Total Dosis yang Diterima</Card.Title>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: result.color }}>
                  {totalDose.toFixed(4)} µSv
                </p>
                <hr style={{ backgroundColor: 'white' }} />
                <div style={{ textAlign: 'left', marginTop: '20px' }}>
                  <p><strong>Tingkat Paparan:</strong> <span style={{ color: result.color, fontWeight: 'bold' }}>{result.level}</span></p>
                  <p><strong>Deskripsi:</strong> {result.description}</p>
                  <p><strong>Potensi Efek Biologis:</strong> {result.effects}</p>
                </div>
              </Card.Body>
            </Card>
            <Button variant="warning" size="lg" onClick={handleRestart} style={{ marginTop: '30px' }}>
              Coba Misi Lain
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HasilSimulasi;
