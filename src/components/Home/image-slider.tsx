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
    slidesToShow: 4,
    slidesToScroll: 2,
    centerMode: 0,
    responsive: [
      {
        breakpoint: 1025, // Means 1024px screen size and below
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 913,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 821,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
        
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
        
      },
      {
        breakpoint: 1601,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
        
      },
    ], 
  };

  const cards = [
    { image: "/assets/kitchen.png", label: "Kitchen" },
    { image: "/assets/exterior.png", label: "Exterior" },
    { image: "/assets/dining_room.png", label: "Dining Room" },
    { image: "/assets/bathroom.png", label: "Bathroom" },
    { image: "/assets/office.png", label: "Office" },
    { image: "/assets/architectural.png", label: "Architectural" },
    { image: "/assets/garden.png", label: "Garden" },
    { image: "/assets/coffee_restaurant.png", label: "Coffe/Restaurant" },
    { image: "/assets/hotel_lobby.png", label: "Hotel Lobby" },
    { image: "/assets/hotel_room.png", label: "Hotel Room" },
    { image: "/assets/fitness_gym.png", label: "Fitness Gym" },
    { image: "/assets/floorplan.png", label: "Floorplan" },
    { image: "/assets/painting_art.png", label: "Painting Art" },
    { image: "/assets/object.png", label: "Object" },
    { image: "/assets/gaming_room.png", label: "Gaming Room" },
    { image: "/assets/home_office.png", label: "Home Office" },
    { image: "/assets/bedroom.png", label: "Bedroom" },
    { image: "/assets/living_room.png", label: "Living Room" },
    // Add more cards as needed
  ];


  const handleClick = (index) => {
    setSelectedCard(index);
    setImageGallery((prev) => ({ ...prev, Category: cards[index].label }));
  };

  return (
    <div className="slider-container">
      <h1 className="header-title">Select Category</h1>
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="px-6 card-container">
            <div
              className={`card ${selectedCard === index ? 'selected' : 'not-selected'}`}
              onClick={() => handleClick(index)}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full h-73 object-cover"
              />
              {selectedCard === index && (
                <img
                  src="/assets/tick.png"
                  alt="Selected"
                  className="absolute bottom-0 right-0 h-8 mb-4 mr-6 " // Adjust the position as needed
                />
              )}
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
