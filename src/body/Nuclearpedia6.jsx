import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/Gamma.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Nuclearpedia6 = () => {
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
                  Sinar Gamma
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
                    Menurut Asosiasi Nuklir Dunia (World Nuclear Association, WNA), 
                    radiasi gamma adalah jenis radiasi elektromagnetik energi tinggi yang 
                    berasal dari inti atom yang mengalami peluruhan radioaktif. Radiasi gamma 
                    tidak memiliki massa atau muatan dan memiliki panjang gelombang terpendek dan 
                    energi tertinggi di antara semua gelombang elektromagnetik. Hal ini membuat radiasi 
                    gamma sangat menembus, mampu menembus beberapa meter beton atau beberapa sentimeter timah.
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
                    Karakteristik utama radiasi gamma:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                  •	Energi tinggi: Radiasi gamma memiliki energi 
                  tertinggi di antara semua gelombang 
                  elektromagnetik, memungkinkannya menembus materi lebih dalam 
                  daripada jenis radiasi lainnya. <br/>
                  •	Panjang gelombang pendek: Radiasi gamma memiliki panjang 
                  gelombang terpendek di antara semua gelombang elektromagnetik, 
                  memungkinkannya bergerak dalam garis lurus dan tidak mudah terhambat 
                  oleh materi. <br/>
                  •	Tanpa massa atau muatan: Radiasi gamma tidak memiliki massa atau muatan, 
                  membuatnya tidak terpengaruh oleh medan listrik atau magnet.
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
                    Sumber radiasi gamma:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Peluruhan radioaktif: Radiasi gamma dilepaskan 
                    dari inti atom yang mengalami peluruhan radioaktif. 
                    Peluruhan radioaktif adalah proses di mana inti atom 
                    yang tidak stabil berubah menjadi inti atom yang lebih 
                    stabil dengan melepaskan energi dalam bentuk partikel atau radiasi.<br/>
                    •	Kosmik ray: Kosmik ray adalah partikel berenergi tinggi
                     yang berasal dari luar tata surya. 
                     Ketika kosmik ray berinteraksi dengan atmosfer Bumi, mereka 
                     dapat menghasilkan radiasi gamma.<br/>
                    •	Reaksi nuklir: Radiasi gamma dilepaskan dalam reaksi nuklir, 
                    seperti fisi dan fusi nuklir. Fisi nuklir adalah proses di mana 
                    inti atom yang besar dipecah menjadi dua inti atom yang lebih kecil, 
                    melepaskan energi dalam bentuk panas, cahaya, dan radiasi. Fusi nuklir 
                    adalah proses di mana dua inti atom yang kecil bergabung untuk membentuk 
                    inti atom yang lebih besar, melepaskan energi dalam bentuk panas, cahaya, 
                    dan radiasi.<br/>
                    •	Sumber buatan manusia: Radiasi gamma juga digunakan dalam berbagai aplikasi 
                    buatan manusia, seperti radioterapi, pencitraan medis, dan sterilisasi.
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
                  Efek radiasi gamma pada kesehatan manusia:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Sindrom radiasi akut: Paparan radiasi gamma dosis tinggi 
                    dalam waktu singkat dapat menyebabkan sindrom radiasi akut, 
                    dengan gejala seperti mual, muntah, diare, kelelahan, dan kerontokan 
                    rambut. Dalam kasus yang parah, sindrom radiasi akut dapat berakibat fatal.<br/>
                    •	Kerusakan sel dan DNA: Radiasi gamma dapat merusak sel dan DNA, 
                    meningkatkan risiko kanker dan masalah kesehatan lainnya.<br/>
                    •	Penurunan sistem kekebalan tubuh: Paparan radiasi gamma dapat 
                    melemahkan sistem kekebalan tubuh, membuat individu lebih rentan terhadap 
                    infeksi dan penyakit.
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
                    Perlindungan terhadap radiasi gamma:
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Waktu: Semakin sedikit waktu yang dihabiskan terpapar 
                    radiasi gamma, semakin rendah risikonya.<br/>
                    •	Jarak: Semakin jauh dari sumber radiasi gamma, semakin 
                    rendah risikonya.<br/>
                    •	Perisai: Bahan pelindung seperti timah atau beton dapat 
                    memblokir radiasi gamma.<br/>
                    •	Peralatan pelindung diri: Peralatan pelindung diri seperti 
                    sarung tangan, kacamata, dan respirator dapat membantu melindungi 
                    individu dari radiasi gamma.
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
                    Sumber: WNA (World Nuclear Association)
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

export default Nuclearpedia6