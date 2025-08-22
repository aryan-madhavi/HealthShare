import { useState, useEffect } from "react";
import { Nav, Navbar, Offcanvas, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";  // <-- import added
import logo from "../assets/logo.png";

function TopNavbar() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect window resize to check if mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992); // bootstrap lg breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className="px-3 shadow"
        style={{ backgroundColor: "#181145c2" }}
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold text-white d-flex align-items-center"
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: "30px", height: "30px", marginRight: "10px" }}
            />
            HealthShare
          </Navbar.Brand>

          {/* Toggle only for mobile */}
          {isMobile && (
            <button
              onClick={() => setShow(true)}
              style={{
                background: "transparent",
                border: "2px solid white",
                color: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle menu"
            >
              <GiHamburgerMenu size={24} />
            </button>
          )}

          {/* Desktop Nav Links */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-none d-lg-flex flex-grow-1 justify-content-between align-items-center"
          >
            {/* Centered Links */}
            <div className="position-absolute start-50 translate-middle-x">
              <Nav className="d-flex gap-4">
                <Nav.Link as={Link} to="/document" className="text-white">
                  Documents
                </Nav.Link>
                <Nav.Link as={Link} to="/activelinks" className="text-white">
                  Active Links
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="text-white">
                  Profile
                </Nav.Link>
              </Nav>
            </div>

            {/* Right-aligned Logout */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-white">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas (show nav links here) */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="start"
        id="offcanvas-navbar"
      >
        <Offcanvas.Header closeButton className="bg-dark text-white">
          <Offcanvas.Title>HealthShare</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-white p-3">
          <Nav className="d-flex flex-column gap-3">
            <Nav.Link
              as={Link}
              to="/document"
              className="text-white"
              onClick={() => setShow(false)}
            >
              Documents
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/activelinks"
              className="text-white"
              onClick={() => setShow(false)}
            >
              Active Links
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/profile"
              className="text-white"
              onClick={() => setShow(false)}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/"
              className="text-white"
              onClick={() => setShow(false)}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default TopNavbar;
