import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import mascot from './game/assets/avatar/Bawah-Kanan.png';

const KenalanRekta = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/introsim');
  };

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif", minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <div className="header-box">
          <Row className="align-items-center justify-content-center text-center">
            <Col md={4} className="d-flex justify-content-center align-items-center mb-4 mb-md-0">
              <img src={mascot} alt="Rekta Mascot" className="img-fluid" style={{ maxWidth: '350px', maxHeight: '350px' }} />
            </Col>
            <Col md={8} style={{ textAlign: 'justify' }}>
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold", marginBottom: '30px', textAlign: 'center' }}>Kenalan dengan Rekta!</h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Halo! Aku "Rekta", pemandu radiasimu. Namaku adalah gabungan dari kata "Reaktor" dan "Tenaga", dua hal yang sangat penting dalam dunia nuklir. Aku adalah robot yang dirancang khusus untuk menemanimu menjelajahi zona radiasi dengan aman.
              </p>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'justify' }}>
                Misi utamaku adalah menjadi 'mata dan telinga' kamu. Aku dilengkapi dengan dosimeter untuk mengukur total paparan radiasi yang kamu terima dan surveymeter untuk mengetahui laju dosis di sekitarmu. Bersama-sama, kita akan belajar menerapkan prinsip proteksi radiasi yang paling penting: "Waktu, Jarak, dan Perisai".
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', marginTop: '20px'}}>
                <h5 style={{color: 'white'}}>Tahukah Kamu?</h5>
                <p style={{ fontSize: '1rem', marginBottom: '0'}}>
                  Inspirasiku datang dari reaktor-reaktor riset di Indonesia yang digunakan untuk penelitian dan produksi radioisotop untuk keperluan medis dan industri. Sama seperti energi reaktor yang harus dikelola dengan hati-hati, aku akan membantumu mengelola paparan radiasi serendah mungkin!
                </p>
              </div>
              <div className="text-center mt-5">
                <button
                  onClick={handleNext}
                  className="btn1 rounded-5"
                  style={{ padding: "15px 50px", cursor: 'pointer' }}
                >
                  Lanjut Pembekalan
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default KenalanRekta;
