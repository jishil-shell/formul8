import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for user info
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // On initial load or refresh, check if user data exists in localStorage
  useEffect(() => {
    let userInfo = localStorage.getItem('user');
    userInfo = userInfo ? JSON.parse(userInfo) : {};
    if (userInfo) {
     // storedUser = JSON.parse(storedUser);
      if(userInfo.username) {
        setUser(userInfo);
      } else {
        logoutUser();
      }
    }
  }, []);

  // Login function to set user info in both state and localStorage
  const loginUser = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  // Logout function to clear both state and localStorage
  const logoutUser = () => {
    setUser({});
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
