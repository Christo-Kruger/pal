import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ParentNav from "../../pages/ParentNav";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";



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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "100%" }}>
        <ParentNav />
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/parent">
            Parent
          </Link>
          <Typography color="textPrimary">Update Child</Typography>
        </Breadcrumbs>
      </div>
      <h3 style={{ marginTop: "20px" }}>학생정보 편집</h3>
      <Link to="/add-child">
        <Button
          style={{ minWidth: "300px" }}
          variant="contained"
          color="primary"
        >
          학생 추가
        </Button>
      </Link>
      <div className="edit-child-box">
      {editedChildren.map((child, index) => (
        <Box key={child.id || index} className="child-details-card" mb={3}>
          <h5>학생(유아) {index + 1}</h5>

          <Box mb={2}>
            <TextField
              label="학생(유아) 한글명"
              value={child.name}
              onChange={(e) => handleChildChange(index, "name", e.target.value)}
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="현재 재원중인 기관명:"
              value={child.previousSchool}
              onChange={(e) =>
                handleChildChange(index, "previousSchool", e.target.value)
              }
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="생년월일:"
              type="date"
              value={child.dateOfBirth}
              onChange={(e) =>
                handleChildChange(index, "dateOfBirth", e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <Select
              label="성별:"
              value={child.gender}
              onChange={(e) =>
                handleChildChange(index, "gender", e.target.value)
              }
              fullWidth
            >
              <MenuItem value="male">남성</MenuItem>
              <MenuItem value="female">여성</MenuItem>
            </Select>
          </Box>

          <div>
            <label>
              <strong>2024년 예비 학년/연령</strong>
            </label>
            <p>{child.testGrade}</p>
          </div>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleChildSave(index)}
              disabled={isSaving}
              style={{ width: "100px" }}
            >
              {isSaving ? "저장..." : "저장"}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleChildDelete(index, child._id)}
              disabled={isSaving}
              style={{ maxwidth: "200px" }}
            >
              삭제
            </Button>
          </Box>
        </Box>
      ))}
      </div>
    </div>
  );
}

export default UpdateChild;
