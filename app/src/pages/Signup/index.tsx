import styled from "@emotion/styled";
import {
  Button,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const MainCardStyled = styled(Card)`
  padding: 20px;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: 10px;
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    // try {
    //   await axios.get(`http://localhost:3001/auth/google`);
    // } catch (error) {
    //   console.error("Error during Google auth:", error);
    // }
    window.location.href = "http://localhost:3001/auth/google";
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/auth/signup`, {
        email,
        password,
      });
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <MainCardStyled>
          {error && (
            <Typography color="error" sx={{ marginBottom: "10px" }}>
              {error}
            </Typography>
          )}
          <OutlinedInput
            required
            fullWidth
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            placeholder="Password"
            fullWidth
          />
          <OutlinedInput
            required
            fullWidth
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignup}
          >
            Create Account
          </Button>

          <Divider
            sx={{
              width: "100%",
              color: "black",
              margin: "10px 0",
            }}
          >
            OR
          </Divider>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "rgba(9,30,66,.13)",
              color: "black",
            }}
            onClick={handleGoogleAuth}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              Continue with Google
            </div>
          </Button>
        </MainCardStyled>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span>Already have an account?</span>
          <LinkStyled href="/login">Login</LinkStyled>
        </div>
      </div>
    </div>
  );
};

export default Signup;
