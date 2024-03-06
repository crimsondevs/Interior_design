import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal';
import { Button, Grid, Typography, Card, CardActionArea, CardMedia } from '@mui/material';
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
});

const LibraryPage = () => {
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

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
      <div className="library-page-wrapper">
        <div className="library-page-header">
          <Typography variant="h3" component="h1" gutterBottom color="primary" align="center">
            My Library
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
        <Grid container spacing={2} justifyContent="center">
          {images.map((imageUrl, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardActionArea onClick={() => setSelectedImage(imageUrl)}>
                  <CardMedia component="img" image={imageUrl} alt={`User upload ${index}`} />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      </div>
    </ThemeProvider>
  );
};

export default LibraryPage;
