import React, { useState } from 'react';
import Slider from 'react-slick';
import { imageGalleryAtom } from '@/atom';
import { useAtom } from 'jotai'
import './styling_slider.css';

function CardSlider() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [, setImageGallery] = useAtom(imageGalleryAtom);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const cards = [
    { image: "/src/assets/kitchen.png", label: "Kitchen" },
    { image: "/src/assets/exterior.png", label: "Exterior" },
    { image: "/src/assets/dining_room.png", label: "Dining Room" },
    { image: "/src/assets/bathroom.png", label: "Bathroom" },
    { image: "/src/assets/office.png", label: "Office" },
    { image: "/src/assets/architectural.png", label: "Architectural" },
    { image: "/src/assets/garden.png", label: "Garden" },
    { image: "/src/assets/coffee_restaurant.png", label: "Coffe/Restaurant" },
    { image: "/src/assets/hotel_lobby.png", label: "Hotel Lobby" },
    { image: "/src/assets/hotel_room.png", label: "Hotel Room" },
    { image: "/src/assets/fitness_gym.png", label: "Fitness Gym" },
    { image: "/src/assets/floorplan.png", label: "Floorplan" },
    { image: "/src/assets/painting_art.png", label: "Painting Art" },
    { image: "/src/assets/object.png", label: "Object" },
    { image: "/src/assets/gaming_room.png", label: "Gaming Room" },
    { image: "/src/assets/home_office.png", label: "Home Office" },
    { image: "/src/assets/bedroom.png", label: "Bedroom" },
    { image: "/src/assets/living_room.png", label: "Living Room" },
    // Add more cards as needed
  ];


  const handleClick = (index) => {
    setSelectedCard(index);
    setImageGallery((prev) => ({ ...prev, Category: cards[index].label }));
  };

  return (
    <div className="w-[95rem] h-[25rem] overflow-hidden">
      <h1 className="text-3xl font-medium mb-3 text-center">Select Category</h1>
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="px-5 card-container">
            <div
              className={`relative cursor-pointer overflow-hidden transform transform-scale ${
                selectedCard === index
                  ? 'scale-110 selected'
                  : 'not-selected'
              }`}
              onClick={() => handleClick(index)}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-73 object-cover"
              />
              <div className="absolute inset-0 bg-opacity-10 flex items-center justify-center">
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CardSlider;