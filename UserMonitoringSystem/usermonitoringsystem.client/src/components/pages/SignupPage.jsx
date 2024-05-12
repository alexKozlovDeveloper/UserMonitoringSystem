import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import '../../styles/SignupPage.css'

const SignupPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessages(['Passwords do not match']);
      return;
    }

    try {
      const response = await fetch('register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        setRegistrationSuccessful(true);
      } else {
        const errorData = await response.json();
        const passwordRequirements = Object.values(errorData.errors).map(arr => arr[0]);
        setErrorMessages(passwordRequirements);
      }
    } catch (error) {
      setErrorMessages([error]);
    }
  };

  return (
    registrationSuccessful === true ?
      <div className='signup-form-container'>
        <div>
          <div style={{ color: 'green' }}>Your account has been created!</div>
          <br />
          Please proceed to <Link className='header-link' to="/login">Login</Link> to access your account.
        </div>
      </div>
      :
      <div>
        <h2>Create an account</h2>
        <div className='signup-form-container'>
          <form className='signup-form' onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {errorMessages &&
              <div style={{ color: 'orange' }}>
                {errorMessages.map((error, i) => (
                  <div>{error}</div>
                ))}
              </div>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div>
          Already have an account? <Link className='header-link' to="/login">Login</Link>
        </div>
      </div>
  );
};

export default SignupPage;