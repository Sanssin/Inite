import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/BRIN KOLABORASI.jpg";
import arrow from "../assets/Arrow left-circle.png";

export const Event3 = () => {
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
                    BRIN Ajak Investor Berinvestasi dalam Produksi Radiofarmaka untuk Terapi Kanker
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
                    Jakarta, 30 Mei 2024 - Badan Riset dan Inovasi Nasional (BRIN) mengajak para investor untuk 
                    berinvestasi dalam produksi radiofarmaka, bahan dasar terapi kanker yang saat ini masih banyak diimpor.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Menurut Peneliti Ahli Madya dari Pusat Riset PR Teknologi Radioisotop, Radiofarmaka, dan Biodosimetri - BRIN, Rien Ritawidya,
                     BRIN telah berhasil memproduksi beberapa produk radiofarmaka yang sangat prospektif untuk dikomersilkan, 
                     salah satunya adalah produk larutan Iodium-131 sediaan oral untuk tujuan diagnosa dan terapi kanker tiroid maupun kanker lainnya. 
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    "Kami periset BRIN telah berhasil memproduksi beberapa produk yang sangat prospektif untuk bisa dikomersilkan, salah satunya adalah produk
                     larutan Iodium-131 sediaan oral untuk tujuan diagnosa dan terapi kanker tiroid maupun kanker lainnya," ujar Rien dalam keterangan tertulis yang diterima redaksi,
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Ia menjelaskan, produk radiofarmaka buatan BRIN ini memiliki beberapa keunggulan, yaitu:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Harga lebih murah dibandingkan produk impor <br/>
                    •	Kualitas terjamin karena diproduksi dengan standar mutu yang tinggi<br/>
                    •	Memiliki potensi pasar yang besar karena kebutuhan radiofarmaka di Indonesia terus meningkat

                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Rien menambahkan, BRIN telah membangun infrastruktur dan fasilitas yang lengkap untuk produksi radiofarmaka, 
                    sehingga siap untuk bekerja sama dengan investor untuk melakukan komersialisasi produk tersebut.
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    "Kami membuka peluang kerjasama dengan investor untuk memproduksi dan memasarkan radiofarmaka buatan BRIN ini secara komersial. 
                    Kami yakin, dengan kerjasama ini, kita dapat meningkatkan akses masyarakat terhadap terapi kanker yang berkualitas dan terjangkau," 
                    kata Rien.
                    <br/>
                    Ia berharap, dengan adanya investasi dari pihak swasta, produksi radiofarmaka di Indonesia dapat ditingkatkan, sehingga dapat mengurangi ketergantungan pada impor 
                    dan membantu meningkatkan kemandirian nasional di bidang kesehatan.
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
                    Manfaat Investasi dalam Produksi Radiofarmaka:
                          </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Investasi dalam produksi radiofarmaka di Indonesia memiliki beberapa manfaat, antara lain:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
            >
                    •	Meningkatkan akses masyarakat terhadap terapi kanker<br/>
                    •	Membantu mengurangi angka kematian akibat kanker<br/>
                    •	Meningkatkan kemandirian nasional di bidang kesehatan<br/>
                    •	Menciptakan lapangan pekerjaan<br/>
                    •	Mendukung pertumbuhan ekonomi nasional
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    BRIN berkomitmen untuk mendukung para investor yang ingin berinvestasi dalam produksi radiofarmaka. 
                    BRIN akan memberikan berbagai kemudahan dan insentif, seperti:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Akses kepada infrastruktur dan fasilitas produksi<br/>
                    •	Bantuan dalam hal perizinan dan regulasi<br/>
                    •	Dukungan dari para pakar dan peneliti BRIN
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

export default Event3