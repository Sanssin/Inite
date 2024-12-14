import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo_inite.png";

export const NavbarComp = () => {
  return (
    <div>
      <div className="blur-background" />
      <Navbar expand="lg">
        <Container>
          <NavLink to="/">
            <img
              alt="sd"
              src={logo}
              width="80"
              className="d-inline-block align-top"
            />
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mas justify-content-end flex-grow-1">
              <NavLink
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isPending ? "pending" : "",
                    isActive ? "active" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" ")
                }
                end
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isPending ? "pending" : "",
                    isActive ? "active" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" ")
                }
                end
                to="/contact"
              >
                Contact
              </NavLink>
              <NavLink
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isPending ? "pending" : "",
                    isActive ? "active" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" ")
                }
                end
                to="/about"
              >
                About
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
