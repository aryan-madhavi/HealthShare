import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ width: "25rem", borderRadius: "1rem" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          
          <Form>
            <Form.Group className="mb-3" controlId="formGroupUser">
              <Form.Label className="text-start d-block fw-semibold">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="rounded p-2 border border-2 border-primary shadow-sm focus-ring"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label className="text-start d-block fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                className="rounded p-2 border border-2 border-primary shadow-sm"
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" className="rounded py-2 fw-bold">
                Login
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
