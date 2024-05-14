import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { useUser } from '../UserContext';

import '../../styles/LoginPage.css'

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { fetchCurrentUser } = useUser();

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('login?useCookies=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        fetchCurrentUser();
        navigate("/")
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('Network error');
    }
  };

  return (
    <div>
      <h2>Login to your account</h2>
      <div className='login-form-container'>
        <form className='login-form' onSubmit={handleSubmit}>
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
          {errorMessage && <p style={{ color: 'orange' }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        Don't have an account? <Link className='header-link' to="/signup">Sign up</Link>
      </div>
      <div className='testing-note'>
        <div>
          For testing:
          <br />
          <strong>email:</strong> admin@admin.com
          <br />
          <strong>password:</strong> $Admin1
        </div>
      </div>
    </div>
  );
};

export default LoginPage;