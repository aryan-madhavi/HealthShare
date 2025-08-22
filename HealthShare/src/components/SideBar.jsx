import { useState, useEffect } from "react";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

function TopNavbar({ role }) {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Role-based menu items
  const menuItems = {
    patient: [
      { path: "/document", label: "My Documents" },
      { path: "/activelinks", label: "Active Links" },
      { path: "/profile", label: "Profile" },
    ],
    doctor: [
      { path: "/doctor", label: "Home" },
    ],
  };

  const items = menuItems[role] || [];

  // Detect window resize to check if mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992); // bootstrap lg breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar
        expand="lg"
        fixed="top"
        className="px-3 shadow d-flex align-items-center"
        style={{ backgroundColor: "#181145c2" }}
      >
        <Navbar.Brand className="fw-bold text-white">HealthShare</Navbar.Brand>

        {/* Toggle button for mobile */}
        {isMobile && (
          <Navbar.Toggle aria-controls="offcanvas-navbar" onClick={() => setShow(true)} />
        )}

        {/* Desktop menu */}
        {!isMobile && (
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex flex-grow-1 justify-content-between align-items-center"
          >
            {/* Centered Links */}
            <div className="position-absolute start-50 translate-middle-x">
              <Nav className="d-flex gap-4">
                {items.map((item, idx) => (
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    key={idx}
                    className="text-white"
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
            </div>

            {/* Right-aligned Logout */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-white">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>

      {/* Mobile Offcanvas menu */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton className="bg-dark text-white">
          <Offcanvas.Title>HealthShare</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark p-0">
          <Nav className="flex-column">
            {items.map((item, idx) => (
              <Nav.Link
                as={Link}
                to={item.path}
                key={idx}
                className="text-white py-3 px-4 border-bottom border-secondary"
                onClick={() => setShow(false)}
              >
                {item.label}
              </Nav.Link>
            ))}

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
