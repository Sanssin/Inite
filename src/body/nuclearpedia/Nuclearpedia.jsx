import { Container, Row, Col } from "react-bootstrap"
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import poto from "../../assets/Surveymeter.jpeg"
import arrow from "../../assets/Arrow left-circle.png"

export const Nuclearpedia = () => {
  const { t } = useTranslation('nuclearpedia');
  let navigate = useNavigate();

  return (
    <div className="nukped w-100 min-vh-100" style={{ background: "#0a0a0a" }}>
      <Container>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className="d-flex justify-content-center align-items-center" style={{ paddingTop: 100, paddingBottom:0 }}>
          <h1 style={{ fontWeight: "bold", color: "#e6e6e6", textAlign: "center" }}>{t('title')}</h1>
        </div>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100" className=" d-flex justify-content-center align-items-center" style={{ paddingBottom:20 }}>
          <p style={{ color: "#e6e6e6", textAlign: "center" }}>{t('exploreMore')}</p>
        </div>
        <div className="d-flex justify-content-center align-items-center px-3 px-md-5" style={{ paddingBottom: 50 }}>
          <Row >
            <Col
              className="rounded-5"
              style={{
                background: "#5B5A5A",
                padding: 0,
                maxWidth: 900,
              }}
            >
              <div>
                <img
                  className="img-fluid rounded-5"
                  style={{ width: "100%" }}
                  src={poto}
                  alt="foto"
                />
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  maxWidth: 1000,
                }}
              >
                <h2 style={{ fontWeight: "bold", color: "#e6e6e6", marginBottom: "1.5rem" }}>
                  {t('article1.title')}
                </h2>
                <div>
                  <p
                    style={{
                      color: "#e6e6e6",
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{ __html: t('article1.p1') }}
                  />
                  <p
                    style={{
                      color: "#e6e6e6",
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{ __html: t('article1.p2') }}
                  />
                  <p
                    style={{
                      color: "#e6e6e6",
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{ __html: t('article1.p3') }}
                  />
                  <p
                    style={{
                      color: "#e6e6e6",
                      marginTop: 20,
                      textAlign: "justify",
                      fontStyle: "italic"
                    }}
                  >
                    {t('article1.source')}
                  </p>
                </div>
              </div>
            </Col>
            </Row>
        </div>
        <div data-aos="fade-up" data-aos-duration="500" className="back px-3 px-md-5" style={{ paddingTop: 0, paddingBottom: 40 }}>
          <img
            className="img-fluid"
            style={{ width: 80, cursor: "pointer" }}
            src={arrow}
            alt="x"
            onClick={() => navigate('/nuclearpedia')}
          />
        </div>
      </Container>
    </div>
  )
}

export default Nuclearpedia