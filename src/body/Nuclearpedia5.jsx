import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/SifatRad.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Nuclearpedia5 = () => {
  let navigate = useNavigate();

  return (
    <div className="nukped w-100 min-vh-100" style={{ background: "black" }}>
      <Container>
      <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className="d-flex justify-content-center align-items-center" style={{ paddingTop: 100, paddingBottom:0 }}>
          <h1 style={{ fontWeight: "bold", color: "white" }}>Nuclearpedia</h1>
      </div>
      <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className="d-flex justify-content-center align-items-center" style={{ paddingBottom:20 }}>
          <p style={{ color: "white" }}>Mari cari tau, apa itu nuklir?</p>
      </div>
        <div className="d-flex justify-content-center align-items-center" style={{ paddingInline:"40px", paddingBottom: 50 }}>
          <Row >
            <Col
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 1000, // add max-width for large screens
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
                  Sifat Radiasi
                </h2>
                <div style={{paddingRight:20}}>
                  <h4
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                  Sifat Radiasi Menurut IAEA
                  </h4>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Menurut Badan Tenaga Atom Internasional (IAEA), 
                    radiasi adalah pelepasan energi dalam bentuk 
                    gelombang atau partikel dari inti atom yang tidak
                     stabil. Radiasi dapat diklasifikasikan menjadi dua 
                     jenis utama:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Radiasi non-ionisasi: Jenis radiasi ini tidak memiliki cukup energi untuk melepaskan elektron 
                    dari atom, sehingga tidak dianggap berbahaya bagi kesehatan manusia. Contoh radiasi non-ionisasi termasuk 
                    gelombang radio, gelombang mikro, dan radiasi inframerah.<br/>
                    •	Radiasi pengion: Jenis radiasi ini memiliki cukup energi untuk melepaskan elektron dari atom, 
                    menciptakan ion. Hal ini dapat merusak sel dan DNA, sehingga radiasi pengion dapat berbahaya bagi 
                    kesehatan manusia. Contoh radiasi pengion termasuk partikel alfa, partikel beta, sinar gamma, dan sinar-X.
                  </p>
                  <h4
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                  Sifat Radiasi Pengion yang Menentukan Potensi Bahayanya
                  </h4>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Sifat radiasi pengion yang menentukan potensinya untuk menyebabkan bahaya bagi kesehatan manusia meliputi:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  > •	Jenis radiasi: Partikel alfa, partikel beta, sinar gamma, dan sinar-X memiliki sifat yang berbeda dan dapat menyebabkan jenis kerusakan sel yang berbeda.<br/>
                    •	Energi: Semakin tinggi energi radiasi, semakin banyak kerusakan yang dapat ditimbulkannya.<br/>
                    •	Jangkauan: Jangkauan adalah jarak yang dapat ditempuh radiasi melalui materi. Partikel alfa memiliki jangkauan pendek, sedangkan sinar gamma dapat menempuh jarak yang sangat jauh. <br/>
                    •	Efektivitas biologis: Efektivitas biologis adalah ukuran kemampuan relatif berbagai jenis radiasi untuk merusak sel. Partikel alfa lebih efektif secara biologis daripada partikel beta dan sinar gamma. <br/>
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
                  (Sumber: IAEA)
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

export default Nuclearpedia5