import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as Yup from 'yup';
import '../styles/form.css'; 


const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      await loginSchema.validate(formData);
      const { success, message } = await login(formData);
      if (success) {
        nav('/home');
      } else {
        setError(message || 'Incorrect username or password');
      }
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  return (
    <div className="login-container">
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
      {error && <p className="error">{error}</p>}
      <button onClick={() => nav('/register')}>Register</button>
    </div>
  );
}
