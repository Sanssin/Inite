import { Container, Row, Col } from "react-bootstrap"
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/Surveymeter1.jpg"
import arrow from "../assets/Arrow left-circle.png"

export const Nuclearpedia = () => {

  let navigate = useNavigate();

  return (
    <div className="nukped w-100 min-vh-100" style={{ background: "black" }}>
      <Container>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className="d-flex justify-content-center align-items-center" style={{ paddingTop: 100, paddingBottom:0 }}>
          <h1 style={{ fontWeight: "bold", color: "white" }}>Nuclearpedia</h1>
        </div>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className=" d-flex justify-content-center align-items-center" style={{ paddingBottom:20 }}>
          <p style={{ color: "white" }}>Mari cari tau, apa itu nuklir?</p>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ paddingInline:"60px", paddingBottom: 50 }}>
          <Row >
            <Col
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 900, // add max-width for large screens
              }}
            >
              <div>
                <img
                  className="img-fluid rounded-5"
                  style={{ width: "100%" }} // make image responsive
                  src={poto}
                  alt="foto"
                />
              </div>
              <div
                style={{
                  padding: 20,
                  maxWidth: 1000, // add max-width for large screens
                }}
              >
                <h2 style={{ fontWeight: "bold", color: "#ffff", marginLeft: 20, marginTop: 20 }}>
                  Surveymeter
                </h2>
                <div style={{paddingRight:20}}>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Surveymeter adalah alat ukur yang digunakan untuk mendeteksi dan mengukur tingkat radiasi di lingkungan.
                    Alat ini termasuk portabel, sehingga praktis digunakan. Surveymeter dapat mengukur tingkat radiasi karena
                    terdapat detector di dalamnya. Ada 3 jenis detektor yang umum digunakan, antara lain Geiger Muller, Sintilasi,
                    dan Kamar Ionisasi.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    - Geiger Muller : Detektor Geiger Muller bekerja secara prinsip ionisasi. Radiasi yang masuk ke dalam tabung,
                    akan bereaksi dengan gas di dalam tabung. Bentuk ionisasi tersebut dapat dialirkan dan menghasilkan pulsa listrik.
                    Karena Geiger Muller sensitif terhadap radiasi, sehingga detector ini tidak dapat membedakan energi radiasi yang terukur.<br />
                    - Sintilasi : Detektor Sintilasi menghasilkan cahaya Ketika dihantap radiasi, dan cahaya ini diukur oleh Photomultiplier Tube (PMT)<br />
                    - Kamar Ionisasi : Kamar Ionisasi mengukur jumlah ion yang dihasilkan Ketika radiasi berinteraksi dengan gas di dalam kamar.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Surveymeter adalah alat yang penting sebagai bentuk proteksi terhadap bahaya radiasi. Dalam pengoperasiannya surveymeter perlu dikalibrasi secara berkala. Menurut Perka Bapeten No 1 Tahun 2006 Kalibrasi surveymeter umumnya dilakukan setiap tahun sekali. Surveymeter yang sering digunakan harus lebih sering dikalibrasi daripada yang jarang digunakan. Kalibrasi dilakukan untuk menjaga tingkat akurasi surveymeter. Beberapa metode kalibrasi yang dilakukan terdiri dari 2 metode , yaitu menggunakan surveymeter standar dan sumber standar.
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                      fontStyle: "italic"
                    }}
                  >
                    Sumber: IAEA (International Atomic Energy Agency, IAEA)
                    </p>
                </div>
              </div>
            </Col>
            </Row>
        </div>
        <div data-aos="fade-up" data-aos-duration="500" className="back" style={{ paddingTop: 0, paddingLeft: 150, paddingBottom: 40 }}>
          <img
            className="img-fluid"
            style={{ width: 80, cursor: "pointer" }}
            src={arrow}
            alt="x"
            onClick={() => navigate('/')}
          />
        </div>
      </Container>
    </div>
  )
}

export default Nuclearpedia