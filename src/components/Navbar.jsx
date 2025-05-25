// components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';  

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <span className="navbar-user">Welcome, {user.name}</span>
      <div className="navbar-links">
        <button onClick={() => navigate('/todos')}>Todos</button>
        <button onClick={() => navigate('/posts')}>Posts</button>
        <button onClick={() => navigate('/albums')}>Albums</button>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}
