import React, { useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import ParentNav from "../../pages/ParentNav";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function ChildForm({ parentId }) {
  const [name, setName] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log("Saving Date of Birth:", dateOfBirth); // Debugging line
    const isSuccess = await saveChild();
    if (isSuccess) {
      navigate("/parent", { replace: true });
    }
  };
  
  const handleAddAnotherChild = async () => {
    console.log("Adding another child, Date of Birth:", dateOfBirth); // Debugging line
    const isSuccess = await saveChild();
    if (isSuccess) {
      resetForm();
    }
  };

  const saveChild = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await axios.post(
      `${backendURL}/api/child`,
      {
        name,
        previousSchool,
        dateOfBirth,
        gender,
        parent: parentId,
      },
      getAuthHeader()
    );

    if (response.status === 201) {
      console.log("Child created:", response.data);
      return true;
    } else {
      console.error("Failed to create child:", response.data);
      return false;
    }
  };

  const resetForm = () => {
    setName("");
    setPreviousSchool("");
    setDateOfBirth("");
    setGender("");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "100%" }}>
        <ParentNav />
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" onClick={() => navigate("/parent")}>
           Home
          </Link>
          <Typography color="textPrimary">Add Child</Typography>
        </Breadcrumbs>
      </div>
      <Paper
        elevation={3}
        style={{ maxWidth: "300px", padding: "20px", marginTop: "20px" }}
      >
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <h2 className="form-title">학생추가</h2>
          <p className="text-red">
            (본인 자녀가 아닌 경우, 예약은 무효 처리됩니다.)
          </p>
          <FormControl fullWidth margin="normal">
            <TextField
              label="학생(유아) 한글명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="현재 재원중인 기관명"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              type="date"
              label="생년월일"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="gender-label">성별</InputLabel>
            <Select
              labelId="gender-label"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>성별을 선택하세요</em>
              </MenuItem>
              <MenuItem value="male">남성</MenuItem>
              <MenuItem value="female">여성</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSave}>
            저장
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddAnotherChild}
          >
            다른학생 추가하기
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default ChildForm;
