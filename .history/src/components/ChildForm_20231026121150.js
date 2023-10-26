import React, { useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Container, FormControl, FormLabel, Paper, TextField, Typography } from "@material-ui/core";

function ChildForm({ parentId }) {
  const [name, setName] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setLoading(true);
    const isSuccess = await saveChild();
    if (isSuccess) {
      navigate("/parent", { replace: true });
    }
  };

  const handleAddAnotherChild = async () => {
    setLoading(true);
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

    setLoading(false);

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
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "450px",
          width: "100%",
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Typography variant="h4" style={{ marginBottom: "20px", textAlign: "center" }}>
            학생정보
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">학생(유아)한글명:</FormLabel>
            <TextField
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl component="fieldset" fullWidth style={{ marginTop: "20px" }}>
            <FormLabel component="legend">현재 재원중인 기관명:</FormLabel>
            <TextField
              id="previousSchool"
              type="text"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl component="fieldset" fullWidth style={{ marginTop: "20px" }}>
            <FormLabel component="legend">생년월일:</FormLabel>
            <TextField
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl component="fieldset" fullWidth style={{ marginTop: "20px" }}>
            <FormLabel component="legend">성별:</FormLabel>
            <TextField
              id="gender"
              select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              variant="outlined"
            >
              <option value="">성별을 선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </TextField>
          </FormControl>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading} style={{ marginTop: "20px" }}>
            {loading ? <CircularProgress size={24} /> : "등록"}
          </Button>
          <Button onClick={handleAddAnotherChild} variant="outlined" disabled={loading} style={{ marginTop: "20px" }}>
            {loading ? <CircularProgress size={24} /> : "학생 추가"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
  
}

export default ChildForm;
