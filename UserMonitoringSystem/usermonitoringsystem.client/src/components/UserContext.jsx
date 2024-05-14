import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/users/@me');
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [history]);

  const logout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: '{}',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, fetchCurrentUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);