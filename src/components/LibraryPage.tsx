import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed
import ImageModal from './ImageModal'; // Component to be created for the modal
import './LibraryPage.css'; // CSS file for styling

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
    <div className="library-page">
      <div className="image-grid">
        {images.map((imageUrl, index) => (
          <div key={index} className="image-item" onClick={() => setSelectedImage(imageUrl)}>
            <img src={imageUrl} alt={`User upload ${index}`} />
          </div>
        ))}
      </div>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default LibraryPage;