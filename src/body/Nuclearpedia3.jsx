import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/radiography-testing-500x500.webp";
import arrow from "../assets/Arrow left-circle.png";

export const Nuclearpedia3 = () => {
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
                  Radiasi Eksterna
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
                    Menurut Nuclear Association, radiasi eksterna adalah radiasi pengion yang berasal
                     dari sumber eksternal ke tubuh manusia. Radiasi ini dapat menembus tubuh dan menyebabkan kerusakan pada sel dan jaringan.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Ada tiga jenis radiasi eksterna:
                  </p>                  
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Radiasi alfa: Radiasi alfa terdiri dari partikel bermuatan positif 
                    yang disebut partikel alfa. Partikel alfa memiliki daya tembus yang rendah 
                    dan hanya dapat menembus beberapa sentimeter udara atau kulit. 
                    Namun, jika radiasi alfa tertelan atau terhirup, mereka dapat menyebabkan 
                    kerusakan serius pada organ internal. <br/>
                    •	Radiasi beta: Radiasi beta terdiri dari elektron atau positron 
                    (partikel anti-elektron). Partikel beta memiliki daya tembus yang lebih tinggi 
                    daripada partikel alfa dan dapat menembus beberapa meter udara atau beberapa 
                    sentimeter jaringan.<br/>
                    •	Radiasi gamma: Radiasi gamma adalah radiasi elektromagnetik energi tinggi 
                    yang tidak memiliki massa atau muatan. Radiasi gamma memiliki daya tembus tertinggi 
                    dari semua jenis radiasi dan dapat menembus beberapa meter beton atau beberapa sentimeter 
                    timbal.
                  </p>                 
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Paparan radiasi eksterna dapat terjadi dalam berbagai situasi, termasuk:
                  </p>                  
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Bekerja dengan bahan radioaktif: Orang yang bekerja dengan bahan radioaktif 
                    berisiko terpapar radiasi eksterna. Ini termasuk pekerja di pembangkit listrik tenaga nuklir, 
                    fasilitas medis, dan laboratorium penelitian.<br/>
                    •	Paparan medis: Pasien yang menjalani tes atau perawatan medis yang melibatkan radioaktif 
                    berisiko terpapar radiasi eksterna. Ini termasuk sinar-X, CT scan, dan terapi radiasi.<br/>
                    •	Kecelakaan nuklir: Kecelakaan nuklir dapat menyebabkan pelepasan radiasi eksterna ke lingkungan. 
                    Ini dapat berdampak pada orang-orang yang tinggal di dekat lokasi kecelakaan, serta orang-orang yang terkena kontaminasi radioaktif.
                  </p>                  
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                   Efek paparan radiasi eksterna tergantung pada sejumlah faktor, termasuk:<br/><br/>
                    •	Jenis radiasi: Radiasi alfa, beta, dan gamma memiliki efek yang berbeda pada tubuh.<br/>
                    •	Jumlah paparan: Semakin banyak radiasi yang diterima seseorang, semakin besar risikonya mengalami efek kesehatan yang merugikan.<br/>
                    •	Lama paparan: Paparan radiasi dalam waktu singkat umumnya kurang berbahaya daripada paparan radiasi dalam waktu lama.<br/>
                    •	Usia: Anak-anak dan bayi lebih sensitif terhadap efek radiasi daripada orang dewasa.<br/>
                    •	Kesehatan: Orang dengan sistem kekebalan yang lemah lebih berisiko mengalami efek kesehatan yang merugikan dari radiasi.

                  </p>                  
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Efek kesehatan paparan radiasi eksterna dapat berkisar dari 
                    ringan hingga parah. Efek ringan termasuk kelelahan, mual, dan muntah. 
                    Efek parah termasuk kanker, kerusakan organ, dan kematian.<br/><br/>
                    Ada sejumlah cara untuk mengurangi risiko paparan radiasi eksterna, termasuk:<br/>
                    <br/>
                    •	Membatasi waktu paparan: Semakin sedikit waktu yang dihabiskan 
                    seseorang di dekat sumber radiasi, semakin kecil risikonya terpapar. <br/>
                    •	Meningkatkan jarak: Semakin jauh seseorang dari sumber radiasi, 
                    semakin kecil paparannya.<br/>
                    •	Melindungi diri: Perisai timbal atau bahan lain dapat digunakan untuk melindungi 
                    tubuh dari radiasi.<br/>
                    •	Memantau paparan: Orang yang bekerja dengan bahan radioaktif harus memantau paparan mereka dengan dosimeter.
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
                   Sumber: (IAEA)
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

export default Nuclearpedia3