import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"
import Documents from "./pages/Document"
import Profile from "./pages/Profile"
import ActiveLinks from "./pages/ActiveLink"
import Login from "./pages/login"
import Signup from "./pages/signup"

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Sidebar */}
        <Route element={<Layout />}>
          <Route path="/document" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activelinks" element={<ActiveLinks />} />
        </Route>

        {/* Routes without Sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
