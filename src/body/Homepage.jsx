import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
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
                  Selamat Datang! <br /> di Indonesian <br /> Nuclear
                  Interactive <br /> Website{" "}
                </h1>
                <p className="animate__animated animate__fadeInUp  mb-4">
                  Mari jelajahi dan mengenal berbagai macam teknologi nuklir{" "}
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
              <h1 className="text-center">Nuclearpedia</h1>
              <p className="text-center">
                Anda dapat menemukan berbagai informasi terkait kenukliran di
                halaman ini.
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
              <h4 className="mb-2 px-3">Surveymeter</h4>
              <p className="mb-3 px-3">
                Surveymeter adalah alat ukur yang digunakan untuk mendeteksi dan
                mengukur tingkat radiasi di lingkungan.
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia")}
              >
                Selengkapnya
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
              <h4 className="mb-2 px-3">Reaktor Nuklir</h4>
              <p className="mb-3 px-3">
                IAEA (International Atomic Energy Agency, IAEA) mendefinisikan
                reaktor nuklir sebagai perangkat yang . . .
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia2")}
              >
                Selengkapnya
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
              <h4 className="mb-2 px-3">Radiasi Eksterna</h4>
              <p className="mb-3 px-3">
                Menurut Nuclear Association, radiasi eksterna adalah radiasi
                pengion yang berasal dari sumber eksternal . . .
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia3")}
              >
                Selengkapnya
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
              <h4 className="mb-2 px-3">Radiasi Interna</h4>
              <p className="mb-3 px-3">
                Menurut International Atomic Energy Agency (IAEA), radiasi
                interna adalah radiasi pengion yang berasal dari . . .
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia4")}
              >
                Selengkapnya
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              className="rounded-5"
            >
              <img className="mb-4 rounded-5" src={Sifat} alt="Sifat Radiasi" />
              <h4 className="mb-2 px-3">Sifat Radiasi</h4>
              <p className="mb-3 px-3">
                Menurut Badan Tenaga Atom Internasional (IAEA), radiasi adalah
                pelepasan energi dalam bentuk gelombang atau . . .
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia5")}
              >
                Selengkapnya
              </button>
            </Col>
            <Col
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
              className="rounded-5"
            >
              <img className="mb-4 rounded-5" src={Gamma} alt="Sinar Gamma" />
              <h4 className="mb-2 px-3">Sinar Gamma</h4>
              <p className="mb-3 px-3">
                Menurut Asosiasi Nuklir Dunia (World Nuclear Association, WNA),
                radiasi gamma adalah jenis radiasi . . .
              </p>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/nuclearpedia6")}
              >
                Selengkapnya
              </button>
            </Col>
          </Row>
        </Container>
      </div>
      <div ref={eventsec} className="event w-100 min-vh-100">
        <Container>
          <Row>
            <Col data-aos="fade-up" data-aos-duration="1000">
              <h1>Event</h1>
              <p>Berita terkini terkait kenukliran.</p>
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
                Indonesia Siap Bangun PLTN, 2030 Direncanakan Beroperasi!
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event")}
              >
                Baca Selengkapnya
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
                Indonesia Nuclear Youth Society Akan Gelar Seminar Desak Nuklir!
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event2")}
              >
                Baca Selengkapnya
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
                BRIN Ajak Investor Berinvestasi dalam Produksi Radiofarmaka
                untuk Terapi Kanker
              </h4>
              <button
                className="btn rounded-4 mb-3"
                onClick={() => navigate("/event3")}
              >
                Baca Selengkapnya
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
                Penasaran dengan Prinsip <br /> Nuklir dan Radiasi?
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
                Lakukan Simulasi!
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
              {" "}
              Supported by
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
