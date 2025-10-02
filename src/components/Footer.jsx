import { Container, Row, Col } from "react-bootstrap";
import './footer.css';
import logoInite from '../assets/logo_inite.png';
import logoPoltek from '../assets/Poltek.png';
import logoBRIN from '../assets/BRIN.png';
import logoKlins from '../assets/klins.png';
import logo21 from  '../assets/logo21 putih crop.png';
import logominimalins from '../assets/logominimalins.png';
import logoHima from '../assets/logoHimaTransparanPutih.png';

export const Footer = () => {
  return (
    <footer className="footer smart-footer" id="footer" style={{backgroundColor: '#181818', padding: '50px 0 30px 0'}}>
      <Container>
        {/* ❇️ ROW 1: Main Content (Logo, Tagline, Contact) */}
        <Row className="footer-main-content" style={{backgroundColor: 'transparent'}}>
          {/* Column 1: Branding & Tagline */}
          <Col lg={6} md={6} className="footer-col mb-4 mb-lg-0">
            <img src={logoInite} alt="Logo Inite" className="footer-logo" />
            <p className="tagline">
              "Menjelajahi Dunia Nuklir: Interaktif, Terpercaya, dan Terbuka untuk Semua."
            </p>
            <p className="copyright">
              © {new Date().getFullYear()} Inite. All Rights Reserved.
            </p>
          </Col>

          {/* Column 2: Address & Contact */}
          <Col lg={6} md={6} className="footer-col mb-4 mb-lg-0">
            <h5>Alamat & Kontak</h5>
            <p>
              Politeknik Teknologi Nuklir Indonesia,<br />
              Jl. Babarsari Kotak POB 6101/YKKB, <br />
              Sleman, D.I. Yogyakarta 55281
            </p>
            <div className="contact-links">
              <a
                href="mailto:polteknuklir@brin.go.id"
                aria-label="Email"
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTQgNGgxNmMxLjEgMCAyIC45IDIgMnYxMmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMlY2YzAgLTEuMS45LTIgMi0yeiI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjIyLDYgMTIsMTMgMiw2Ij48L3BvbHlsaW5lPjwvc3ZnPg=="
                  alt="Email"
                  className="contact-icon"
                />
              </a>
              <a
                href="https://www.instagram.com/polteknuklir/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNSIgcnk9IjUiPjwvcmVjdD48cGF0aCBkPSJNMTYgMTEuMzdBNCA0IDAgMSAxIDEyLjYzIDggNCA0IDAgMCAxIDE2IDExLjM3eiI+PC9wYXRoPjxsaW5lIHgxPSIxNy41IiB5MT0iNi41IiB4Mj0iMTcuNTEiIHkyPSI2LjUiPjwvbGluZT48L3N2Zz4="
                  alt="Instagram"
                  className="contact-icon"
                />
              </a>
            </div>
          </Col>
        </Row>

        {/* ❇️ ROW 2: Affiliation Logos Section */}
        <Row className="affiliation-section">
          <Col lg={12} className="text-center">
            <div className="affiliation-header">
              <h5>Didukung oleh</h5>
            </div>
            <div className="horizontal-logos">
              <img src={logoBRIN} alt="Logo BRIN" className="affiliation-logo" title="Badan Riset dan Inovasi Nasional" />
              <img src={logoPoltek} alt="Logo Poltek Nuklir" className="affiliation-logo" title="Politeknik Teknologi Nuklir Indonesia" />
              <img src={logoHima} alt="Logo HIMA" className="affiliation-logo" title="Himpunan Mahasiswa Teknologi Nuklir" />
              <img src={logo21} alt="Logo 21" className="affiliation-logo" title="Logo 21" />
              <img src={logominimalins} alt="Logo Minimalins" className="affiliation-logo" title="Minimalins" />
              <img src={logoKlins} alt="Logo KLINS" className="affiliation-logo" title="KLINS" />
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
