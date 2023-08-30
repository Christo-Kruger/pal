import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/EditChild.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import backArrow from "../../styles/back_arrow.png";

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
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/child`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setChildren(data);
          setEditedChildren(
            data.map((child) => ({
              ...child,
              dateOfBirth: child.dateOfBirth
                ? new Date(child.dateOfBirth).toISOString().split("T")[0]
                : "",
            }))
          );
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
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/child/${child._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(child),
        }
      );

      if (response.ok) {
        const updatedChild = await response.json();
        const updatedChildren = editedChildren.map((child, i) =>
          i === index ? updatedChild : child
        );
        setChildren(updatedChildren);
        setEditedChildren(updatedChildren);
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

  const handleChildDelete = async (index, childId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this child?"
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/child/${childId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          toast.success("Child deleted successfully");
          const updatedChildren = editedChildren.filter(
            (child, i) => i !== index
          );
          setEditedChildren(updatedChildren);
        } else {
          toast.error("Failed to delete child");
        }
      } catch (error) {
        console.error("Error deleting child:", error);
        toast.error("An error occurred while deleting child");
      }
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
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="top-left-arrow">
        <Link to="/parent">
          <img src={backArrow} alt="Back to Parent Page" />
        </Link>
      </div>
      <h3>자녀 세부정보 편집</h3>
      <Link to="/add-child">
        <button className="button" aria-label="Add Child">
          자녀 추가
        </button>
      </Link>
      <div className="edit-child-box">
        {editedChildren.map((child, index) => (
          <div key={child.id || index} className="child-details-card">
            <h5>어린이{index + 1}</h5>
            <div className="child-input">
              <label>이름:</label>
              <input
                value={child.name}
                onChange={(e) =>
                  handleChildChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="child-input">
              <label>이전 학교:</label>
              <input
                value={child.previousSchool}
                onChange={(e) =>
                  handleChildChange(index, "previousSchool", e.target.value)
                }
              />
            </div>
            <div className="child-input">
              <label>생일:</label>
              <input
                type="date"
                value={child.dateOfBirth}
                onChange={(e) =>
                  handleChildChange(index, "dateOfBirth", e.target.value)
                }
              />
            </div>
            <div className="child-input">
              <label>성별:</label>
              <select
                value={child.gender}
                onChange={(e) =>
                  handleChildChange(index, "gender", e.target.value)
                }
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <div>
              <label>시험 등급:</label>
              <p>{child.testGrade}</p>
            </div>
            <div className="child-actions">
              <button
                className="save-button"
                onClick={() => handleChildSave(index)}
                disabled={isSaving}
              >
                {isSaving ? "절약..." : "구하다"}
              </button>
              <button
                className="delete-button"
                onClick={() => handleChildDelete(index, child._id)}
                disabled={isSaving}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateChild;
