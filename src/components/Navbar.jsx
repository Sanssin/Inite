import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo_inite.png";

export const NavbarComp = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar expand="lg" className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
      <Container>
        <NavLink to="/">
          <img
            alt="logo"
            src={logo}
            width="80"
            className="d-inline-block align-top"
          />
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mas justify-content-end flex-grow-1">
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/contact"
            >
              Contact
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
              end
              to="/about"
            >
              About
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};