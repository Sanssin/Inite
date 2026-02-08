import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo_inite.png";
import adit from "../assets/adit.jpg";
import nopal from "../assets/nopal.jpg";
import berli from "../assets/berli.jpg";
import ihsan from "../assets/ihsan.png";
import evita from "../assets/evita.png";
import husein from "../assets/husein.png";

export const Aboutcont = () => {
  const { t } = useTranslation('about');

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
          <h1 style={{ fontWeight: "bold", color: "white" }}>{t('title')}</h1>
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
              {t('description')}
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
          <h1 style={{ fontWeight: "bold", color: "white" }}>{t('team1Name')}</h1>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ paddingInline: "40px", paddingBottom: 50 }}
        >
          <Row className="text-center text-white justify-content-center">
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <img
                src={nopal}
                alt="Nopal"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Naufal Avicena Taufiq</h4>
              <p>{t('member')}</p>
            </Col>
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <img
                src={adit}
                alt="Adit"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Aditya Pawaid</h4>
              <p>{t('leader')}</p>
            </Col>
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <img
                src={berli}
                alt="Berli"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Risqi Berliana Rahmantari</h4>
              <p>{t('member')}</p>
            </Col>
          </Row>
        </div>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          className="d-flex justify-content-center align-items-center"
          style={{ paddingTop: 100, paddingBottom: 20 }}
        >
          <h1 style={{ fontWeight: "bold", color: "white" }}>{t('team2Name')}</h1>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ paddingInline: "40px", paddingBottom: 50 }}
        >
          <Row className="text-center text-white justify-content-center">
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <img
                src={husein}
                alt="Husein"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Husein Kurnia Riyadinata</h4>
              <p>{t('member')}</p>
            </Col>
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <img
                src={ihsan}
                alt="Ihsan"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Nur Ihsanudin</h4>
              <p>{t('leader')}</p>
            </Col>
            <Col
              md={4}
              className="mb-4"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <img
                src={evita}
                alt="Evita"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "300px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <h4 className="mt-3">Evita Rahmadani</h4>
              <p>{t('member')}</p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Aboutcont;
