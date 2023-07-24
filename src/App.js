// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ParentProtectedRoute from './components/ParentProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminProtectedRoute />} />
          <Route path="/parent/*" element={<ParentProtectedRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
