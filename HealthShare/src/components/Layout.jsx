import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar"; 

function Layout() {
  const location = useLocation();

  // Pages where sidebar should not show
  const hideSidebarRoutes = ["/login", "/signup"];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="d-flex">
      {/* Sidebar only if not login/signup */}
      {!shouldHideSidebar && <Sidebar />}

      {/* Main content */}
      <div className="flex-grow-1 overflow-hidden">
        <Outlet /> {/* This renders child routes */}
      </div>

    </div>
  );
}

export default Layout;
