import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
  IconButton, // Import IconButton
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    setError("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/public/assets/BG.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: -1,
        }}></div>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: 'background.paper',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: 1,
            fontWeight: 'bold',
            p: 4,
            position: 'relative', // Added for positioning the close button
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography component="h1" variant="h5" color="secondary">
            Log In to your Account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={signIn} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              color="secondary"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, bgcolor: "secondary.main" }}
            >
              Log In
            </Button>
            <Button
              component={Link}
              to="/signup"
              fullWidth
              variant="text"
              sx={{ mt: 1, mb: 2, color: "secondary.main" }}
            >
              Don't have an account? Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignIn;