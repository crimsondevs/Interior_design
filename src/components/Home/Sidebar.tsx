import React, { useState } from "react";
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

const SideMenu = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useAtom(imageGalleryAtom);
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");

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
    if (
      !imageGallery.Category ||
      !imageGallery.designStyle ||
      !imageGallery.imageUpload ||
      !imageGallery.prompt ||
      !imageGallery.negative_prompt
    ) {
      toast.error("Please Select All Options!");
      return;
    }

    setIsGeneratingImage(true);
    axios.post("https://58bzttxwyfejl6-4996.proxy.runpod.net/update-prompt", imageGallery)
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
    axios.get(`https://58bzttxwyfejl6-4996.proxy.runpod.net/get-uploaded-image?request_id=${requestId}`, { responseType: "blob" })
      .then(imageResponse => {
        if (imageResponse.status === 200) {
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setIsGeneratingImage(false);
          setModalImage(imageUrl);
          setIsModalOpen(true); // Open the modal with the image
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
  <div className={`flex min-h-screen ${isModalOpen}`}>
      <Toaster />
      {/* Sidebar */}
      <div className="flex flex-col w-20 bg-[#ddddde] text-white">
        <div className="flex flex-col p-4 mt-24">
          <button className="mb-4 text-sm">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-700 transition duration-300">
              <img
                src="/assets/logo genia 1.png"
                alt="Logo"
                className="w-12 h-12 absolute left-[1.65rem] -mt-2"
              />
            </div>
            <p className="text-center text-black mt-1 -ml-0">Create</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE]">
              <HeartIcon size={32} color="purple" />
            </div>
            <p style={{ textAlign: "justify" }} className="text-black text-center mt-1 -ml-2">Favorites</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE]">
              <Folder size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-2 -ml-1">Library</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE]">
              <MessageCircle size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-2 -ml-0">Ask gpt</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE]">
              {/* <MessageCircle size={32} color="purple" /> */}
            </div>
            {/* <p className="text-center mt-2 -ml-4">
              Ask Gpt
            </p> */}
          </button>
        </div>
      </div>
      {/* Expanded Area */}
      <div className="flex flex-col items-center justify-start w-72 bg-[#2C2F48]/10 text-white p-4">
        {/* Genia App Icon */}
        <img
          className="mb-4 w-40 h-16"
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
              <Upload size={24} color="white" className="w-8 h-8 mx-auto" />
              <span className="text-lg mt-1">Upload Photo</span>
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
            className="bottom-[100px] left-[180px] w-36 h-36"
          />
            </div>
        </button>
      </div>
      {isModalOpen && (
  <div style={{
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1050
  }}>
    <div style={{
      width: '80vw', 
      height: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between', 
      alignItems: 'center', // Center align the items vertically
      paddingBottom: '100px', 
      boxSizing: 'border-box',
      borderRadius: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.0)', // Ensuring the background is transparent
    }}>
      <span style={{
        alignSelf: 'flex-end', 
        cursor: 'pointer', 
        fontSize: '10px'
      }} onClick={closeModal}>&times;</span>
      <img src={modalImage} alt="Generated" style={{
        maxWidth: '100%', 
        maxHeight: '100%', 
        objectFit: 'contain',
        flexGrow: 1
      }} />
      <div style={{
        width: '58vw', // This will match the parent's width, assuming image takes full width
        display: 'flex', 
        justifyContent: 'space-around', 
        backgroundColor: 'magenta', 
        padding: '10px',
        borderRadius: '10px', // Curved borders
        boxSizing: 'border-box',
        marginTop: '10px', // Add some space between the image and the bar if needed
      }}>
        <button style={{
          backgroundColor: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          cursor: 'pointer',
          borderRadius: '10px',
          fontWeight: 'bold' // Make text bold
        }} onClick={handleImageDownload}>Download</button>
        <button style={{
          backgroundColor: 'white', 
          border: 'none', 
          padding: '10px 20px',
          borderRadius: '10px', 
          cursor: 'pointer',
          fontWeight: 'bold' // Make text bold
        }} onClick={closeModal}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SideMenu;
