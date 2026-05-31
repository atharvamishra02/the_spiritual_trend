import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Updated login function with API call
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      const { user: userData, token } = res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  useEffect(() => {
    // Optionally, sync with localStorage or validate token here
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 