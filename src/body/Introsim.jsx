import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import mascot from '../assets/maskot1.png';
import atom from '../assets/atom.png';
import alara from '../assets/alara.png';
import satuan from '../assets/satuan.png';

const IntroSim = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "Apa itu Radiasi Pengion?",
      image: atom,
      content: [
        "Radiasi pengion adalah energi tak terlihat yang cukup kuat untuk 'mengetuk' elektron keluar dari atom, menciptakan 'ion'. Proses inilah yang bisa memengaruhi materi, termasuk jaringan biologis.",
        "Ada beberapa jenis utama yang akan Anda temui:",
        "&bull; <strong>Partikel Alfa (α):</strong> Partikel besar yang dapat dihentikan oleh selembar kertas atau kulit luar kita. Berbahaya hanya jika terhirup atau tertelan.",
        "&bull; <strong>Partikel Beta (β):</strong> Lebih kecil dan lebih cepat dari Alfa. Dapat menembus beberapa milimeter jaringan. Aluminium tipis dapat menghentikannya.",
        "&bull; <strong>Sinar Gamma (γ):</strong> Bukan partikel, melainkan gelombang energi tinggi seperti sinar-X. Sangat penetratif dan memerlukan perisai tebal seperti timbal atau beton untuk menghentikannya."
      ]
    },
    {
      title: "Peran Kritis Petugas Proteksi Radiasi",
      content: [
        "Sebagai seorang PPR, Anda adalah garda terdepan dalam keselamatan nuklir. Tanggung jawab Anda tidak hanya melindungi diri sendiri, tetapi juga semua orang di sekitar Anda dan lingkungan.",
        "Tugas spesifik seorang PPR meliputi:",
        "&bull; <strong>Dosimetri:</strong> Memantau dan mencatat dosis radiasi yang diterima oleh pekerja menggunakan alat seperti dosimeter.",
        "&bull; <strong>Survei Radiasi:</strong> Secara rutin memetakan tingkat radiasi di berbagai area untuk mengidentifikasi zona aman dan berbahaya.",
        "&bull; <strong>Manajemen Perisai (Shielding):</strong> Menentukan jenis dan ketebalan perisai yang tepat untuk berbagai sumber radiasi.",
        "&bull; <strong>Perencanaan Darurat:</strong> Mengembangkan dan melatih prosedur untuk merespons insiden atau kecelakaan radiasi."
      ]
    },
    {
      title: "Menguasai Prinsip ALARA",
      image: alara,
      content: [
        "<strong>ALARA (As Low As Reasonably Achievable)</strong> adalah filosofi inti Anda. Ini bukan tentang menghindari radiasi sepenuhnya (karena itu tidak mungkin), tetapi tentang menjadi cerdas dan efisien dalam meminimalkan paparan.",
        "&bull; <strong>Waktu:</strong> Jika Anda harus bekerja di area dengan laju dosis 10 mSv/jam, bekerja selama 1 jam memberi Anda dosis 10 mSv. Bekerja hanya 30 menit mengurangi dosis Anda menjadi 5 mSv. Rencanakan pekerjaan Anda sebelum memasuki zona radiasi!",
        "&bull; <strong>Jarak:</strong> Radiasi dari sumber titik mengikuti 'hukum kuadrat terbalik'. Artinya, jika Anda menggandakan jarak dari sumber, Anda hanya menerima seperempat (1/4) dari laju dosis. Menjaga jarak adalah cara paling efektif untuk mengurangi paparan.",
        "&bull; <strong>Perisai (Shielding):</strong> Setiap material memiliki kemampuan berbeda untuk menghentikan radiasi. Dalam simulasi, Anda akan melihat bagaimana material yang berbeda seperti timbal, beton, atau air memberikan tingkat proteksi yang berbeda terhadap sumber radiasi yang berbeda."
      ]
    },
    {
      title: "Bahasa Radiasi: Memahami Satuan",
      image: satuan,
      content: [
        "Memahami satuan adalah kunci untuk membuat keputusan yang tepat:",
        "&bull; <strong>Aktivitas (Bq):</strong> Anggap ini sebagai 'kekuatan' sumber radiasi. 1 Bq berarti ada satu peluruhan atom per detik. Sumber dengan aktivitas tinggi memancarkan lebih banyak radiasi.",
        "&bull; <strong>Laju Dosis (Sv/h):</strong> Ini adalah 'kecepatan' paparan di suatu lokasi. Ini memberitahu Anda seberapa cepat Anda mengakumulasi dosis. Peta radiasi dalam game akan menunjukkan nilai ini.",
        "&bull; <strong>Dosis Total (Sv):</strong> Ini adalah jumlah total paparan yang telah Anda terima selama periode waktu tertentu. Batas dosis tahunan untuk pekerja radiasi diatur oleh badan regulasi untuk mencegah efek kesehatan jangka panjang. Misi Anda adalah menjaga nilai ini serendah mungkin."
      ]
    }
  ];

  const currentPage = pages[page];
  const isEvenPage = page % 2 === 0;

  const handleNext = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
    } else {
      navigate('/setup');
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const imageCol = (
    <Col lg={4} md={5} className="d-flex justify-content-center align-items-center mb-4 mb-md-0" key="image">
      <img 
        src={currentPage.image || mascot} 
        alt={currentPage.title} 
        className="img-fluid" 
        style={{ maxHeight: '350px', maxWidth: '100%', height: 'auto' }} 
      />
    </Col>
  );

  const textCol = (
    <Col lg={8} md={7} key="text">
      <h1 style={{ color: "#E0CC0B", fontWeight: "bold", marginBottom: '30px' }}>{currentPage.title}</h1>
      {currentPage.content.map((text, index) => (
        <p key={index} style={{ fontSize: '1.1rem', textAlign: 'justify', marginBottom: '1rem', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: text }}></p>
      ))}
      <div className="mt-5 d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
        {page > 0 && (
          <button
            onClick={handleBack}
            className="btn2 rounded-5"
            style={{ cursor: 'pointer' }}
          >
            Kembali
          </button>
        )}
        <button
          onClick={handleNext}
          className="btn1 rounded-5"
          style={{ cursor: 'pointer' }}
        >
          {page === pages.length - 1 ? "Lanjut ke Pengaturan" : "Lanjutkan"}
        </button>
      </div>
    </Col>
  );

  return (
    <div className="startsim" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Container fluid className="px-0">
        <div className="header-box mx-0">
          <Row className="align-items-center justify-content-center w-100 mx-0">
            {/* Mobile layout - always stack vertically */}
            <div className="d-block d-md-none w-100">
              <Row className="mx-0">
                <Col xs={12} className="text-center mb-2 px-2">
                  <img 
                    src={currentPage.image || mascot} 
                    alt={currentPage.title} 
                    className="img-fluid" 
                    style={{ maxHeight: '260px', maxWidth: '100%', height: 'auto' }} 
                  />
                </Col>
                <Col xs={12} className="px-2">
                  <h1 style={{ color: "#E0CC0B", fontWeight: "bold", textAlign: 'center' }}>{currentPage.title}</h1>
                  {currentPage.content.map((text, index) => (
                    <p key={index} style={{ fontSize: '1.1rem', textAlign: 'justify', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: text }}></p>
                  ))}
                  <div className="mt-3 d-flex flex-wrap justify-content-center gap-2">
                    {page > 0 && (
                      <button
                        onClick={handleBack}
                        className="btn2 rounded-5"
                        style={{ cursor: 'pointer' }}
                      >
                        Kembali
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="btn1 rounded-5"
                      style={{ cursor: 'pointer' }}
                    >
                      {page === pages.length - 1 ? "Lanjut ke Pengaturan" : "Lanjutkan"}
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
            
            {/* Desktop layout - alternating image/text */}
            <div className="d-none d-md-block w-100">
              <Row className="align-items-center mx-0">
                {isEvenPage ? (
                  <>
                    {imageCol}
                    {textCol}
                  </>
                ) : (
                  <>
                    {textCol}
                    {imageCol}
                  </>
                )}
              </Row>
            </div>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default IntroSim;