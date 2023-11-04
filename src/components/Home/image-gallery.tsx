import React, { useState } from "react";
import { imageGalleryAtom } from "@/atom";
import { useAtom } from "jotai";
import './styling_gallery.css'



// Sample array of image URLs and labels; replace with your own list
const imageData = [
  { url: "/assets/CONTOMPORARY.png", label: "Contemporary" },
  { url: "/src/assets/TRADITIONAL.png", label: "Traditional" },
  { url: "/src/assets/HALLOWEEN.png", label: "Halloween" },
  { url: "/src/assets/CHRISMAS.png", label: "Christmas" },
  { url: "/src/assets/NEOCLASSIC.png", label: "Neo-Classical" },
  { url: "/src/assets/SCANDINAVIAN.png", label: "Scandanavian" },
  { url: "/src/assets/INDUSTRIAL.png", label: "Industrial" },
  { url: "/src/assets/ZEN.png", label: "Zen" },
  { url: "/src/assets/BIOPHILIC.png", label: "Bioliphic" },
  { url: "/src/assets/MOROCCAN.png", label: "Morocan" },
  { url: "/src/assets/ASIAN.png", label: "Asian" },
  { url: "/src/assets/TROPICAL.png", label: "Tropical" },
  { url: "/src/assets/VINTAGE.png", label: "Vintage" },
  { url: "/src/assets/MID-CENTURY.png", label: "Mid-Century Modern" },
  { url: "/src/assets/BOHEMIAN.png", label: "Bohemian" },
  { url: "/src/assets/BAROQUE.png", label: "Baroque" },
  { url: "/src/assets/CYBERPUNK.png", label: "Cyberpunk" },
  { url: "/src/assets/JAPANES DESIGN.png", label: "Japanese" },
  { url: "/src/assets/FRENCH DESIGN.png", label: "French" },
  { url: "/src/assets/SKETCH.png", label: "Sketch" },
  { url: "/src/assets/ZEN GARDEN.png", label: "Zen Garden" },
  { url: "/src/assets/FENG SHUI.png", label: "Feng Shui Garden" },
  { url: "/src/assets/FRENCH GARDEN.png", label: "French Garden" },
  { url: "/src/assets/ENGLISH GARDEN.png", label: "English Garden" },
  { url: "/src/assets/MEDITERANEAN.png", label: "Mediteranean Garden" },
  { url: "/src/assets/ROCK GARDEN.png", label: "Rock Garden" },
  { url: "/src/assets/ANDALUSIAN.png", label: "Andalusian Garden" },
  { url: "/src/assets/TROPICAL.png", label: "Tropical Garden" },
];

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [, setImageGallery] = useAtom(imageGalleryAtom);

  const handleClick = (index: number) => {
    setSelectedImage(index);
    setImageGallery((prev) => ({ ...prev, designStyle: imageData[index].label }));
  }
  return (
    <div>
      <h2 className="text-xl text-center ml-6 font-bold text-gray-800 mt-6">Choose Design Style</h2>
      <div className="flex flex-wrap mt-12 px-4">
        {imageData.map((image, index) => (
          <div key={index} className="w-1/4 p-2">
            <div
              className={`relative cursor-pointer ${selectedImage === index ? 'selected' : 'not-selected'}`}
              onClick={() => handleClick(index)}
            >
              <div className="aspect-w-1 aspect-h-1"> {/* Aspect ratio container */}
                <img
                  src={image.url}
                  alt={image.label}
                  className={`rounded object-cover w-full h-full transition-transform transform-scale ${
                    selectedImage === index ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
