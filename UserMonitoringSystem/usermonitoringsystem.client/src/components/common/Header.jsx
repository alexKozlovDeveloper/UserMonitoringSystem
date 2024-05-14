import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

import '../../styles/Header.css'

const Header = () => {
  const { user, logout } = useUser();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className='header-container'>
      <div>
        <Link className='header-link' to="/">Weather Forecast</Link>
        <Link className='header-link' to="/profile">My Profile</Link>
        <Link className='header-link' to="/users">Users</Link>
        <Link className='header-link' to="/temperature">Temperature</Link>
      </div>
      <div className='user-info-container'>
        {user ?
          <div>
            Hello <strong>{user.userName}</strong>
          </div>
          :
          null}
        <div>
          <Link className='header-link' to="/login" onClick={handleLogout}>Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;