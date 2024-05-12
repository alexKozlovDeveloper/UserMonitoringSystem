import React from 'react';

import { Link } from 'react-router-dom';

import '../../styles/Header.css'

const Header = () => {

  async function handleLogout() {

    await fetch('logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: '{}',
    });
  }

  return (
    <div className='header-container'>
      <div>
        <Link className='header-link' to="/">Weather Forecast</Link>
        <Link className='header-link' to="/profile">Profile</Link>
        <Link className='header-link' to="/users">Users</Link>
      </div>
      <div>
        <Link className='header-link' to="/login" onClick={handleLogout}>Logout</Link>
      </div>
    </div>
  );
};

export default Header;