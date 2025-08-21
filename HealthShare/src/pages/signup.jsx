
import React, { useState } from 'react';
import { Form, Button, ToggleButton, ButtonGroup, Container } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function Signup() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [role, setRole] = useState('patient');

  return (
    <Container className="mt-5">
      <div style={{ width: '25rem' }}>
        {/* Signup Heading */}
        <h3 className="mb-3">Signup</h3>

        {/* Doctor/Patient Toggle*/}
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

        {/* Username */}
        <Form.Group className="mb-3 text-start" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3 text-start" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3 text-start" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type={passwordShown ? 'text' : 'password'}
              placeholder="Enter password"
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
              placeholder="Confirm password"
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
        <Button
          variant="primary"
          type="submit"
          className="w-100 rounded"
          style={{ height: '40px' }}
        >
          Signup
        </Button>
      </div>
    </Container>
  );
}

export default Signup;
