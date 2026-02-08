import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const Kontak = () => {
  const { t } = useTranslation('contact');

  return (
    <div className="kontak w-100 min-vh-100" style={{ background: "black" }}>
      <Container>
        <Row>
          <Col data-aos="fade-up" data-aos-duration="1000">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ paddingTop: 100, paddingBottom: 50 }}
            >
              <h1 style={{ fontWeight: "bold", color: "white" }}>
                {t('title')}
              </h1>
            </div>
          </Col>
        </Row>
        <Row style={{ paddingBottom: "40px" }}>
          <Col
            style={{
              background: "#5B5A5A",
              padding: 0,
              maxWidth: 300,
              maxHeight: 430,
            }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="btn1 rounded-5 mx-auto"
          >
            <div
              style={{
                padding: 10,
                maxWidth: 700,
                paddingInline: "20px",
              }}
            >
              <a
                href="mailto:polteknuklir@brin.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-justify"
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#ffff",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Email
                </h4>
              </a>
            </div>
          </Col>
        </Row>
        <Row style={{ paddingBottom: "40px" }}>
          <Col
            style={{
              background: "#5B5A5A",
              padding: 0,
              maxWidth: 300,
              maxHeight: 430,
            }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="rounded-5 mx-auto"
          >
            <div
              style={{
                padding: 10,
                maxWidth: 700,
                paddingInline: "20px",
              }}
            >
              <a
                href="https://www.instagram.com/polteknuklir/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-justify"
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#ffff",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Instagram
                </h4>
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              background: "#5B5A5A",
              padding: 0,
              maxWidth: 300,
              maxHeight: 430,
            }}
            data-aos="fade-up"
            data-aos-duration="1000"
            className="rounded-5 mx-auto"
          >
            <div
              style={{
                padding: 10,
                maxWidth: 700,
                paddingInline: "20px",
              }}
            >
              <a
                href="https://wa.me/+6281125209777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-justify"
              >
                <h4
                  style={{
                    fontWeight: "bold",
                    color: "#ffff",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Whatsapp
                </h4>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Kontak;
