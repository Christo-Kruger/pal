import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import ParentDashboard from '../pages/ParentDashboard';

function ParentProtectedRoute() {
  const role = getUserRole();

  return role === 'parent' ? 
  (
    <Routes>
      <Route path="/" element={<ParentDashboard />} />
      {/* other parent routes go here */}
    </Routes>
  ) 
  : <Navigate to="/login" />;
}

export default ParentProtectedRoute;

