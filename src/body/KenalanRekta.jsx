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
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Container fluid className="px-0">
        <div className="header-box mx-0">
          <Row className="align-items-center justify-content-center w-100 mx-0">
            <Col lg={4} md={5} className="d-flex justify-content-center align-items-center mb-2 mb-md-0 order-1 order-md-1 px-2">
              <img 
                src={mascot} 
                alt="Rekta Mascot" 
                className="img-fluid" 
                style={{ maxWidth: '300px', maxHeight: '300px', width: '100%', height: 'auto' }} 
              />
            </Col>
            <Col lg={8} md={7} className="order-2 order-md-2 px-2" style={{ textAlign: 'justify' }}>
              <h1 style={{ color: "#E0CC0B", fontWeight: "bold", textAlign: 'center' }}>Kenalan dengan Rekta!</h1>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Halo! Aku "Rekta", pemandu radiasimu. Namaku adalah gabungan dari kata "Reaktor" dan "Tenaga", dua hal yang sangat penting dalam dunia nuklir. Aku adalah robot yang dirancang khusus untuk menemanimu menjelajahi zona radiasi dengan aman.
              </p>
              <p style={{ fontSize: '1.1rem', textAlign: 'justify', lineHeight: '1.6' }}>
                Misi utamaku adalah menjadi 'mata dan telinga' kamu. Aku dilengkapi dengan dosimeter untuk mengukur total paparan radiasi yang kamu terima dan surveymeter untuk mengetahui laju dosis di sekitarmu. Bersama-sama, kita akan belajar menerapkan prinsip proteksi radiasi yang paling penting: "Waktu, Jarak, dan Perisai".
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px'}}>
                <h5 style={{color: 'white'}}>Tahukah Kamu?</h5>
                <p style={{ fontSize: '1rem', marginBottom: '0', lineHeight: '1.5'}}>
                  Inspirasiku datang dari reaktor-reaktor riset di Indonesia yang digunakan untuk penelitian dan produksi radioisotop untuk keperluan medis dan industri. Sama seperti energi reaktor yang harus dikelola dengan hati-hati, aku akan membantumu mengelola paparan radiasi serendah mungkin!
                </p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  onClick={handleNext}
                  className="btn1 rounded-5"
                  style={{ cursor: 'pointer' }}
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
