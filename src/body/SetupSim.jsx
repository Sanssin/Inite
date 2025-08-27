import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form } from "react-bootstrap";

const SetupSim = () => {
  const navigate = useNavigate();
  const [sourceType, setSourceType] = useState('cs-137');
  const [initialActivity, setInitialActivity] = useState(10);
  const [shieldingMaterial, setShieldingMaterial] = useState('lead');
  const [shieldingThickness, setShieldingThickness] = useState(5);

  const handleStart = () => {
    const setupData = {
      sourceType,
      initialActivity,
      shieldingMaterial,
      shieldingThickness
    };
    navigate('/game', { state: { setupData } });
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", display: 'flex', alignItems: 'center' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold", marginBottom: '30px' }}>Pengaturan Misi Simulasi</h1>
              <div style={{textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px'}}>
                <h4 style={{color: 'white'}}>Misi Anda:</h4>
                <p>Anda ditugaskan untuk melakukan survei radiasi di sebuah fasilitas. Tugas utama Anda adalah <strong>mengukur laju dosis</strong> di lokasi yang telah ditentukan (ditandai dengan kotak khusus dalam simulasi). Gunakan pengetahuan dari materi pembekalan untuk menjaga dosis total yang Anda terima serendah mungkin.</p>
                <p>Atur parameter simulasi di bawah ini untuk memulai.</p>
              </div>

              <Form className="mt-4" style={{textAlign: 'left'}}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold'}}>Sumber Radiasi Gamma:</Form.Label>
                  <Col sm={8}>
                    <Form.Select value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
                      <option value="cs-137">Caesium-137 (Cs-137)</option>
                      <option value="co-60">Cobalt-60 (Co-60)</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold'}}>Aktivitas Awal (Ci):</Form.Label>
                  <Col sm={8}>
                    <Form.Control type="number" value={initialActivity} onChange={(e) => setInitialActivity(parseFloat(e.target.value))} min="1" max="100" />
                    <Form.Text muted>Masukkan nilai antara 1 - 100 Curie (Ci).</Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold'}}>Bahan Perisai (Shielding):</Form.Label>
                  <Col sm={8}>
                    <Form.Select value={shieldingMaterial} onChange={(e) => setShieldingMaterial(e.target.value)}>
                      <option value="lead">Timbal (Lead)</option>
                      <option value="concrete">Beton (Concrete)</option>
                      <option value="water">Air (Water)</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} style={{fontWeight: 'bold'}}>Tebal Perisai (cm):</Form.Label>
                  <Col sm={8}>
                    <Form.Control type="number" value={shieldingThickness} onChange={(e) => setShieldingThickness(parseFloat(e.target.value))} min="1" max="50" />
                     <Form.Text muted>Masukkan nilai antara 1 - 50 cm.</Form.Text>
                  </Col>
                </Form.Group>

                <div className="text-center mt-5">
                    <button type="button" onClick={handleStart} className="btn1 rounded-5" style={{ padding: "15px 50px", cursor: 'pointer' }}>
                        Mulai Misi
                    </button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default SetupSim;