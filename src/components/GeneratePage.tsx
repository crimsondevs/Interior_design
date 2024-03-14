import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, CssBaseline, Box, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './../firebase'; // Ensure you have this firebase config file
import { doc, setDoc } from 'firebase/firestore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#e91e63',
    },
  },
});

const GeneratePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl } = location.state || {};
  const [user, loading, error] = useAuthState(auth);
  const [imageStored, setImageStored] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login'); // Redirect to login if not logged in
    } else if (user && imageUrl && !imageStored) {
      storeImageInFirestore(imageUrl);
    }
  }, [user, loading, imageUrl, imageStored, navigate]);

  const storeImageInFirestore = async (imageUrl) => {
    if (!user) return;
    const imageRef = doc(db, `users/${user.uid}/images`, `${Date.now()}`);
    try {
      await setDoc(imageRef, { imageUrl, createdAt: Date.now() });
      setImageStored(true);
    } catch (error) {
      console.error("Error storing image: ", error);
    }
  };

  const handleDownload = () => {
    if (!imageUrl || !user || !imageStored) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'GeneratedImage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    navigate('/');
  };

  if (loading || !imageStored) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(background.jpg)`,
          backgroundSize: 'cover',
          backdropFilter: 'blur(8px)',
        }}
      >
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="img"
          sx={{
            maxWidth: '70%',
            maxHeight: '70vh',
            boxShadow: 3,
          }}
          src={imageUrl}
          alt="Generated"
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ mt: 2 }}
        >
          Download
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default GeneratePage;
