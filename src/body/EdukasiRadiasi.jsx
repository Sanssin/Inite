import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Accordion, Button, Card } from 'react-bootstrap';

const radiationLevels = [
  {
    level: 'Dosis Sangat Rendah (< 0.1 mSv atau 100 µSv)',
    sources: 'Radiasi latar alami (beberapa hari), makan sebuah pisang, rontgen gigi.',
    effects: 'Tidak ada efek kesehatan yang teramati atau terdeteksi. Risiko dianggap nol atau dapat diabaikan.'
  },
  {
    level: 'Dosis Rendah (0.1 - 10 mSv atau 100 - 10.000 µSv)',
    sources: 'Batas dosis tahunan untuk publik (1 mSv), CT scan seluruh tubuh, radiasi latar tahunan rata-rata global (~2.4 mSv).',
    effects: 'Efek stokastik (acak, berbasis probabilitas) seperti sedikit peningkatan risiko kanker seumur hidup. Efek ini tidak dapat dibedakan dari risiko kanker akibat faktor lain pada tingkat individu, hanya terdeteksi pada studi populasi besar.'
  },
  {
    level: 'Dosis Moderat (10 - 500 mSv atau 10.000 - 500.000 µSv)',
    sources: 'Batas dosis tahunan untuk pekerja radiasi (20-50 mSv), beberapa prosedur radioterapi.',
    effects: 'Peningkatan risiko kanker yang dapat diukur. Pada dosis mendekati 500 mSv, beberapa perubahan sementara pada sel darah dapat terdeteksi pada beberapa individu, namun belum ada gejala penyakit (efek deterministik) yang muncul.'
  },
  {
    level: 'Dosis Tinggi (0.5 - 2 Sv atau 500.000 - 2.000.000 µSv)',
    sources: 'Kecelakaan radiasi industri atau nuklir.',
    effects: 'Mulai munculnya efek deterministik (efek yang pasti terjadi di atas ambang batas dosis tertentu). Gejala ringan dari Sindrom Radiasi Akut (ARS) seperti mual dan muntah dapat muncul dalam beberapa jam hingga hari. Kerusakan pada sumsum tulang belakang dimulai, menyebabkan penurunan sel darah putih secara signifikan.'
  },
  {
    level: 'Dosis Sangat Tinggi (2 - 5 Sv)',
    sources: 'Paparan parah akibat kecelakaan nuklir.',
    effects: 'Gejala ARS yang parah. Kerusakan sumsum tulang belakang yang berat, meningkatkan risiko infeksi fatal karena kekurangan sel darah putih. Tanpa perawatan medis intensif, tingkat kematian sekitar 50% pada dosis 4.5 Sv (LD50/30 - Dosis Letal untuk 50% populasi dalam 30 hari).'
  },
  {
    level: 'Dosis Ekstrem (> 5 Sv)',
    sources: 'Paparan sangat dekat dengan inti reaktor saat kecelakaan atau ledakan nuklir.',
    effects: 'Kematian hampir pasti terjadi. Pada 5-10 Sv, kematian biasanya disebabkan oleh kegagalan sumsum tulang dan sistem pencernaan dalam beberapa minggu. Di atas 10-20 Sv, kerusakan parah pada sistem saraf pusat menyebabkan kematian dalam beberapa jam hingga hari.'
  }
];

const EdukasiRadiasi = () => {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
    border: '1px solid #fd7e14',
    color: 'white'
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", background: '#000000', color: 'white', padding: '50px 0 60px 0' }}>
      <Container>
        <div className="header-box">
          <Row className="justify-content-center">
            <Col md={9}>
              <Card style={cardStyle}>
                <Card.Header>
                  <h1 style={{ color: '#E0CC0B', fontWeight: 'bold', textAlign: 'center' }}>Efek Dosis Radiasi ke Tubuh</h1>
                </Card.Header>
                <Card.Body>
                  <Accordion defaultActiveKey="0" flush>
                    {radiationLevels.map((item, index) => (
                      <Accordion.Item eventKey={String(index)} key={index} style={{ backgroundColor: 'transparent', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <Accordion.Header>{item.level}</Accordion.Header>
                        <Accordion.Body style={{ textAlign: 'justify' }}>
                          <p><strong>Sumber Paparan Umum:</strong> {item.sources}</p>
                          <p><strong>Efek pada Tubuh:</strong> {item.effects}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
              <div className="text-center mt-4">
                <button type="button" className="btn1 rounded-5" style={{ padding: "15px 50px" }} onClick={() => navigate(-1)}>
                  Kembali
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default EdukasiRadiasi;
