import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/Reaktor.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Nuclearpedia2 = () => {
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
                  Reaktor Nuklir
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
                   IAEA (International Atomic Energy Agency, IAEA) mendefinisikan reaktor nuklir sebagai 
                   perangkat yang digunakan untuk menginisiasi dan mengendalikan reaksi berantai nuklir. 
                   Reaktor nuklir bisa digunakan untuk berbagai keperluan seperti pembangkitan listrik, penelitian ilmiah, 
                   dan produksi radioisotop untuk medis dan industri. Secara umum, reaktor nuklir berfungsi untuk mengendalikan 
                   reaksi fisi nuklir yang menghasilkan energi. Energi ini kemudian dapat digunakan untuk berbagai 
                   tujuan, mulai dari pembangkitan listrik hingga penelitian ilmiah dan produksi isotop untuk keperluan medis. 
                   Badan Riset dan Inovasi Nasional (BRIN) mengembangkan teknologi reaktor nuklir skala kecil yang disebut Small Modular Reactor (SMR). 
                   Reaktor ini dirancang untuk menghasilkan energi listrik dalam skala kecil dan modular, yang memungkinkannya untuk 
                   ditempatkan di berbagai lokasi. BRIN juga terlibat dalam pengembangan reaktor generasi IV yang menggunakan gas sebagai pendingin dan grafit sebagai moderator.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                   Proses menghasilkan listrik dari reaktor nuklir melibatkan beberapa tahapan kunci. 
                   Berikut adalah gambaran umum tentang bagaimana listrik dihasilkan dari reaktor nuklir:
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
                   1.	Reaksi Fisi Nuklir:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Reaksi fisi terjadi ketika inti atom berat (seperti uranium-235 atau plutonium-239) menyerap neutron dan 
                    kemudian terbelah menjadi dua inti yang lebih kecil, melepaskan energi dalam bentuk panas serta neutron baru 
                    yang dapat memicu reaksi berantai.<br/>
                    o	Energi yang dilepaskan dari reaksi fisi terutama berupa panas, yang digunakan untuk memanaskan air.

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
                   2.	Produksi Uap:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Panas yang dihasilkan dari reaksi fisi digunakan untuk memanaskan air
                     dalam sistem tertutup, biasanya dalam tabung yang disebut generator uap.<br/>
                    o	Air yang dipanaskan ini kemudian berubah menjadi uap bertekanan tinggi.
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
                    3.	Penggerakan Turbin:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Uap bertekanan tinggi diarahkan ke turbin, yang merupakan perangkat 
                    dengan bilah-bilah yang berputar ketika terkena aliran uap.<br/>
                    o	Ketika uap mengalir melalui turbin, energi panas dan tekanan dari uap diubah menjadi energi mekanik dalam bentuk putaran turbin.
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
                   4.	Pembangkit Listrik:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Turbin yang berputar ini dihubungkan ke generator listrik.<br/>
                    o	Generator mengubah energi mekanik dari turbin menjadi energi 
                    listrik melalui prinsip induksi elektromagnetik, di mana medan magnet yang bergerak di sekitar konduktor menghasilkan arus listrik.
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
                   5.	Pendinginan dan Sirkulasi Ulang:
                  </p><p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Setelah melewati turbin, uap kehilangan sebagian besar energinya 
                    dan dikondensasi kembali menjadi air menggunakan kondensor.<br/>
                    o	Air yang telah didinginkan kemudian dipompa kembali ke dalam reaktor untuk 
                    dipanaskan lagi, dan siklus ini berulang terus-menerus.
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
                    6.	Distribusi Listrik:
                  </p><p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    o	Listrik yang dihasilkan oleh generator dikirim ke transformator untuk meningkatkan tegangan sehingga dapat ditransmisikan melalui jaringan listrik dengan efisiensi tinggi.
                    o	Dari sana, listrik didistribusikan ke rumah, bisnis, dan industri.

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
                    Sumber (IAEA, World Nuclear Association, Nuclear Energy Institute)
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

export default Nuclearpedia2