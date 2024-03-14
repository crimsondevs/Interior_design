import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal';
import { Button, Grid, Typography, Card, CardActionArea, CardMedia, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink
    },
    secondary: {
      main: '#ff4081', // Magenta
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.15s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
          },
        },
      },
    },
  },
});

const LibraryPage = () => {
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchImages = async () => {
        const q = query(collection(db, "userImages"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedImages = [];
        querySnapshot.forEach((doc) => {
          fetchedImages.push(doc.data().imageUrl);
        });
        setImages(fetchedImages);
      };
      fetchImages();
    }
  }, [currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" align="center">
          My Library
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '20px' }}>
          {images.map((imageUrl, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <CardActionArea onClick={() => setSelectedImage(imageUrl)}>
                  <CardMedia component="img" height="194" image={imageUrl} alt={`User upload ${index}`} />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      </Box>
    </ThemeProvider>
  );
};

export default LibraryPage;