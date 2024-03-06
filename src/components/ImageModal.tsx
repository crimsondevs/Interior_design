import React from 'react';
import './ImageModal.css'; // CSS file for modal styling

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <img src={imageUrl} alt="Selected" className="modal-image" />
        <a href={imageUrl} download className="download-button">Download</a>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default ImageModal;