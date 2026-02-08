import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import SurveyImage from "../assets/HEIF Image.png";
import Eksterna from "../assets/radiography-testing-500x500.webp";
import Gamma from "../assets/Gamma.jpg";
import Interna from "../assets/Interna.jpg";
import Reaktor from "../assets/Reaktor.jpg";
import Sifat from "../assets/SifatRad.jpg";
import Surveymeter from "../assets/Surveymeter1.jpg";
import event1 from "../assets/event1.jpeg";
import event2 from "../assets/desak.jpg";
import event3 from "../assets/BRIN KOLABORASI.jpg";
import sim from "../assets/game.png";
import nucpedbtn from "../assets/3dicons.png";
import eventbtn from "../assets/3dicons (3).png";
import simbtn from "../assets/3dicons (1).png";
import hima from "../assets/logo hima transparan putih.png";
import poltek from "../assets/POLTEK NUKLIR TRANSPARAN putih.png";
import duasatu from "../assets/logo21 putih crop.png";
import minimal from "../assets/logominimalins.png";

export const Homepage = () => {
  let navigate = useNavigate();
  const { t } = useTranslation('home');

  const nuclearped = useRef();
  const eventsec = useRef();
  const simsec = useRef();

  const scrollHandler = (elmRef) => {
    window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" });
  };

  return (
    <div className="Homepage" id="Homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
        <Container>
          <Row className="header-box d-flex align-items-center">
            <Col lg="6">
              <div lg="6" className="pt-lg-0 pt-5">
                <h1 className="animate__animated animate__fadeInUp  mb-4">
                  {t('hero.title')} <br /> {t('hero.titleLine2')} <br /> {t('hero.titleLine3')}
                  {" "}<br /> {t('hero.titleLine4')}{" "}
                </h1>
                <p className="animate__animated animate__fadeInUp  mb-4">
                  {t('hero.subtitle')}{" "}
                </p>
              </div>
              <div className="but pb-4">
                <button
                  className="btn animate__animated animate__fadeInUp  btn-lg rounded-5 me-2 mb-xs-0 mb-2"
                  onClick={() => scrollHandler(nuclearped)}
                >
                  <Col>
                    <img
                      className="img-fluid"
                      style={{ width: 50 }}
                      src={nucpedbtn}
                      alt="btn"
                    />
                  </Col>
                  Nuclearpedia
                </button>
                <button
                  className="btn animate__animated animate__fadeInUp  btn-lg rounded-5 me-2 mb-xs-0 mb-2"
                  onClick={() => scrollHandler(eventsec)}
                >
                  <Col>
                    <img style={{ width: 50 }} src={eventbtn} alt="btn" />
                  </Col>
                  Event
                </button>
                <button
                  className="btn animate__animated animate__fadeInUp btn-lg rounded-5 me-2 mb-xs-0 mb-2"
                  onClick={() => scrollHandler(simsec)}
                >
                  <Col>
                    <img style={{ width: 50 }} src={simbtn} alt="btn" />
                  </Col>
                  Simulation
                </button>
              </div>
            </Col>
            <Col>
              <img
                className="shake-vertical"
                src={SurveyImage}
                alt="survey-img"
              />
            </Col>
          </Row>
        </Container>
      </header>
      <div ref={nuclearped} className="kelas w-100 min-vh-100">
        <Container>
          <Row>
            <Col data-aos="fade-up" data-aos-duration="1000">
              <h1 className="text-center">{t('nuclearpedia.title')}</h1>
              <p className="text-center">
                {t('nuclearpedia.description')}
              </p>
            </Col>
          </Row>
          <Row className="pb-4">
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="rounded-5"
            >
              <img
                className="mb-4 rounded-5"
                src={Surveymeter}
                alt="Surveymeter"
              />
              <h4 className="mb-2 px-3">{t('nuclearpedia.surveymeter')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.surveymeterDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              className="rounded-5"
            >
              <img
                className="mb-4 rounded-5"
                src={Reaktor}
                alt="Reaktor Nuklir"
              />
              <h4 className="mb-2 px-3">{t('nuclearpedia.reaktorNuklir')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.reaktorNuklirDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia2")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
              className="rounded-5"
            >
              <img
                className="mb-4 rounded-5"
                src={Eksterna}
                alt="Radiasi Eksterna"
              />
              <h4 className="mb-2 px-3">{t('nuclearpedia.radiasiEksterna')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.radiasiEksternaDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia3")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
          </Row>
          <Row>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="rounded-5"
            >
              <img
                className="mb-4 rounded-5"
                src={Interna}
                alt="Radiasi Interna"
              />
              <h4 className="mb-2 px-3">{t('nuclearpedia.radiasiInterna')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.radiasiInternaDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia4")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              className="rounded-5"
            >
              <img className="mb-4 rounded-5" src={Sifat} alt="Sifat Radiasi" />
              <h4 className="mb-2 px-3">{t('nuclearpedia.sifatRadiasi')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.sifatRadiasiDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia5")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
              className="rounded-5"
            >
              <img className="mb-4 rounded-5" src={Gamma} alt="Sinar Gamma" />
              <h4 className="mb-2 px-3">{t('nuclearpedia.sinarGamma')}</h4>
              <p className="mb-3 px-3">
                {t('nuclearpedia.sinarGammaDesc')}
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia6")}
              >
                {t('nuclearpedia.readMore')}
              </button>
            </Col>
          </Row>
        </Container>
      </div>
      <div ref={eventsec} className="event w-100 min-vh-100">
        <Container>
          <Row>
            <Col data-aos="fade-up" data-aos-duration="1000">
              <h1>{t('event.title')}</h1>
              <p>{t('event.description')}</p>
            </Col>
          </Row>
          <Row>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              className="rounded-5 mx-auto"
            >
              <img
                className="rounded-5 mx-auto d-block"
                src={event1}
                alt="Berita"
              />
              <h4 className="text-justify">
                {t('event.event1Title')}
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event")}
              >
                {t('event.readMore')}
              </button>
            </Col>
          </Row>
          <Row>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              className="rounded-5 mx-auto"
            >
              <img
                className="rounded-5 mx-auto d-block"
                src={event2}
                alt="Berita"
              />
              <h4 className="text-justify">
                {t('event.event2Title')}
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event2")}
              >
                {t('event.readMore')}
              </button>
            </Col>
          </Row>
          <Row>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              className="rounded-5 mx-auto"
            >
              <img
                className="rounded-5 mx-auto d-block"
                src={event3}
                alt="Berita"
              />
              <h4 className="text-justify">
                {t('event.event3Title')}
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event3")}
              >
                {t('event.readMore')}
              </button>
            </Col>
          </Row>
        </Container>
      </div>
      <div ref={simsec} className="simulasi w-100 ">
        <Container>
          <Row>
            <Col data-aos="fade-up" data-aos-duration="1000">
              <h1 className="Sim text-center">
                {t('simulation.title')} <br /> {t('simulation.titleLine2')}
              </h1>
            </Col>
          </Row>
          <Row data-aos="fade-up" data-aos-duration="1000">
            <div class="d-flex justify-content-center align-item-center">
              <button
                className="btn rounded-5 mb-3"
                onClick={() => navigate("/startsim")}
              >
                <img src={sim} alt="game" /> <br />
                {t('simulation.button')}
              </button>
            </div>
          </Row>
        </Container>
      </div>
      <div className="w-100" style={{ background: "black" }}>
        <Container>
          <div
            style={{ paddingInline: "40px" }}
            data-aos="fade-up"
            data-aos-duration="1000"
            class="d-flex justify-content-center align-item-center"
          >
            <h5
              style={{
                fontWeight: "bold",
                color: "white",
                paddingBottom: "20px",
              }}
            >
              {t('supportedBy')}
            </h5>
          </div>
          <Row style={{ paddingInline: "40px" }}>
            <Col style={{}}>
              <div
                data-aos="fade-up"
                data-aos-duration="1000"
                className="d-flex justify-content-center align-items-center"
                style={{ paddingBottom: "100px" }}
              >
                <div style={{ maxWidth: "50px", marginRight: "40px" }}>
                  <img
                    className="img-fluid mx-3"
                    style={{ width: "100%", objectFit: "contain" }}
                    src={poltek}
                    alt="poltek"
                  />
                </div>
                <div style={{ maxWidth: "200px", marginRight: "40px" }}>
                  <img
                    className="img-fluid mx-3"
                    style={{ width: "100%", objectFit: "contain" }}
                    src={hima}
                    alt="brin"
                  />
                </div>
                <div style={{ maxWidth: "100px", marginRight: "40px" }}>
                  <img
                    className="img-fluid mx-3"
                    style={{ width: "100%", objectFit: "contain" }}
                    src={duasatu}
                    alt="brin"
                  />
                </div>
                <div style={{ maxWidth: "80px", marginRight: "40px" }}>
                  <img
                    className="img-fluid mx-3"
                    style={{ width: "100%", objectFit: "contain" }}
                    src={minimal}
                    alt="brin"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Homepage;
