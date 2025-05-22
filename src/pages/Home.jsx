import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  if (!user) return null; // While loading or redirecting

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setInfoVisible(!infoVisible)}>Info</button>
        <button onClick={() => handleNavigate('todos')}>Todos</button>
        <button onClick={() => handleNavigate('posts')}>Posts</button>
        <button onClick={() => handleNavigate('albums')}>Albums</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {infoVisible && (
        <div style={{ border: '1px solid gray', padding: '10px', maxWidth: '400px' }}>
          <h3>User Info</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Website (Password):</strong> {user.website}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
