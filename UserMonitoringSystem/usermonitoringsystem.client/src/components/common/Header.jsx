import React from 'react';

import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';

import UserAvatar from './UserAvatar';

import '../../styles/Header.css'

const Header = () => {

  const { user } = useUser();

  console.log(user);

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
      <div className='user-info-container'>
        <div>
          Hello <strong>{user.userName}</strong>
        </div>
        <div>
          <Link className='header-link' to="/login" onClick={handleLogout}>Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;