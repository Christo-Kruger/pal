import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../media/logo.png";
import {
  Button,
  Container,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  CircularProgress,
  Typography,
  Paper,
} from "@material-ui/core";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userCampus", data.campus);

        if (data.role === "parent") {
          navigate("/parent");
        } else if (data.role === "admin" || data.role === "superadmin") {
          navigate("/admin");
        } else {
          setErrorMessage("Invalid role");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage("전화번호 또는 비밀번호를 확인해 주시기 바랍니다.");
      }
    } catch (error) {
      setErrorMessage("전화번호 또는 비밀번호를 확인해 주시기 바랍니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: "#444444"
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
        <Container style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ maxWidth: "10em", display: 'block', margin: 'auto' }} />
          </Link>
        </Container>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" style={{ marginBottom: "20px", textAlign: 'center' }}>
            로그인
          </Typography>
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          <FormControl component="fieldset" fullWidth>
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
            <FormLabel component="legend">비밀번호</FormLabel>
            <TextField
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
          </FormControl>
          <FormGroup>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              style={{ marginTop: "20px" }}
            >
              {loading ? <CircularProgress size={24} /> : "로그인"}
            </Button>
          </FormGroup>
          <Typography style={{ marginTop: "20px", textAlign:"center" }}>
            아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
          </Typography>
          <Typography style={{textAlign:"center"}}>
            비밀번호를 잊으셨나요?{" "}
            <Link to="/change-password">비밀번호 변경</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;
