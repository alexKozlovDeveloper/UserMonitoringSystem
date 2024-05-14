import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useUser } from '../UserContext';

import Header from '../common/Header';
import UserAvatar from '../common/UserAvatar';

import '../../styles/ProfilePage.css'

const ProfilePage = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState();
    const [selectedFile, setSelectedFile] = useState(null);

    const searchParams = new URLSearchParams(window.location.search);
    var userId = searchParams.get('userId')

    const { user } = useUser();

    if(userId === null) {        
        userId = user.id
    }    

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

      const handleUploadImage = async () => {
        try {
          if (!selectedFile) {
            console.error('No file selected');
            return;
          }
      
          const formData = new FormData();
          formData.append('file', selectedFile);
          await axios.post(`/users/${userId}:uploadImage`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Image uploaded successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };

    return (
        <div>
            <Header />
            <h2>User Detail</h2>
            <div className='user-data-container'>
                {userData ? (
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Avatar</strong>
                                </td>
                                <td>
                                    <UserAvatar userId={userId} />
                                    <div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                        <button onClick={handleUploadImage}>Upload</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Id:</strong>
                                </td>
                                <td>{userData.id}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Name:</strong>
                                </td>
                                <td>{userData.userName}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Login Count:</strong>
                                </td>
                                <td>{userData.loginCount}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Last Login At:</strong>
                                </td>
                                <td>{userData.lastLoginAt}</td>
                            </tr>
                            {/* <tr>
                        <td><strong>Roles:</strong></td>
                        <td>{userData.roles.join(', ')}</td>
                      </tr> */}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )

    async function fetchUserData() {
        try {
            const response = await fetch(`users/${userId}`);

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                }
            }

            const data = await response.json();

            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    }
}

export default ProfilePage;
