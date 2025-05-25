import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    const { success, message } = await login(formData);
    if (success) {
      nav('/home');
    } else {
      setError(message || "Incorrect username or password");
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
          };
          handleSubmit(formData);
        }}
      >
        <div>
          <label>Username:</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => nav('/register')}>Register</button>
    </>
  );
}
