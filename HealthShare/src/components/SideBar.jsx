import { useState, useEffect } from "react";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

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
      {/*Navbar*/}
      <Navbar
  expand="lg"
  fixed="top"
  className="px-3 shadow d-flex align-items-center"
  style={{ backgroundColor: "#181145c2" }}
>
  <Navbar.Brand className="fw-bold text-white">
    HealthShare
  </Navbar.Brand> 

  {/* Only show toggle button on mobile */}
  {isMobile && (
    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShow(true)} />
  )}

  {/*NOT mobile */}
 <Navbar.Collapse id="basic-navbar-nav" className="d-flex flex-grow-1 justify-content-between align-items-center">
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
</Navbar>


      {/* Mobile Offcanvas */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton className="bg-dark text-white">
          <Offcanvas.Title>HealthShare</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark p-0">
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/document"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Document
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/activelinks"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Active Links
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/profile"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Profile
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/"
              className="text-white py-3 px-4 border-bottom border-secondary"
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
