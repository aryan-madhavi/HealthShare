// import { useState } from "react";
// import { Button, Nav, Offcanvas } from "react-bootstrap";
// import { Link } from "react-router-dom";

// function Sidebar() {
//   const [show, setShow] = useState(false);

//   // Sidebar links
//   const SidebarContent = (
//     <Nav defaultActiveKey="/home" className="flex-column">
//       <Nav.Link as={Link} to="/profile"  className="text-dark">Profile</Nav.Link>
//       <Nav.Link as={Link} to="/document" className="text-dark">Documents</Nav.Link>
//       <Nav.Link as={Link} to="/activelinks" className="text-dark">Active Links</Nav.Link>
//       {/* <Nav.Link href="/profile" className="text-dark">👤 Profile</Nav.Link> */}
//     </Nav>
//   );

//   return (
//     <div className="d-flex">
//       {/* ===== Desktop Sidebar ===== */}
//       <div className="d-none d-md-block bg-light p-3" style={{ width: "220px", minHeight: "100vh" }}>
//         <h4>HealthShare</h4>
//         {SidebarContent}
//       </div>

//       {/* ===== Mobile Button + Offcanvas ===== */}
//       <div className="d-md-none">
//         <Button variant="primary" onClick={() => setShow(true)} className="m-2">
//           ☰ Menu
//         </Button>

//         <Offcanvas show={show} onHide={() => setShow(false)}>
//           <Offcanvas.Header closeButton>
//             <Offcanvas.Title>HealthShare</Offcanvas.Title>
//           </Offcanvas.Header>
//           <Offcanvas.Body>
//             {SidebarContent}
//           </Offcanvas.Body>
//         </Offcanvas>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

import { useState } from "react";
import { Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import { Link, Routes, Route } from "react-router-dom";

// ===== Example Pages =====
function Home() {
  return (
    <div className="page-content">
      <h1>Upload Your Files</h1>
    </div>
  );
}

function Profile() {
  return (
    <div className="page-content">
      <h1>Profile Page</h1>
      <p>This is the profile page content.</p>
    </div>
  );
}

function Document() {
  return (
    <div className="page-content">
      <h1>Documents Page</h1>
    </div>
  );
}

function ActiveLinks() {
  return (
    <div className="page-content">
      <h1>Active Links</h1>
    </div>
  );
}

function Contact() {
  return (
    <div className="page-content">
      <h1>Contact Page</h1>
    </div>
  );
}

// ===== Main Component =====
function TopNavbar() {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* ===== Navbar ===== */}
      <Navbar
  expand="lg"
  fixed="top"
  className="px-3 shadow"
  style={{ backgroundColor: "#181145c2" }}  
>



        <Navbar.Brand as={Link} to="/" className="fw-bold text-white" >
          HealthShare
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setShow(true)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/document" className="text-white mx-2">
              Documents
            </Nav.Link>
            <Nav.Link as={Link} to="/activelinks" className="text-white mx-2">
              Active Links
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="text-white mx-2">
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ===== Mobile Offcanvas ===== */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header closeButton className="bg-dark text-white">
          <Offcanvas.Title>HealthShare</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark p-0">
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/profile"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Profile
            </Nav.Link>
            <div className="text-white py-3 px-4 fw-bold border-bottom border-secondary bg-secondary bg-opacity-25">
              Documents
            </div>
            <Nav.Link
              as={Link}
              to="/document/recent"
              className="text-white py-2 px-5 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Recent Documents
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/document/archived"
              className="text-white py-2 px-5 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Archived Documents
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/document/shared"
              className="text-white py-2 px-5 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Shared Documents
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
              to="/contact"
              className="text-white py-3 px-4"
              onClick={() => setShow(false)}
            >
              Contact
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* ===== Content with margin below navbar ===== */}
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/document/:type" element={<Document />} />
          <Route path="/activelinks" element={<ActiveLinks />} />
        </Routes>
      </div>
    </>
  );
}

export default TopNavbar;
