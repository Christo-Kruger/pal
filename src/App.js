import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import ParentProtectedRoute from './components/ParentProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './pages/Admin';
import AddChild from '../src/components/Parents/AddChild';
import UpdateDetail from '../src/components/Parents/UpdateDetail';
import UpdateChild from '../src/components/Parents/UpdateChild';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      {/* Use BrowserRouter and set basename */}
      <BrowserRouter basename="/">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="./login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/update-details" element={<UpdateDetail />} />
          <Route path="/update-child" element={<UpdateChild />} />

          <Route path="/parent/*" element={<ParentProtectedRoute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
