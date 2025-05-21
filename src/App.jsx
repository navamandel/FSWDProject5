import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Info from './pages/Info';
import Todos from './pages/Todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';

function App() {
  const isLoggedIn = localStorage.getItem('user'); // assuming user is stored as JSON string

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        {isLoggedIn ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/home/info" element={<Info />} />
            <Route path="/home/todos" element={<Todos />} />
            <Route path="/home/posts" element={<Posts />} />
            <Route path="/home/albums" element={<Albums />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
