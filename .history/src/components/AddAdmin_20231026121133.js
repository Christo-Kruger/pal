import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("admin");
  const [campus, setCampus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, role, campus }),
      });

      if (response.ok) {
        toast.success("New admin created!");
      } else {
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: "80px" }}>Admin Registration</h1>
      <Container style={{ maxWidth: "600px", marginTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "15px" }}>
        <Typography style={{ textAlign: "center" }} variant="h4" component="h1">
          Add New Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>
          <FormControl fullWidth margin="normal">
            <InputLabel>Campus</InputLabel>
            <Select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>--옵션을 선택해주세요--</em>
              </MenuItem>
              <MenuItem value="수지">수지</MenuItem>
              <MenuItem value="동탄">동탄</MenuItem>
              <MenuItem value="분당">분당</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" color="primary" type="submit">
              Add Admin
            </Button>
          </FormControl>
        </form>
        <ToastContainer />
        </Paper>
      </Container>
    </div>
  );
}

export default RegistrationForm;
