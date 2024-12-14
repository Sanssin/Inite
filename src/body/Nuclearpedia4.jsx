import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/Interna.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Nuclearpedia4 = () => {
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
                  Radiasi Interna
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
                    Menurut International Atomic Energy Agency (IAEA), 
                    radiasi interna adalah radiasi pengion yang berasal dari 
                    sumber radioaktif yang telah masuk ke dalam tubuh manusia. 
                    Paparan ini dapat terjadi melalui berbagai cara, seperti:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Menelan: Mengonsumsi makanan atau minuman yang terkontaminasi radionuklida.<br/>
                    •	Menghirup: Menghirup udara yang terkontaminasi debu atau gas radioaktif.<br/>
                    •	Penyerapan kulit: Kontak langsung dengan kulit dengan bahan radioaktif, seperti melalui luka atau sayatan.<br/>
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                   Setelah masuk ke dalam tubuh, radionuklida dapat beredar 
                   melalui aliran darah dan sistem limfatik, dan terakumulasi di 
                   organ dan jaringan tertentu. Paparan radiasi interna ini dapat 
                   menyebabkan kerusakan sel dan jaringan, dan berpotensi meningkatkan risiko kanker 
                   dan masalah kesehatan lainnya.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                      fontWeight: "bold"
                    }}
                  >
                    Efek paparan radiasi interna tergantung pada beberapa faktor, antara lain:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Jenis radionuklida: Setiap jenis radionuklida memiliki sifat dan efek yang berbeda pada tubuh.<br/>
                    •	Jumlah radionuklida: Semakin banyak radionuklida yang masuk ke dalam tubuh, semakin besar risikonya 
                    mengalami efek kesehatan yang merugikan.<br/>
                    •	Lama paparan: Paparan radionuklida dalam waktu lama umumnya lebih berbahaya daripada paparan 
                    dalam waktu singkat.<br/>
                    •	Usia: Anak-anak dan bayi lebih sensitif terhadap efek radiasi daripada orang dewasa.<br/>
                    •	Kesehatan: Orang dengan sistem kekebalan yang lemah lebih berisiko mengalami efek kesehatan 
                    yang merugikan dari radiasi.

                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                      fontWeight: "bold"
                    }}
                  >
                    Pengendalian paparan radiasi interna fokus pada mencegah 
                    kontaminasi dan mengeluarkan radionuklida dari tubuh. 
                    Berikut beberapa cara pengendaliannya:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Pencegahan kontaminasi: Menerapkan langkah-langkah pencegahan kontaminasi seperti menggunakan APD yang tepat, menjaga kebersihan lingkungan kerja, dan menerapkan prosedur dekontaminasi yang efektif.<br/>
                    •	Pengurangan penyerapan: Mengurangi penyerapan radionuklida ke dalam tubuh dengan mengontrol jalur paparan (misalnya, pernapasan, pencernaan) dan menggunakan obat pengikat.<br/>
                    •	Peningkatan eliminasi: Mempercepat eliminasi radionuklida dari tubuh dengan mendorong ekskresi melalui urin, feses, atau keringat.<br/>
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    IAEA menyediakan berbagai panduan dan sumber daya tentang pengendalian radiasi interna, termasuk:
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
                    •	Basic Safety Standards for Protection against Ionizing Radiation and the Safety of Radiation Sources (https://www.iaea.org/resources/safety-standards)<br/>
                    •	Handbook on Radiological Protection (https://www-pub.iaea.org/MTCD/publications/PDF/PRTM-5_web.pdf)<br/>
                    •	Model for Estimating Doses to Internal Organs (https://www-pub.iaea.org/MTCD/publications/PDF/eprmedt/Day_1/Day_1-4.pps)
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

export default Nuclearpedia4