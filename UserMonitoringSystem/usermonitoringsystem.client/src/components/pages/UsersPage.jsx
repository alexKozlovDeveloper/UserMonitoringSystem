import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../common/Header';

import UserAvatar from '../common/UserAvatar';

import '../../styles/UsersPage.css'

const UsersPage = () => {

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
              <th>User Name</th>
              <th>Roles</th>
              <th>Login Count</th>
              <th>Last Login At</th>
              <th>Avatar</th>
              <th>profile</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map(user =>
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.roles}</td>
                <td>{user.loginCount}</td>
                <td>{user.lastLoginAt}</td>
                <td><UserAvatar userId={user.id}/></td>
                <td>profile</td>
                <td>delete</td>
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
            // TODO: log error
        }
    }
}

export default UsersPage;
