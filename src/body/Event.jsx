import { Container, Row, Col } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

import poto from "../assets/event1.jpeg";
import arrow from "../assets/Arrow left-circle.png";

export const Event = () => {
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
                    INDONESIA SIAP BANGUN PLTN, 2030 DIRENCANAKAN BEROPERASI!
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
                    Indonesia bersiap memasuki era baru dalam pembangkit listrik dengan rencana pembangunan Pembangkit Listrik Tenaga Nuklir (PLTN) 
                    pertama di tahun 2030. Hal ini menandakan langkah maju dalam upaya negara 
                    untuk mencapai kemandirian energi dan transisi menuju energi yang lebih bersih dan berkelanjutan.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    PLTN pertama ini akan dibangun di Pulau Gelasa, Bangka Belitung, dengan kapasitas 500 Mega Watt (MW). 
                    Proyek ini digagas oleh PT ThorCon Power Indonesia dan ditargetkan beroperasi secara komersial pada tahun 2030.
                  </p>
                  <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    Pembangunan PLTN di Indonesia bukan tanpa kontroversi. Kekhawatiran terkait keamanan dan pengelolaan limbah nuklir masih menjadi isu yang dibahas. 
                    Namun, pemerintah meyakinkan publik bahwa teknologi yang digunakan sudah teruji dan aman, serta regulasi yang ketat akan diterapkan untuk memastikan 
                    pengelolaan limbah nuklir yang bertanggung jawab.
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
                    Manfaat PLTN bagi Indonesia:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Ketahanan Energi: PLTN menawarkan sumber energi yang stabil dan andal, tidak terpengaruh oleh kondisi cuaca atau musim. <br/>
                    •	Kemandirian Energi: PLTN dapat membantu mengurangi ketergantungan pada impor bahan bakar fosil, seperti batubara, dan meningkatkan kemandirian energi nasional.<br/>
                    •	Emisi Karbon Rendah: PLTN menghasilkan emisi karbon yang jauh lebih rendah dibandingkan pembangkit listrik berbahan bakar fosil, sehingga membantu memerangi perubahan iklim.<br/>
                    •	Pengembangan Teknologi: Pembangunan PLTN akan mendorong transfer teknologi dan pengembangan sumber daya manusia di bidang energi nuklir.

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
                    Langkah-langkah yang Dilakukan Pemerintah:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Penyusunan RUU Energi Nuklir: Pemerintah sedang menyusun Rancangan Undang-Undang (RUU) Energi Nuklir untuk memberikan kerangka hukum yang jelas dan komprehensif bagi pengembangan dan pemanfaatan energi nuklir.<br/>
                    •	Pembinaan SDM: Pemerintah terus membina sumber daya manusia di bidang energi nuklir melalui program pendidikan dan pelatihan.<br/>
                    •	Kerjasama Internasional: Indonesia menjalin kerjasama dengan negara-negara lain yang berpengalaman dalam energi nuklir untuk mendapatkan dukungan dan keahlian.<br/>
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
                    Tantangan yang Dihadapi:
                    </p>
                    <p
                    style={{
                      color: "#ffff",
                      marginLeft: 20,
                      marginTop: 20,
                      textAlign: "justify",
                    }}
                  >
                    •	Kekhawatiran Keamanan: Masyarakat masih memiliki kekhawatiran terkait keamanan PLTN, terutama setelah tragedi Fukushima di Jepang.<br/>
                    •	Pengelolaan Limbah Nuklir: Pengelolaan limbah nuklir yang aman dan bertanggung jawab menjadi tantangan utama yang harus diatasi.<br/>
                    •	Penerimaan Masyarakat: Memperoleh persetujuan dan dukungan dari masyarakat luas sangat penting untuk kelancaran proyek PLTN.<br/>
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

export default Event