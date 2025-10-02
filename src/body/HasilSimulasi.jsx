import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';

const getDoseEffect = (dose) => {
  if (dose <= 0.1) {
    return {
      level: 'Sangat Rendah',
      description: 'Dosis yang Anda terima sangat rendah, setara atau bahkan lebih rendah dari dosis yang diterima dari satu buah pisang (yang mengandung Kalium-40).',
      effects: 'Tidak ada efek kesehatan yang dapat dideteksi. Jauh di bawah batas aman.',
      variant: 'success'
    };
  } else if (dose <= 10) {
    return {
      level: 'Rendah',
      description: 'Setara dengan dosis dari beberapa kali perjalanan pesawat antar benua atau beberapa kali rontgen gigi.',
      effects: 'Risiko kesehatan pada tingkat ini dianggap dapat diabaikan dan tidak terdeteksi secara statistik.',
      variant: 'success'
    };
  } else if (dose <= 100) {
    return {
      level: 'Moderat',
      description: 'Anda telah menerima dosis yang setara dengan beberapa prosedur CT scan. Ini masih dalam rentang variasi radiasi latar tahunan di berbagai belahan dunia.',
      effects: 'Risiko stokastik (misalnya kanker) sedikit meningkat, namun sangat sulit untuk dibedakan dari risiko populasi umum. Batas dosis tahunan untuk masyarakat umum adalah 1000 µSv (1 mSv).',
      variant: 'warning'
    };
  } else if (dose <= 500) {
    return {
      level: 'Tinggi',
      description: 'Dosis ini berada di atas batas tahunan untuk masyarakat umum. Pekerja radiasi memiliki batas yang lebih tinggi (rata-rata 20.000 µSv per tahun).',
      effects: 'Peningkatan risiko kanker yang dapat diukur secara statistik jika paparan seperti ini terjadi berulang kali. Tidak ada efek deterministik (mual, kemerahan kulit) yang akan muncul.',
      variant: 'danger'
    };
  } else {
    return {
      level: 'Sangat Tinggi',
      description: 'Anda telah menerima dosis yang signifikan. Tingkat ini memerlukan pemantauan dan evaluasi lebih lanjut dalam skenario nyata.',
      effects: 'Risiko jangka panjang (stokastik) meningkat secara signifikan. Semakin tinggi dosis, semakin besar risikonya. Mendekati tingkat di mana efek deterministik awal (seperti perubahan pada darah) dapat mulai terdeteksi pada individu yang sensitif.',
      variant: 'danger'
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

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #fd7e14',
    color: 'white'
  };

  const listGroupItemStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    padding: '1rem 1.25rem'
  }

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: 'white', paddingBottom: '60px' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: '#E0CC0B', fontWeight: 'bold', marginBottom: '30px' }}>Hasil Misi Survei Radiasi</h1>
              <Card style={cardStyle}>
                <Card.Header as="h4" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>Total Dosis Diterima</Card.Header>
                <Card.Body style={{ padding: '30px' }}>
                  <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#E0CC0B' }}>
                    {totalDose.toFixed(4)} µSv
                  </p>
                  <ListGroup variant="flush" className="mt-4 text-start">
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>Tingkat Paparan:</strong> <Badge bg={result.variant} className="ms-2">{result.level}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>Deskripsi:</strong> {result.description}
                    </ListGroup.Item>
                    <ListGroup.Item style={listGroupItemStyle}>
                      <strong>Potensi Efek Biologis:</strong> {result.effects}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px" }} onClick={() => navigate('/edukasi-radiasi')}>
                  Pelajari Efek Radiasi
                </button>
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 30px" }} onClick={handleRestart}>
                  Ulangi Misi
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HasilSimulasi;
