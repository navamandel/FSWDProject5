import { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage to persist login on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const login = async ({ username, password }) => {
      try {
        const response = await fetch(
          `http://localhost:3000/users?username=${username}&password=${password}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const users = await response.json();

        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          setIsLoggedIn(true);
          return { success: true };
        } else {
          return { success: false, message: 'Incorrect username or password' };
        }
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Server error during login' };
      }
    };




  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  const register = async ({ username, password }) => {
    try {
      const response = await fetch('http://localhost:3000/users');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const users = await response.json();

      if (users.find((usr) => usr.username === username)) {
        return { success: false, message: 'Username already exists' };
      }

      const newUser = { username, password };

      // Post new user and get created user with ID
      const postResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!postResponse.ok) {
        throw new Error(`Failed to register: ${postResponse.status}`);
      }

      const createdUser = await postResponse.json();

      // Save full user (with id) to localStorage and state
      localStorage.setItem('user', JSON.stringify(createdUser));
      setUser(createdUser);
      setIsLoggedIn(true);

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
