import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // adjust path if needed

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

  if (!user) return null;

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setInfoVisible(!infoVisible)}>Toggle Info</button>
      </div>

      {infoVisible && (
        <div style={{ border: '1px solid gray', padding: '10px', maxWidth: '400px', margin: '0 auto' }}>
          <h3>User Info</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Website (Password):</strong> {user.website}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
