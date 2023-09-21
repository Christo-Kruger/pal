import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/EditParentModal.css";
import { toast } from "react-toastify";

function EditParentModal({ isOpen, onRequestClose, onParentUpdated, parent }) {
  const [editedParent, setEditedParent] = useState({
    ...parent,
    children: parent.children.map(child => ({
      ...child,
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : ''
    }))
  });


  const handleChildDelete = async (index) => {
    try {
      const child = editedParent.children[index];
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/child/${child._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Child deleted successfully");
        setEditedParent(prevState => ({
          ...prevState,
          children: prevState.children.filter((_, i) => i !== index)
        }));
      } else {
        toast.error("Failed to delete child");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete child");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/parent/${parent._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedParent),
        }
      );

      if (response.ok) {
        toast.success("Parent updated successfully");
        onParentUpdated(await response.json());
        onRequestClose();
      } else {
        toast.error("Failed to update parent");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update parent");
    }
  };
  const handleDeleteParent = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this parent? This action cannot be undone.");
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user/${parent._id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("Parent deleted successfully");
        onRequestClose(); // Close the modal
        onParentUpdated(null); 
      } else {
        toast.error("Failed to delete parent");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete parent");
    }
  };
  
  
  const handleChildSave = async (index) => {
    try {
      const child = editedParent.children[index];
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/child/${child._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(child),
        }
      );

      if (response.ok) {
        toast.success("Child updated successfully");
      } else {
        toast.error("Failed to update child");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update child");
    }
  };

  const handleChildChange = (index, field, value) => {
    setEditedParent(prevState => ({
      ...prevState,
      children: prevState.children.map((child, i) => i === index ? { ...child, [field]: value } : child)
    }));
  };



  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="edit-parent-modal" style={{content: {overflow: 'auto'}}}>
        
        <div className="content">
        <button className="close-modal" onClick={onRequestClose}>x</button>
        <h3>Edit Parent Details</h3>
        
        <div className="input-group">
            <div>
                <label>Name:</label>
                <input
                    value={editedParent.name}
                    onChange={(e) =>
                        setEditedParent({ ...editedParent, name: e.target.value })
                    }
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    value={editedParent.phone}
                    onChange={(e) =>
                        setEditedParent({ ...editedParent, phone: e.target.value })
                    }
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    value={editedParent.email}
                    onChange={(e) =>
                        setEditedParent({ ...editedParent, email: e.target.value })
                    }
                />
            </div>
            <div>
            <label>Campus:</label>
    <select
        value={editedParent.campus}
        onChange={(e) => setEditedParent({ ...editedParent, campus: e.target.value })}
    >
         <option value="분당">분당</option>
                <option value="동탄">동탄</option>
                <option value="수지">수지</option>
     
    </select>
       
   
</div>
        </div>

        <h4>Children:</h4>
        <div className="input-group">
            {editedParent.children && editedParent.children.map((child, index) => (
                <div key={index} className="child-details-card">
                    <h5>Child {index + 1}</h5>
  
                    <div className="child-input">
                        <label>Name:</label>
                        <input
                            value={child.name}
                            onChange={e => handleChildChange(index, 'name', e.target.value)}
                        />
                    </div>
                    
                    <div className="child-input">
                        <label>Previous School:</label>
                        <input
                            value={child.previousSchool}
                            onChange={e => handleChildChange(index, 'previousSchool', e.target.value)}
                        />
                    </div>
  
                    <div className="child-input">
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            value={child.dateOfBirth}
                            onChange={e => handleChildChange(index, 'dateOfBirth', e.target.value)}
                        />
                    </div>
  
                    <div className="child-input">
                        <label>Gender:</label>
                        <select
                            value={child.gender}
                            onChange={e => handleChildChange(index, 'gender', e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    
                    <div className="child-actions">
                        <button className="save-button" onClick={() => handleChildSave(index)}>Save Child</button>
                        <button className="delete-button" onClick={() => handleChildDelete(index)}>Delete Child</button>
                    </div>
                </div>
            ))}
        </div>
  
        <div className="actions">
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="delete-button" onClick={handleDeleteParent}>Delete Parent</button>
       
        </div>
    </div>
    </Modal>
);

  
}

export default EditParentModal;
