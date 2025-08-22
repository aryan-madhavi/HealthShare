
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // 👈 your firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userInput: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let email = form.userInput;

      // If input is not an email, treat it as username → fetch from Firestore
      if (!email.includes("@")) {
        const q = query(collection(db, "users"), where("username", "==", form.userInput));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
          throw new Error("No user found with this username.");
        }
        email = querySnap.docs[0].data().email;
      }

      //  Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, form.password);
      const user = userCredential.user;

      console.log("Logged in:", user.uid);

      // Redirect to dashboard
      navigate("/document");
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card
        className="p-4"
        style={{
          width: "25rem",
          borderRadius: "1rem",
          border: "1px solid #ccc",   // ✅ light grey border
          boxShadow: "none",          // ✅ no shadow
          WebkitBoxShadow: "none",
          MozBoxShadow: "none",
          backgroundColor: "white"    // ✅ matches signup exactly     // ✅ solid white
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupUser">
              <Form.Label className="text-start d-block fw-semibold">Email or Username</Form.Label>
              <Form.Control
                type="text"
                name="userInput"
                value={form.userInput}
                onChange={handleChange}
                placeholder="Enter email or username"
                className="rounded p-2 border border-2" // ✅ neutral border
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label className="text-start d-block fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="rounded p-2 border border-2" // ✅ neutral border
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                className="rounded py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 fw-semibold"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;

