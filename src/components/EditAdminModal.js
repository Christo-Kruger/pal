import React, { useState } from 'react';

function EditAdminModal({ admin, onClose, onSave }) {
  const [editedData, setEditedData] = useState({
    name: admin.name,
    email: admin.email,
    role: admin.role,
    campus: admin.campus
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    zIndex: 1000,
    width: '400px',
    borderRadius: '5px'
  };

  const overlayStyle = {
    position: 'fixed',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999
  };

  return (
    <div>
      <div style={overlayStyle} onClick={onClose}></div>
      <div style={modalStyle}>
        <h2>Edit Admin</h2>
        <label>
          Name: 
          <input name="name" value={editedData.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input name="email" value={editedData.email} onChange={handleChange} />
        </label>
        {/* Similarly handle role and campus with <select> if needed */}
        <div>
          <button onClick={() => onSave(editedData)}>Save Changes</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default EditAdminModal;
