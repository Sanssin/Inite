import { Container, Row, Col } from "react-bootstrap";
import React from "react";

import berli from "../assets/IMG_00691.jpg";
import nopal from "../assets/IMG_00641.jpg";
import adit from "../assets/IMG_00601.jpg";
import logo from "../assets/logo_inite.png";

export const Aboutcont = () => {
  return (
    <div className="tentang w-100 min-vh-100" style={{ background: "black" }}>
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="d-flex justify-content-center align-items-center"
              style={{ paddingTop: 100, paddingInline: "20px", maxWidth: 500 }}
            >
              <img
                className="img-fluid"
                style={{ width: "100%" }}
                src={logo}
                alt="logo"
              />
            </div>
          </Col>
          <Col></Col>
        </Row>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="100"
          className="d-flex justify-content-center align-items-center"
          style={{ paddingTop: 20, paddingBottom: 20 }}
        >
          <h1 style={{ fontWeight: "bold", color: "white" }}>Tentang Kami</h1>
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
          className=" d-flex justify-content-center align-items-center"
          style={{
            paddingBottom: 20,
            paddingInline: "50px",
            textAlign: "justify",
          }}
        >
          <Col style={{ maxWidth: 900, paddingBottom: "45px" }}>
            <p style={{ color: "white" }}>
              Indonesia Nuclear Interactive Website (INITE) adalah sebuah
              platform edukasi interaktif yang dirancang untuk masyarakat
              Indonesia, guna memberikan pemahaman yang mendalam dan mudah
              dipahami mengenai nuklir dan teknologi terkait. Website ini
              bertujuan untuk meningkatkan kesadaran dan pengetahuan publik
              tentang berbagai aspek energi nuklir serta aplikasinya dalam
              berbagai bidang. Di INITE, pengguna dapat menemukan berbagai
              artikel edukatif yang menjelaskan dasar-dasar ilmu nuklir, sejarah
              perkembangan teknologi nuklir, dan detail tentang reaktor nuklir,
              isotop, serta radiasi. Artikel-artikel ini disusun untuk
              memudahkan pembaca dari berbagai kalangan, baik yang awam maupun
              yang sudah memiliki pengetahuan dasar tentang nuklir. Selain
              artikel, INITE juga menyediakan berita terkini mengenai
              perkembangan terbaru di dunia nuklir. Pada platform ini, kami juga
              menawarkan fitur andalan kami, yaitu simulasi yang memudahkan
              masyarakat awam untuk memahami hal-hal terkait kenukliran. Dengan
              semua sumber daya yang lengkap dan dapat diakses oleh semua
              kalangan, INITE bertujuan untuk memberikan pandangan tentang
              nuklir yang aman dan ramah kepada masyarakat, serta memberdayakan
              masyarakat dengan pengetahuan yang dapat membantu mereka memahami
              dan mendukung penggunaan teknologi nuklir secara aman dan
              bertanggung jawab.{" "}
            </p>
          </Col>
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          className="d-flex justify-content-center align-items-center"
          style={{ paddingTop: 100, paddingBottom: 20 }}
        >
          <h1 style={{ fontWeight: "bold", color: "white" }}>Tim Bengkel Pesawat</h1>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ paddingInline: "40px", paddingBottom: 50 }}
        >
          <Row
            style={{
              gap: "20px",
              paddingInline: "40px",
              paddingBottom: "100px",
            }}
          >
            <Col
              data-aos="fade-up"
              data-aos-duration="500"
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 300,
                maxHeight: 430,
              }}
            >
              <div>
                <img
                  className="img-fluid rounded-5"
                  style={{ width: "100%" }} // make image responsive
                  src={adit}
                  alt="foto"
                />
              </div>
              <div
                style={{
                  padding: 10,
                  maxWidth: 700,
                  paddingInline: "20px",
                }}
              >
                <h5
                  style={{ fontWeight: "bold", color: "#ffff", marginTop: 0 }}
                >
                  Aditia Pawaid
                </h5>
                <p
                  style={{
                    color: "#ffff",
                    marginTop: 0,
                    textAlign: "justify",
                  }}
                >
                  Tukang Buat Simulator
                </p>
              </div>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="700"
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 300,
                maxHeight: 430, // add max-width for large screens
              }}
            >
              <div>
                <img
                  className="img-fluid rounded-5"
                  style={{ width: "100%" }} // make image responsive
                  src={nopal}
                  alt="foto"
                />
              </div>
              <div
                style={{
                  padding: 10,
                  maxWidth: 700,
                  paddingInline: "20px",
                }}
              >
                <h5
                  style={{ fontWeight: "bold", color: "#ffff", marginTop: 0 }}
                >
                  Naufal Avicena Taufiq
                </h5>
                <p
                  style={{
                    color: "#ffff",
                    marginTop: 0,
                    textAlign: "justify",
                  }}
                >
                  Tukang Buat Tampilan
                </p>
              </div>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="900"
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 300,
                maxHeight: 430, // add max-width for large screens
              }}
            >
              <div>
                <img
                  className="img-fluid rounded-5"
                  style={{ width: "100%" }} // make image responsive
                  src={berli}
                  alt="foto"
                />
              </div>
              <div
                style={{
                  padding: 10,
                  maxWidth: 700,
                  paddingInline: "20px",
                }}
              >
                <h5
                  style={{ fontWeight: "bold", color: "#ffff", marginTop: 0 }}
                >
                  Risqi Berliana Rahmantari
                </h5>
                <p
                  style={{
                    color: "#ffff",
                    marginTop: 0,
                    textAlign: "justify",
                  }}
                >
                  Tukang Buat Gado-Gado
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Aboutcont;
