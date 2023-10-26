import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ParentNav from "../../pages/ParentNav";
import {
  getUserPhone,
  getUserName,
  getUserEmail,
  getUserCampus,
  getUserId,
} from "../../utils/auth";
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";


function UpdateDetail() {
  const [editedParent, setEditedParent] = useState({
    _id: getUserId(),
    name: "",
    phone: "",
    email: "",
    campus: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedParent({
      _id: getUserId(),
      name: getUserName(),
      phone: getUserPhone(),
      email: getUserEmail(),
      campus: getUserCampus(),
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
      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      const errorData = await response.json();
      toast.error("Failed to update parent: " + errorData.message);
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "100%" }}>
        <ParentNav />
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/parent">
            Home
          </Link>
          <Typography color="textPrimary">Update Details</Typography>
        </Breadcrumbs>
      </div>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Paper elevation={3} style={{ maxWidth: "300px", padding: "20px" }}>
          <Container>
            <Box mb={2}>
              <Typography variant="h3">내 정보</Typography>
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="학부모이름:"
                value={editedParent.name}
                onChange={(e) =>
                  setEditedParent({ ...editedParent, name: e.target.value })
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="전화번호:"
                value={editedParent.phone}
                onChange={(e) =>
                  setEditedParent({ ...editedParent, phone: e.target.value })
                }
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="이메일:"
                value={editedParent.email}
                onChange={(e) =>
                  setEditedParent({ ...editedParent, email: e.target.value })
                }
              />
            </Box>
            <Box mb={2}>
              <Typography>캠퍼스: {editedParent.campus}</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "저장"}
              </Button>
            </Box>
          </Container>
        </Paper>
      </div>
    </div>
  );
}

export default UpdateDetail;
