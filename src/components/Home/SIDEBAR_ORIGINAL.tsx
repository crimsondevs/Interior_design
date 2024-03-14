import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Folder,
  HeartIcon,
  MessageCircle,
  Upload,
  Minus,
  Plus,
} from "lucide-react";
import { imageGalleryAtom } from "@/atom";
import { useAtom } from "jotai";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import './SideMenu.css'; // Assume styles are defined in this CSS file
import './ModalStyles.css';
import { useNavigate } from 'react-router-dom'; 
import { auth } from "../../firebase"; // Import your Firebase auth instance
import { useAuth } from "./../../context/AuthContext"; // Adjust the import path as needed
import { db } from "../../firebase"; // Adjust the import path as needed
import { collection, addDoc } from "firebase/firestore";




const SideMenu: React.FC = ({ }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useAtom(imageGalleryAtom);
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");

  const goToLibrary = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to see your Library", {
        icon: '🔐',
      });
    }
      else{
        navigate('/library'); // Use the path to your library page
      }
  };

  

  const [logoutAnimation, setLogoutAnimation] = useState("");
  const { currentUser, logout } = useAuth(); // Assuming your useAuth hook provides a logout function
  const isLoggedIn = !!currentUser; 

    const navigate = useNavigate();


  
    const handleLoginLogoutClick = async () => {
      if (currentUser) {
        setLogoutAnimation("fade-out-animation"); // Trigger the animation
      } else {
        navigate('/login'); // Directly navigate to login if not logged in
      }
    };

    useEffect(() => {
      if (logoutAnimation) {
        const timer = setTimeout(async () => {
          try {
            await logout();
            navigate('/'); // Navigate after logout
          } catch (error) {
            console.error("Failed to logout:", error);
          }
        }, 500); // Set timeout duration equal to animation duration
        return () => clearTimeout(timer);
      }
    }, [logoutAnimation, logout, navigate]);

  // Handle prompt changes
  const onPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value;
    setPrompt(prompt);
    setImageGallery((prev) => ({ ...prev, prompt }));
  };

  // Handle negative prompt changes
  const onNegativePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const negativePrompt = event.target.value;
    setNegativePrompt(negativePrompt);
    setImageGallery((prev) => ({ ...prev, negative_prompt: negativePrompt }));
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageResult = e.target.result as string;
          setImage(imageResult);
          setImageGallery((prev) => ({ ...prev, imageUpload: imageResult }));
        }
      };
      reader.readAsDataURL(uploadedImage);
    }
  };

  // Submit and generate image
  const handleSubmit = () => {
    // Use isLoggedIn directly instead of checking auth.currentUser
    if (!isLoggedIn) {
      toast.error("Please log in to generate an image!", {
        icon: '🔐',
      });
      return;
    }
  
    if (
      !imageGallery.Category ||
      !imageGallery.designStyle ||
      !imageGallery.imageUpload ||
      !imageGallery.prompt ||
      !imageGallery.negative_prompt
    ) {
      toast.error("Please select all options!");
      return;
    }
  
    setIsGeneratingImage(true);
    axios.post("https://5t5b1kzen5vqxu-4996.proxy.runpod.net/update-prompt", imageGallery)
      .then(response => {
        const requestId = response.data.request_id;
        pollForImage(requestId);
      })
      .catch(error => {
        toast.error("Error while sending data: " + error.message);
        setIsGeneratingImage(false);
      });
  };

  // Poll for image
  const pollForImage = (requestId) => {
    axios.get(`https://5t5b1kzen5vqxu-4996.proxy.runpod.net/get-uploaded-image?request_id=${requestId}`, { responseType: "blob" })
      .then(async imageResponse => { // Mark this callback as async to use await inside
        if (imageResponse.status === 200) {
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setIsGeneratingImage(false);
          setModalImage(imageUrl);
          setIsModalOpen(true); // Open the modal with the image
  
          // Now, save the image URL to Firestore
          try {
            await addDoc(collection(db, "userImages"), {
              userId: currentUser.uid, // Make sure currentUser is correctly referenced
              imageUrl: imageUrl, // This is a blob URL and not directly accessible; consider uploading to a storage service if needed
              createdAt: new Date()
            });
            // Optionally, you could update your state or UI here to indicate the image has been saved to the library
          } catch (error) {
            console.error("Error adding image to the library: ", error);
            // Handle the error, maybe show a user-friendly message
          }
        } else if (imageResponse.status === 504) {
          toast.error("Image generation timed out.");
          setIsGeneratingImage(false);
        }
      })
      .catch(error => {
        toast.error("Error fetching image: " + error.message);
        setIsGeneratingImage(false);
      });
  };

  // Download image
  const handleImageDownload = () => {
    const link = document.createElement('a');
    link.href = modalImage;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
  <div className={`flex min-h-screen ${isModalOpen} ${logoutAnimation}`}>
      <Toaster />
      {/* Sidebar */}
      <div className="flex flex-col w-20 bg-[#ddddde] text-white">
        <div className="flex flex-col p-0 mt-24">
          <button className="mb-4 text-sm">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-700 transition duration-300 ml-5">
              <img
                src="/assets/logo genia 1.png"
                alt="Logo"
                className="w-12 h-12 absolute -mt-2 ml-3"
              />
            </div>
            <p className="text-center text-black mt-0 ml-0 font-semibold text-sm leading-relaxed max-w-xl">Create</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE] ml-5">
              <HeartIcon size={32} color="purple" />
            </div>
            <p style={{ textAlign: "justify" }} className="text-center text-black mt-0 font-semibold text-sm leading-relaxed">Favorites</p>
          </button>
          <button className="mb-4 text-sm text-center" onClick={goToLibrary}>
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE] ml-5">
                <Folder size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-0 mx-auto font-semibold text-sm leading-relaxed max-w-xl">Library</p>
          </button>
          <a href="https://genia-app.com/index.php/ask-ai/" target="_blank" rel="noopener noreferrer">
            <button className="mb-4 text-sm text-center">
              <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE] ml-5">
                <MessageCircle size={32} color="purple" />
              </div>
                <p className="text-center text-black mt-0 ml-4 font-semibold text-sm leading-relaxed max-w-xl">Ask gpt</p>
              </button>
          </a>
          <button className="mb-4 text-sm text-center" onClick={handleLoginLogoutClick}>
        <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE] ml-5">
          {/* Your existing icon and props */}
        </div>
        <p className="text-center text-black mt-0 mx-auto font-semibold text-sm leading-relaxed max-w-xl">
          {isLoggedIn ? 'Logout' : 'Login'}
        </p>
      </button>
        </div>
      </div>
      {/* Expanded Area */}
      <div className="flex flex-col items-center justify-start w-72 bg-[#2C2F48]/10 text-white p-4">
        {/* Genia App Icon */}
        <img
          className="mb-4 w-32 h-14"
          alt="Genia App Icon"
          src="/assets/[removal 2.png"
        />

        <p className="text-xs font-bold font-advent-pro text-white bg-[#878899] rounded-2xl px-3 py-1 ">
          STEP 1
        </p>
        {/* Loading Screen or Message */}
        {isGeneratingImage && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="text-white text-3xl font-bold p-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-60 rounded-md shadow-lg">
               Generating image, please wait...
            </div>
          </div>
        )}
        <label className="relative bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl mt-4 p-4 cursor-pointer w-48 text-center">
          <input
            type="file"
            id="uploadInput"
            accept="image/*"
            className="hidden mb-2"
            onChange={handleImageUpload}
          />
          {!image ? (
            <>
              <Upload size={24} color="white" className="w-6 h-6 mx-auto" />
              <span className="text-m mt-1">Upload Photo</span>
            </>
          ) : (
            <img src={image} alt="image uploaded" className="w-32 h-16" />
          )}
        </label>

        {/* Step 1 */}
        <p className="text-xs font-bold font-advent-pro text-white bg-[#878899] rounded-2xl px-3 py-1  mt-4 ">
          STEP 3
        </p>
        <div className="flex items-center mb-2 -ml-14 mt-3">
          <Plus className="bg-[#87888e] rounded-full w-4 h-4" />
          <p className="text-black font-abel text-sm font-normal font-style-normal leading-4 pl-2">
            {" "}
            Describe your desires{" "}
          </p>
        </div>

        {/* Text Input Fields */}
        <textarea
          className=" rounded-2xl p-4 text-black border-none outline-none resize-none"
          value={prompt}
          onChange={onPromptChange}
          placeholder="text prompt"
        />
        <div className="flex items-center mb-2 -ml-2 mt-3">
          <Minus className="bg-[#87888e] rounded-full w-4 h-4" />
          <p className="text-black font-abel text-sm font-normal font-style-normal leading-4 pl-2">
            {" "}
            Describe what you didn't want
          </p>
        </div>

        {/* Text Input Fields */}
        <textarea
          className=" rounded-2xl p-4 text-black border-none outline-none resize-none"
          value={negativePrompt}
          onChange={onNegativePromptChange}
          placeholder="Negatif prompts"
        />

        {/* Additional Components */}
        {/* Add the rest of your components here, as per your existing code */}
        <button onClick={handleSubmit}>
          <div className="flex justify-center items-center">
          <img
            alt=""
            src="/assets/generate icone.webp"
            className="bottom-[100px] left-[180px] w-28 h-28"
          />
            </div>
        </button>
      </div>
      {isModalOpen && (
        <div className="backdrop">
  <div className="modal-container">
    <div className="modal-content">
      <div className="modal-image-wrapper">
        <img alt="Generated" src={modalImage} className="modal-image" />
        <div className="white-bar">
          <button onClick={handleImageDownload} className="icon-button">
            <img alt="Download" src="/assets/download-icon.svg" className="button-icon" />
          </button>
          <span>Download</span>
        </div>
      </div>
      <button onClick={closeModal} className="close-button">
        <img alt="Close" src="/assets/close-icon.svg" className="button-icon" />
      </button>
    </div>
  </div>
</div>
)}

    </div>
  );
};

export default SideMenu;