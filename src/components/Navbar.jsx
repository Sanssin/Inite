import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import logo from "../assets/logo_inite.png";
import LanguageSwitcher from "./LanguageSwitcher";

export const NavbarComp = () => {
  const { t } = useTranslation('common');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Auto-close navbar on scroll
      if (expanded) {
        setExpanded(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [expanded]);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  // Auto-close navbar when clicking nav links or logo
  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  // Toggle hamburger menu
  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      ref={navbarRef}
      expand="lg"
      className={`navbar-custom ${scrolled ? "scrolled" : ""} ${expanded ? "navbar-expanded" : ""}`}
      expanded={expanded}
      onToggle={handleToggle}
    >
      <Container>
        <NavLink to="/" onClick={handleNavLinkClick}>
          <img
            alt="logo"
            src={logo}
            width="80"
            className="d-inline-block align-top"
          />
        </NavLink>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mas justify-content-end flex-grow-1">
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/"
              onClick={handleNavLinkClick}
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/contact"
              onClick={handleNavLinkClick}
            >
              {t('footer.contact')}
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/about"
              onClick={handleNavLinkClick}
            >
              {t('nav.about')}
            </NavLink>
            <LanguageSwitcher />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};