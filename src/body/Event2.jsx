import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/desak.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Event2 = () => {
  let navigate = useNavigate();

  return (
    <div className="nukped w-100 min-vh-100" style={{ background: "black" }}>
      <Container>
        <div style={{ paddingInline:"40px", paddingTop: 100, paddingBottom:20 }}>
          <h1 style={{ fontWeight: "bold", color: "white" }}>Event</h1>
          <p style={{ color: "white" }}> Tempat Berita Terkini</p>
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
                    Indonesia Nuclear Youth Society Akan Gelar Seminar Desak Nuklir!
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
                    Komunitas Nuklir Muda Indonesia (INYS) adalah organisasi non profit yang berfokus pada pemberdayaan pemuda
                    untuk mendukung kedaulatan energi dan program transisi energi bersih melalui tenaga nuklir di Indonesia.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Sehubungan dengan akan dibangunnya PLTN tenaga Thorium di Indonesia, INYS berkesempatan untuk mengadakan seminar 
                    desak nuklir dengan narasumber hebat Bapak Prof.Dr.Ir.Anhar Riza Antariksawan sebagai Peneliti Ahli Utama BRIN. 
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Dalam seminar tersebut akan dibahas lebih dekat dengan
                     pengertian energi nuklir dan bagaimana implementasi teknologi ini dapat mendukung Indonesia lebih Hijau.
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Seminar ini akan diadakan terbuka untuk umum, di Caffe Kolektif Yogyakarta. 
                    Peserta akan mendapatkan benefit berupa lunch,merchandise, seritifikat, dan reward bagi perserta penanya terbaik!
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Bagi Peserta yang Berminat dapat melakukan registrasi di:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                      fontWeight: "bold",
                    }}
                  >
                    https://bit.ly/DesakNuklir
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Jangan lewatkan kesempatan ini!
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Jadilah generasi yang berwawasan luas tentang nuklir!
                    </p>
                </div>
              </div>
            </Col>
            </Row>
        </div>
        <div className="back" style={{ paddingTop: 0, paddingLeft: 150, paddingBottom: 40 }}>
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

export default Event2