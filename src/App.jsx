import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import Todos from './pages/Todos';
import Posts from './pages/Posts';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path='/completeprofile' element={<CompleteProfile />} />
        <Route path='/todos' element={<Todos />} />
        <Route path='/posts' element={<Posts />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
