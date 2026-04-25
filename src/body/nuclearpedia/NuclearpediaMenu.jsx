import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './NuclearpediaMenu.css';

// Import Assets
import imgSurveymeter from '../../assets/Surveymeter.jpeg';
import imgReaktor from '../../assets/Reaktor.jpeg';
import imgEksterna from '../../assets/Eksterna.jpeg';
import imgInterna from '../../assets/Interna.png';
import imgSifat from '../../assets/SifatRad.jpeg';
import imgGamma from '../../assets/gamma_ray.png';
import imgIAEA from '../../assets/IAEA.jpg';
import imgMedik from '../../assets/medik.jpeg';

const NuclearpediaMenu = () => {
  const { t } = useTranslation('nuclearpedia');

  const articles = [
    {
      id: 1,
      title: t('menu.articles.1.title'),
      excerpt: t('menu.articles.1.excerpt'),
      image: imgSurveymeter,
      path: '/nuclearpedia/1'
    },
    {
      id: 2,
      title: t('menu.articles.2.title'),
      excerpt: t('menu.articles.2.excerpt'),
      image: imgReaktor,
      path: '/nuclearpedia/2'
    },
    {
      id: 3,
      title: t('menu.articles.3.title'),
      excerpt: t('menu.articles.3.excerpt'),
      image: imgEksterna,
      path: '/nuclearpedia/3'
    },
    {
      id: 4,
      title: t('menu.articles.4.title'),
      excerpt: t('menu.articles.4.excerpt'),
      image: imgInterna,
      path: '/nuclearpedia/4'
    },
    {
      id: 5,
      title: t('menu.articles.5.title'),
      excerpt: t('menu.articles.5.excerpt'),
      image: imgSifat,
      path: '/nuclearpedia/5'
    },
    {
      id: 6,
      title: t('menu.articles.6.title'),
      excerpt: t('menu.articles.6.excerpt'),
      image: imgGamma,
      path: '/nuclearpedia/6'
    },
    {
      id: 7,
      title: t('menu.articles.7.title'),
      excerpt: t('menu.articles.7.excerpt'),
      image: imgIAEA,
      path: '/nuclearpedia/7'
    },
    {
      id: 8,
      title: t('menu.articles.8.title'),
      excerpt: t('menu.articles.8.excerpt'),
      image: imgMedik,
      path: '/nuclearpedia/8'
    }
  ];

  return (
    <div className="nuclearpedia-menu-container">
      <div className="nuclearpedia-menu-header">
        <h1 className="nuclearpedia-menu-title">{t('title', 'Nuclearpedia')}</h1>
        <p className="nuclearpedia-menu-subtitle">
          {t('subtitle', 'Jelajahi ensiklopedia nuklir untuk memahami konsep dasar, teknologi, dan keamanan radiasi.')}
        </p>
      </div>

      <div className="nuclearpedia-grid">
        {articles.map((article, index) => (
          <div 
            key={article.id} 
            className="nuclearpedia-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="nuclearpedia-card-image-wrapper">
              <img src={article.image} alt={article.title} className="nuclearpedia-card-image" />
            </div>
            
            <div className="nuclearpedia-card-content">
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <Link to={article.path} className="btn-read-article">
                {t('readMore', 'Baca Artikel')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NuclearpediaMenu;
