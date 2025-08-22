import { useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

function Sidebar() {
  const [show, setShow] = useState(false);

  // Sidebar links
  const SidebarContent = (
    <Nav defaultActiveKey="/home" className="flex-column">
      <Nav.Link as={Link} to="/profile"  className="text-dark">Profile</Nav.Link>
      <Nav.Link as={Link} to="/document" className="text-dark">Documents</Nav.Link>
      <Nav.Link as={Link} to="/activelinks" className="text-dark">Active Links</Nav.Link>
      {/* <Nav.Link href="/profile" className="text-dark">👤 Profile</Nav.Link> */}
    </Nav>
  );

  return (
    <div className="d-flex">
      {/* ===== Desktop Sidebar ===== */}
      <div className="d-none d-md-block bg-light p-3" style={{ width: "220px", minHeight: "100vh" }}>
        <h4>HealthShare</h4>
        {SidebarContent}
      </div>

      {/* ===== Mobile Button + Offcanvas ===== */}
      <div className="d-md-none">
        <Button variant="primary" onClick={() => setShow(true)} className="m-2">
          ☰ Menu
        </Button>

        <Offcanvas show={show} onHide={() => setShow(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>HealthShare</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {SidebarContent}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default Sidebar;
