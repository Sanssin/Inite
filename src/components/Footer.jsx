import { Container, Row, Col } from "react-bootstrap";

import logo from "../assets/logo_inite.png";
import rumah from "../assets/homeIcon.png";

export const Footer = () => {
  return (
    <div className="footer" id="footer">
      <Container>
        <Row>
          <Col className="col1">
            <img src={logo} alt="logo inite" />
            <h5>Indonesian Nuclear Interactive Website</h5>
            <p className="text-justify">
              Kami bervisi mengenalkan nuklir dan radiasi kepada masyarakat
              Indonesia di bawah bimbingan ahli nuklir dari Politeknik Teknologi
              Nuklir Indonesia. Halaman web ini masih dalam tahap pengembangan
              dan akan ada perbaikan dari waktu ke waktu, demi mencapai tujuan
              utama kami.
            </p>
          </Col>
          <Col className="col2">
            <h5>
              <img src={rumah} alt="home" />
              Homebase
            </h5>
            <p>
              Program Studi Elektronika Instrumentasi, <br /> Politeknik
              Teknologi Nuklir Indonesia, <br /> Jl. Babarsari Kotak POB
              6101/YKKB, <br />
              Ngentak, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah
              Istimewa Yogyakarta 55281
            </p>
          </Col>
          <Col className="col3">
            <h5>contact</h5>
            <div className="mail">
              <a
                href="mailto:polteknuklir@brin.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <p>Email</p>
              </a>
            </div>
            <div className="ig">
              <a
                href="https://www.instagram.com/polteknuklir/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <p>Instagram</p>
              </a>
            </div>
            <div className="wa">
              <a
                href="https://wa.me/+6281125209777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <p>Whatsapp</p>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
