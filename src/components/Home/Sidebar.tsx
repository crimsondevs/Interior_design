import React, { useState } from "react";
import {
  Folder,
  HeartIcon,
  MessageCircle,
  Minus,
  Plus,
  Upload,
} from "lucide-react";
import { imageGalleryAtom } from "@/atom";
import { useAtom } from "jotai";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SideMenu: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useAtom(imageGalleryAtom);
  const [prompt, setPrompt] = useState<string>("");
  const [negative_prompt, setNPrompt] = useState<string>("");

  const onPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = event.target.value;
    setPrompt(prompt);
    setImageGallery((prev) => ({ ...prev, prompt }));
  };

  const onNPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const negative_prompt = event.target.value;
    setNPrompt(negative_prompt);
    setImageGallery((prev) => ({ ...prev, negative_prompt }));
  };

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

  const handleImageDownload = (imageUrl: string) => {
    // Trigger the download when the image is available
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = "downloaded_image.jpg"; // You can specify the filename here
    downloadLink.click();
  };

  const handleSubmit = () => {
    // checking if jotai atom is not containing all three values
    if (
      !imageGallery.Category ||
      !imageGallery.designStyle ||
      !imageGallery.imageUpload ||
      !imageGallery.prompt ||
      !imageGallery.negative_prompt
    ) {
      toast.error("Please Select All Options!");
    } else {
      console.log(imageGallery);
      axios
        .post(
          "https://v0vsnsdxi8jhia-4997.proxy.runpod.net/update-prompt",
          imageGallery
        )
        .then((response) => {
          toast.success("Please wait two minutes for the image to download");
          console.log(response.data);

          // After successful POST request, make a GET request to fetch the image
          axios
            .get(
              "https://v0vsnsdxi8jhia-4997.proxy.runpod.net/get-uploaded-image",
              { responseType: "blob" }
            )
            .then((imageResponse) => {
              // Create a URL for the received image blob
              const imageUrl = URL.createObjectURL(imageResponse.data);

              // Don't set the image state, so it won't display in the UI

              // Trigger the download when the image is available
              handleImageDownload(imageUrl);
            })
            .catch((error) => {
              toast.error("Error fetching image: " + error.message);
            });
        })
        .catch((error) => {
          toast.error("Error while sending data: " + error.message);
        });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster />
      {/* Sidebar */}
      <div className=" fixed flex flex-col w-28 bg-[#ddddde] text-white">
        <div className="flex flex-col p-4 mt-24">
          <button className="mb-4 text-sm">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-700 transition duration-300">
              <img
                src="/assets/logo genia 1.png"
                alt="Logo"
                className="w-16 h-16 absolute left-[1.65rem] -mt-2"
              />
            </div>
            <p className="text-center text-black mt-2 -ml-2">Create</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-12 h-12 bg-[#BEBEBE]">
              <HeartIcon size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-2 -ml-5">My Favorites</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-12 h-12 bg-[#BEBEBE]">
              <Folder size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-2 -ml-2">My Library</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-12 h-12 bg-[#BEBEBE]">
              <MessageCircle size={32} color="purple" />
            </div>
            <p className="text-center text-black mt-2 -ml-2">Ask gpt</p>
          </button>
          <button className="mb-4 text-sm text-center">
            <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-12 h-12 bg-[#BEBEBE]">
              {/* <MessageCircle size={32} color="purple" /> */}
            </div>
            {/* <p className="text-center mt-2 -ml-4">
              Ask Gpt
            </p> */}
          </button>
        </div>
      </div>
      {/* Expanded Area */}
      <div className="fixed flex flex-col items-center justify-start w-72 bg-[#2C2F48]/10 text-white p-4">
        {/* Genia App Icon */}
        <img
          className="mb-4 w-40 h-16"
          alt="Genia App Icon"
          src="/assets/[removal 2.png"
        />

        <p className="text-xs font-bold font-advent-pro text-white bg-[#878899] rounded-2xl px-3 py-1 ">
          STEP 1
        </p>

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
          value={negative_prompt}
          onChange={onNPromptChange}
          placeholder="Negatif prompts"
        />

        {/* Additional Components */}
        {/* Add the rest of your components here, as per your existing code */}
        <button onClick={handleSubmit}>
          <div className="flex justify-center items-center">
          <img
            alt=""
            src="/assets/generate icone.webp"
            className=" absolute bottom-[5.5rem] left-[11rem] w-36 h-36"
          />
            </div>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
