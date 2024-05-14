import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import UserAvatar from '../common/UserAvatar';
import { useUser } from '../UserContext';

import '../../styles/UsersPage.css'

const UsersPage = () => {

  const { user } = useUser();

  const navigate = useNavigate();

  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  const contents = usersData === undefined
    ? <h2>Loading...</h2>
    :
    <div className='items-container'>
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Login Count</th>
            <th>Last Login At</th>
            <th>Avatar</th>
            <th>Profile</th>
            {user.roles.includes('admin') ? <th></th> : null}
            {user.roles.includes('admin') ? <th></th> : null}
          </tr>
        </thead>
        <tbody>
          {usersData.map(item =>
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.userName}</td>
              <td>{item.roles}</td>
              <td>{item.loginCount}</td>
              <td>{item.lastLoginAt}</td>
              <td><UserAvatar userId={item.id} /></td>
              <td><Link className='header-link' to={`/profile?userId=${item.id}`}>Profile</Link></td>
              {GetMakeAdminButton(item)}
              {GetDeleteButton(item)}
            </tr>
          )}
        </tbody>
      </table>
    </div>;

  return (
    <div>
      <Header />
      <h1 id="tabelLabel">Users Info</h1>
      {contents}
    </div>
  )

  function GetMakeAdminButton(item) {
    if (user.roles.includes('admin') === false) {
      return null;
    }

    let isDisabled = item.roles.includes('admin')

    return (
      <td>
        <button disabled={isDisabled} onClick={() => makeAdmin(item.id)}>Make admin</button>
      </td>
    )
  }

  function GetDeleteButton(item) {
    if (user.roles.includes('admin') === false) {
      return null;
    }

    let isDisabled = user.id === item.id

    return (
      <td>
        <td><button disabled={isDisabled} onClick={() => deleteUser(item.id)}>Delete</button></td>
      </td>
    )
  }

  async function getUserData() {
    try {
      const response = await fetch('users');

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
      }

      const data = await response.json();

      setUsersData(data);
    } catch (error) {
      console.log(error)
    }
  }

  async function makeAdmin(userId) {
    try {
      const response = await fetch(`users/${userId}:changeRoles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['admin'])
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
      }

      getUserData();
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteUser(userId) {
    try {
      const response = await fetch(`users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
      }

      getUserData();
    } catch (error) {
      console.log(error)
    }
  }
}

export default UsersPage;
