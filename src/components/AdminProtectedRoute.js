import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import AdminDashboard from '../pages/AdminDashboard';

function AdminProtectedRoute() {
  const role = getUserRole();

  return role === 'admin' ? 
  (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      {/* other admin routes go here */}
    </Routes>
  ) 
  : <Navigate to="/login" />;
}

export default AdminProtectedRoute;

