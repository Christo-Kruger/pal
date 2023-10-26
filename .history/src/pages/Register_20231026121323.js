import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import ChildForm from "../components/ChildForm";
import Logo from "../media/logo.png";

function RegistrationForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [campus, setCampus] = useState("");
  const [showChildForm, setShowChildForm] = useState(false);
  const [parentId, setParentId] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendURL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone, campus }),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (data.role === "parent") {
        setParentId(data._id); // Assuming backend returns the user's _id
        setShowChildForm(true);
        setShowRegistrationForm(false);
      } else if (data.role === "admin") {
        navigate("/admin", { replace: true });
      }
    } else {
      const errorData = await response.json();
      console.error(errorData);
      setError(
        errorData.message ||
          "이미 가입되어있습니다. 비밀번호 확인해주시기 바랍니다."
      );
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#444444"
      }}
    >
    {showRegistrationForm && (
        <Paper
          elevation={3}
          style={{
            padding: "30px",
            borderRadius: "15px",
            maxWidth: "450px",
            width: "100%",
          }}
        >
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{
              maxWidth: "10em",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </Link>
        <form onSubmit={handleSubmit}>
          <Typography
            variant="h4"
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            회원가입
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">학부모이름:</FormLabel>
            <TextField
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            <FormLabel component="legend">전화번호</FormLabel>
            <TextField
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            <FormLabel component="legend">이메일:</FormLabel>
            <TextField
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl
            component="fieldset"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            <FormLabel component="legend">비밀번호:</FormLabel>
            <TextField
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>

          <FormControl
            component="fieldset"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            <FormLabel component="legend">캠퍼스 선택</FormLabel>
            <TextField
              id="campus"
              select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              required
              variant="outlined"
            >
      
              <MenuItem value="수지">수지</MenuItem>
              <MenuItem value="동탄">동탄</MenuItem>
              <MenuItem value="분당">분당</MenuItem>
            </TextField>
          </FormControl>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="large"
            disabled={loading}
            style={{ marginTop: "20px" }}
          >
            {loading ? <CircularProgress size={24} /> : "가입하기"}
          </Button>
        </form>
        <Typography style={{ marginTop: "20px", textAlign: "center" }}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Typography>
      </Paper>
    )}
      {showChildForm && <ChildForm parentId={parentId} />}
    </Container>
  );
}

export default RegistrationForm;
