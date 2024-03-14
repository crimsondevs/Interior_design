import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { Button, TextField, Typography, Container, Box, Alert, Link, IconButton, } from '@mui/material'; // Ensure Link is imported for navigation
import { useNavigate } from 'react-router-dom';
import { pink, purple } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the import path as needed

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState(''); // New state variable for storing error message


  const signUp = (e) => {
    e.preventDefault();
    setError(''); // Reset error message at the start
    if (password !== retypePassword) {
      console.log('Passwords do not match!');
      setError('Passwords do not match!'); // Update error state with a message
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Update the user's profile with their name
      updateProfile(userCredential.user, {
        displayName: name
      }).then(() => {
        console.log("User's profile updated with name:", name);
        // Store additional information in Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        setDoc(userRef, {
          name: name,
          contact: contact
        }).then(() => {
          console.log('Additional user information stored in Firestore');
          navigate('/login');
        }).catch((error) => {
          console.error('Error storing additional information in Firestore:', error.message);
        });
      }).catch((error) => {
        console.error('Error updating user profile:', error.message);
      });
    })
    .catch((error) => {
      console.error(error);
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
        backgroundImage: 'url("/assets/BG.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)', // Apply the blur directly to the background image
        zIndex: -1,
      }}></div>
    <Container maxWidth="xs" style={{ position: 'relative', zIndex: 1 }}>
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
            p: 4, // Padding for the Box content
          }}
      >
                  <IconButton
            aria-label="close"
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              right: 18,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>} {/* Display error message if it exists */}
        <Box component="form" onSubmit={signUp} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="retypePassword"
            label="Retype Password"
            type="password"
            id="retype-password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="contact"
            label="Contact Number"
            name="contact"
            autoComplete="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: pink[500], '&:hover': { bgcolor: purple[500] } }}
          >
            Sign Up
          </Button>
          {/* Login option */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account? 
            <Link href="/login" variant="body2" style={{ marginLeft: '5px' }}>Login</Link> {/* Ensure your routing matches */}
          </Typography>
        </Box>
      </Box>
    </Container>
    </div>
  );
};

export default SignUp;
