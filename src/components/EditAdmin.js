import React, { useState, useEffect } from 'react';
import EditAdminModal from './EditAdminModal';
import { toast } from 'react-toastify';



function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    async function fetchAdmins() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admins`);
      const data = await response.json();
      setAdmins(data);
    }
    
    fetchAdmins();
  }, []);

  const handleEditOpen = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleEditClose = () => {
    setSelectedAdmin(null);
  };

  const handleEditSave = async (updatedAdminData) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin/${selectedAdmin._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAdminData),
    });

    if(response.ok) {
      const updatedAdmin = await response.json();
      toast.success("Admin data updated successfully!");
      setAdmins(prevAdmins => prevAdmins.map(a => a._id === updatedAdmin._id ? updatedAdmin : a));
      setSelectedAdmin(null);
    } else {
      // Handle error
    }
  };

  const handleDelete = async (adminId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this admin?");
  
    if (isConfirmed) {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin/${adminId}`, {
        method: 'DELETE',
      });

      if(response.ok) {
        setAdmins(prevAdmins => prevAdmins.filter(a => a._id !== adminId));
        toast.success("Admin deleted successfully!");
      } else {
        // Handle error
        toast.error("An error occurred while deleting the admin.");
      }
    }
  };
  return (
    <div>
      <h2>Admin List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Campus</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>{admin.campus}</td>
              <td>
                <button onClick={() => handleEditOpen(admin)}>Edit</button>
                <button onClick={() => handleDelete(admin._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAdmin && (
        <EditAdminModal 
          admin={selectedAdmin} 
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default AdminList;
