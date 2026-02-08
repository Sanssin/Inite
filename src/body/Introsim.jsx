import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import mascot from '../assets/maskot1.png';
import atom from '../assets/atom.png';
import alara from '../assets/alara.png';
import satuan from '../assets/satuan.png';
import { useTranslation } from 'react-i18next';

const IntroSim = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { t } = useTranslation('introsim');

  // Scroll to top function with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Effect to scroll to top when page changes
  useEffect(() => {
    scrollToTop();
  }, [page]); // Dependency on page state

  // Effect to scroll to top when component mounts
  useEffect(() => {
    scrollToTop();
  }, []); // Empty dependency - runs only on mount

  const pageImages = [atom, null, alara, satuan];

  const getPageData = (index) => ({
    title: t(`pages.${index}.title`),
    image: pageImages[index],
    content: t(`pages.${index}.content`, { returnObjects: true })
  });

  const currentPage = getPageData(page);
  const isEvenPage = page % 2 === 0;

  const totalPages = 4;

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
      // Scroll will be handled by useEffect when page state changes
    } else {
      // Scroll to top before navigating to next page
      scrollToTop();
      // Small delay to allow smooth scroll to complete before navigation
      setTimeout(() => {
        navigate('/setup');
      }, 300);
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
      // Scroll will be handled by useEffect when page state changes
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
            {t('backButton')}
          </button>
        )}
        <button
          onClick={handleNext}
          className="btn1 rounded-5"
          style={{ cursor: 'pointer' }}
        >
          {page === 3 ? t('goToSetup') : t('nextButton')}
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
                        {t('backButton')}
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="btn1 rounded-5"
                      style={{ cursor: 'pointer' }}
                    >
                      {page === 3 ? t('goToSetup') : t('nextButton')}
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