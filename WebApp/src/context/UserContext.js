import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for user info
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // On initial load or refresh, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user from LocalStorage
    }
  }, []);

  // Login function to set user info in both state and localStorage
  const loginUser = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo)); // Store in localStorage
  };

  // Logout function to clear both state and localStorage
  const logoutUser = () => {
    setUser({});
    localStorage.removeItem('user'); // Clear from localStorage
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
