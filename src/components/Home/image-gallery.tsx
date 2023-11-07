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
  }

  // Define the left padding value you want (e.g., 20px)
  const leftPadding = "80px";

  return (
    <div> {/* Add padding to the left side */}
      <h2 className="text-center text-xl mr-6 font-bold text-gray-800 mt-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '78vw', height: '1vh' }}>Choose Design Style</h2>
      <div className="flex flex-wrap w-[80vw] mt-6 gap-2" style={{ paddingLeft: leftPadding, overflowY: 'auto', height: '55vh' }}>
        {imageData.map((image, index) => (
          <div
            className={`relative cursor-pointer ${selectedImage === index ? 'selected' : 'not-selected'}`}
            onClick={() => handleClick(index)}
            key={index}
          >
            <div className="aspect-w-1 aspect-h-1"> {/* Aspect ratio container */}
              <img
                src={image.url}
                alt={image.label}
                className={`rounded object-cover w-[20rem] h-full transition-transform transform-scale ${
                  selectedImage === index ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
