import { Outlet, useLocation, Link } from "react-router-dom";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import Sidebar from "./SideBar";

function Layout() {
  const location = useLocation();


  // Pages where sidebar should not show
  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <>

      {/*Content wrapper (pushes below navbar)*/}
      <div style={{ marginTop: "80px" }} className="d-flex">
        {/* Sidebar only if not login/signup */}
        {!shouldHideSidebar && <Sidebar />}
        

        {/* Main content */}
        <div 
          className="flex-grow-1 p-3"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100%',
            scrollBehavior: 'smooth'
          }}
        >
          <div style={{ minHeight: 'fit-content' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;