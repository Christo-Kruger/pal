import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/EditChild.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';


function UpdateChild() {
  const { token } = useAuth();
  const [children, setChildren] = useState([]);
  const [editedChildren, setEditedChildren] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/child`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        if (response.ok) {
          const data = await response.json();
          setChildren(data);
          setEditedChildren(data.map(child => ({
            ...child,
            dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : ''
          })));
        } else {
          console.error("Failed to fetch children");
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [token]);

  const handleChildSave = async (index) => {
    try {
      setIsSaving(true);
      const child = editedChildren[index];
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/child/${child._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(child),
      });

      if (response.ok) {
        toast.success("Child updated successfully");
      } else {
        toast.error("Failed to update child");
      }
    } catch (error) {
      console.error("Error updating child:", error);
      toast.error("An error occurred while updating child");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChildChange = (index, field, value) => {
    const childrenCopy = [...editedChildren];

    if (childrenCopy[index]) {
        childrenCopy[index][field] = value;
    }

    setEditedChildren(childrenCopy);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><CircularProgress /></div>;
  }

  return (
    <div className="container">
      <h3>Edit Child Details</h3>
      <Link to="/add-child">
        <button className="button" aria-label="Add Child">
          Add Child
        </button>
      </Link>
      <div className="edit-child-box">
        {editedChildren.map((child, index) => (
          <div key={child.id || index} className="child-details-card">
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="child-actions">
              <button className="save-button" onClick={() => handleChildSave(index)} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Child"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default UpdateChild;
