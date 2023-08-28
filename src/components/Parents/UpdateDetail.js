import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/UpdateDetails.css";
import { getUserPhone, getUserName, getUserEmail, getUserCampus, getUserId  } from '../../utils/auth';

function UpdateDetail() {
  const [editedParent, setEditedParent] = useState({
    _id: getUserId(),
    name: '',
    phone: '',
    email: '',
    campus: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedParent({
      _id: getUserId(),
      name: getUserName(),
      phone: getUserPhone(),
      email: getUserEmail(),
      campus: getUserCampus()
    });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const { _id, ...updateData } = editedParent;
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/parent/${editedParent._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );

    setIsLoading(false);

    if (response.ok) {
      toast.success("Parent updated successfully");

      // update the user details in the local storage
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      const errorData = await response.json();
      toast.error("Failed to update parent: " + errorData.message);
    }
  };



  return (
    <div className="container">
      <div className="edit-parent">
        <h3>Edit Parent Details</h3>
        <div className="input-group">
          <label>Name:</label>
          <input
            value={editedParent.name}
            onChange={(e) =>
              setEditedParent({ ...editedParent, name: e.target.value })
            }
          />

          <label>Phone Number:</label>
          <input
            value={editedParent.phone}
            onChange={(e) =>
              setEditedParent({ ...editedParent, phone: e.target.value })
            }
          />

          <label>Email:</label>
          <input
            value={editedParent.email}
            onChange={(e) =>
              setEditedParent({ ...editedParent, email: e.target.value })
            }
          />

          <label>Campus:</label>
          <select
            value={editedParent.campus}
            onChange={(e) =>
              setEditedParent({ ...editedParent, campus: e.target.value })
            }
          >
            <option value="Bundang">Bundang</option>
            <option value="Dongtan">Dongtan</option>
            <option value="Suji">Suji</option>
          </select>
        </div>
        <div className="actions">
          <button className="save-button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDetail;
