import { Outlet, useLocation, Link } from "react-router-dom";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import Sidebar from "./SideBar";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function Layout() {
  const location = useLocation();
 const [role, setRole] = useState(null); // store patient/doctor
  const [loading, setLoading] = useState(true); 

    const auth = getAuth();
  const db = getFirestore();


  // Pages where sidebar should not show
  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

    useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setRole(userSnap.data().role); // "patient" or "doctor"
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [auth, db]);

  if (loading) {
    return <div>Loading...</div>; // spinner/loader if you want
  }



  return (
    <>

      {/*Content wrapper (pushes below navbar)*/}
      <div style={{ marginTop: "80px" }} className="d-flex">
        {/* Sidebar only if not login/signup */}
         {!shouldHideSidebar && role && <Sidebar role={role} />}
       
        

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