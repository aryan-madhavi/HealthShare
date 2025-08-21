import React, { useState } from 'react';
import { Form, Button, ToggleButton, ButtonGroup, Container } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";   // ✅ fixed import

function Signup() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const user = userCredential.user;

    // 1️⃣ Add full user info into USERS collection
    await setDoc(doc(db, "users", user.uid), {
      username: form.username,
      email: form.email,
      role: role,
      createdAt: new Date(),
    });

    // 2️⃣ Add EMPTY doc into doctors/patients collection
    const roleCollection = role === "patient" ? "patients" : "doctors";
    await setDoc(doc(db, roleCollection, user.uid), {}); // 👈 empty document

    alert(`Signup successful! User added to "users" and empty doc created in "${roleCollection}".`);
  } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
};


  return (
    <Container className="mt-5">
      <div style={{ width: '25rem' }}>
        <h3 className="mb-3">Signup</h3>

        {/* Role Toggle */}
        <div className="mb-4">
          <ButtonGroup>
            <ToggleButton
              id="toggle-patient"
              type="radio"
              variant={role === 'patient' ? 'primary' : 'outline-primary'}
              name="role"
              value="patient"
              checked={role === 'patient'}
              onChange={(e) => setRole(e.currentTarget.value)}
            >
              Patient
            </ToggleButton>
            <ToggleButton
              id="toggle-doctor"
              type="radio"
              variant={role === 'doctor' ? 'primary' : 'outline-primary'}
              name="role"
              value="doctor"
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.currentTarget.value)}
            >
              Doctor
            </ToggleButton>
          </ButtonGroup>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3 text-start" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3 text-start" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3 text-start" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={passwordShown ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="link"
                onClick={() => setPasswordShown(!passwordShown)}
                className="ms-2 p-0"
                style={{ height: '38px' }}
              >
                {passwordShown ? <EyeSlash size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-4 text-start" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={confirmPasswordShown ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="link"
                onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                className="ms-2 p-0"
                style={{ height: '38px' }}
              >
                {confirmPasswordShown ? <EyeSlash size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 rounded" style={{ height: '40px' }}>
            Signup
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Signup;
