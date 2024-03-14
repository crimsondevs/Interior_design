import React, { useState } from "react";
import { imageGalleryAtom } from "@/atom";
import { useAtom } from "jotai";
import './styling_gallery.css'



// Sample array of image URLs and labels; replace with your own list
const imageData = [
  { url: "/assets/contemporary.png", label: "Contemporary" },
  { url: "/assets/TRADITIONAL.png", label: "Traditional" },
  { url: "/assets/HALLOWEEN.png", label: "Halloween" },
  { url: "/assets/chrismas_shadow.png", label: "Christmas" },
  { url: "/assets/NEOCLASSIC.png", label: "Neo-Classical" },
  { url: "/assets/SCANDINAVIAN.png", label: "Scandanavian" },
  { url: "/assets/INDUSTRIAL.png", label: "Industrial" },
  { url: "/assets/ZEN.png", label: "Zen" },
  { url: "/assets/BIOPHILIC.png", label: "Bioliphic" },
  { url: "/assets/MOROCCAN.png", label: "Morocan" },
  { url: "/assets/ASIAN.png", label: "Asian" },
  { url: "/assets/TROPICAL.png", label: "Tropical" },
  { url: "/assets/VINTAGE.png", label: "Vintage" },
  { url: "/assets/MID-CENTURY.png", label: "Mid-Century Modern" },
  { url: "/assets/BOHEMIAN.png", label: "Bohemian" },
  { url: "/assets/BAROQUE.png", label: "Baroque" },
  { url: "/assets/CYBERPUNK.png", label: "Cyberpunk" },
  { url: "/assets/JAPANES DESIGN.png", label: "Japanese" },
  { url: "/assets/FRENCH DESIGN.png", label: "French" },
  { url: "/assets/SKETCH.png", label: "Sketch" },
  { url: "/assets/ZEN GARDEN.png", label: "Zen Garden" },
  { url: "/assets/FENG SHUI.png", label: "Feng Shui Garden" },
  { url: "/assets/FRENCH GARDEN.png", label: "French Garden" },
  { url: "/assets/ENGLISH GARDEN.png", label: "English Garden" },
  { url: "/assets/MEDITERANEAN.png", label: "Mediteranean Garden" },
  { url: "/assets/ROCK GARDEN.png", label: "Rock Garden" },
  { url: "/assets/ANDALUSIAN.png", label: "Andalusian Garden" },
  { url: "/assets/TROPICAL.png", label: "Tropical Garden" },
];

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [, setImageGallery] = useAtom(imageGalleryAtom);
  
  const handleClick = (index: number) => {
    setSelectedImage(index);
    setImageGallery((prev) => ({ ...prev, designStyle: imageData[index].label }));
  };

  // Responsive adjustments can be made directly in CSS for most cases
  // You might want to use JavaScript for more complex responsiveness that CSS can't handle

  return (
    <div className="gallery-container"> {/* Use responsive classes or styles here */}
      <h2 className="title-style">Choose Design Style</h2>
      <div className="images-wrapper">
        {imageData.map((image, index) => (
          <div
            className={`image-container ${selectedImage === index ? 'selected' : ''}`}
            onClick={() => handleClick(index)}
            key={index}
          >
            <img
              src={image.url}
              alt={image.label}
              className={`image-style ${selectedImage === index ? 'image-selected' : ''}`}
            />
            {selectedImage === index && (
              <img
                src="/assets/tick.png"
                alt="Selected"
                className="tick-icon"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
