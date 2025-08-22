// import { Outlet, useLocation } from "react-router-dom";
// import Sidebar from "./SideBar"; 

// function Layout() {
//   const location = useLocation();

//   // Pages where sidebar should not show
//   const hideSidebarRoutes = ["/login", "/signup"];

//   const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div className="d-flex">
//       {/* Sidebar only if not login/signup */}
//       {!shouldHideSidebar && <Sidebar />}

//       {/* Main content */}
//       <div className="flex-grow-1 overflow-hidden">
//         <Outlet /> {/* This renders child routes */}
//       </div>

//     </div>
//   );
// }

// export default Layout;

import { Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import Sidebar from "./SideBar";

function Layout() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  // Pages where sidebar should not show
  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <>
      {/* ===== Navbar ===== */}
      <Navbar
  expand="lg"
  fixed="top"
  className="px-3 shadow"
  style={{ backgroundColor: "#281e68c2" }}  
>



        <Navbar.Brand as={Link} to="/" className="fw-bold">
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
              to="/document"
              className="text-white py-3 px-4 border-bottom border-secondary"
              onClick={() => setShow(false)}
            >
              Documents
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/activelinks"
              className="text-white py-3 px-4"
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
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* ===== Content wrapper (pushes below navbar) ===== */}
      <div style={{ marginTop: "80px" }} className="d-flex">
        {/* Sidebar only if not login/signup */}
        {!shouldHideSidebar && <Sidebar />}

        {/* Main content */}
        <div className="flex-grow-1 overflow-hidden p-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
