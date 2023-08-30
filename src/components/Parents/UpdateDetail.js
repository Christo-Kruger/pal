import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/UpdateDetails.css";
import { Link } from "react-router-dom";
import backArrow from '../../styles/back_arrow.png'
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
      <div className="top-left-arrow">
        <Link to="/parent">
        <img src={backArrow} alt="Back to Parent Page" />
        </Link>
        </div>
      <div className="edit-parent">
        <h3>
상위 세부정보 편집</h3>
        <div className="input-group">
          <label>이름:</label>
          <input
            value={editedParent.name}
            onChange={(e) =>
              setEditedParent({ ...editedParent, name: e.target.value })
            }
          />

          <label>전화 번호:</label>
          <input
            value={editedParent.phone}
            onChange={(e) =>
              setEditedParent({ ...editedParent, phone: e.target.value })
            }
          />

          <label>이메일:</label>
          <input
            value={editedParent.email}
            onChange={(e) =>
              setEditedParent({ ...editedParent, email: e.target.value })
            }
          />

          <label>교정:</label>
          <p>{editedParent.campus}</p>
        </div>
        <div className="actions">
          <button className="save-button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? '업데이트 중...' : '업데이트'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDetail;
