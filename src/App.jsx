import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import Todos from './pages/Todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';
import Album from './components/Album';


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
        <Route path='/albums'element={<Albums />} />
        <Route path='/albums/:id' element={<Album />} />
        <Route path='*' element={<h1>Error 404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
