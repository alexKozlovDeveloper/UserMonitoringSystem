import React from 'react';

import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';

import '../../styles/Header.css'

const Header = () => {

  const { user, logout } = useUser();

  console.log(user);

  async function handleLogout() {
console.log('try logout');
    await logout();
    console.log('already logout');


    // await fetch('logout', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'accept': '*/*'
    //   },
    //   body: '{}',
    // });
  }

  return (
    <div className='header-container'>
      <div>
        <Link className='header-link' to="/">Weather Forecast</Link>
        <Link className='header-link' to="/profile">My Profile</Link>
        <Link className='header-link' to="/users">Users</Link>
      </div>
      <div className='user-info-container'>
        { user ?
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