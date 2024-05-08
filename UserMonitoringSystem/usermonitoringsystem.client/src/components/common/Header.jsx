import React from 'react';

import { Link } from 'react-router-dom';

import '../../styles/Header.css'

const Header = () => {
  return (
    <div className='header-container'>
      <div>
        <Link className='header-link' to="/">Home</Link>
        <Link className='header-link' to="/profile">Profile</Link>
        <Link className='header-link' to="/weatherforecast">Weather Forecast</Link>
        <Link className='header-link' to="/usersmonitoring">Users</Link>
      </div>
      <div>
        <Link className='header-link' to="/signup">Signup</Link>
        <Link className='header-link' to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Header;