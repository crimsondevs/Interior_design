import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { imageGalleryAtom } from "@/atom";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios'

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useAtom(imageGalleryAtom);
  const [prompt, setPrompt] = useState<string>("");

  const onPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prompt = event.target.value;
    setPrompt(prompt);
    setImageGallery((prev) => ({ ...prev, prompt }));
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

  const handleClick = () => {
    document.getElementById("uploadInput")?.click();
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
      axios
        .post('https://v0vsnsdxi8jhia-4997.proxy.runpod.net/update-prompt', imageGallery)
        .then((response) => {
          toast.success('Please wait two minutes for the image to download');
          console.log(response.data);
          
          // After successful POST request, make a GET request to fetch the image
          axios.get('https://v0vsnsdxi8jhia-4997.proxy.runpod.net/get-uploaded-image', { responseType: 'blob' })
            .then((imageResponse) => {
              // Create a URL for the received image blob
              const imageUrl = URL.createObjectURL(imageResponse.data);
              
              // Don't set the image state, so it won't display in the UI
              
              // Trigger the download when the image is available
              handleImageDownload(imageUrl);
            })
            .catch((error) => {
              toast.error('Error fetching image: ' + error.message);
            });
        })
        .catch((error) => {
          toast.error('Error while sending data: ' + error.message);
        });
    }
  };
  return (
    <div>
      <Toaster />
      <div className="flex flex-col h-64 cursor-pointer items-start justify-start gap-4 p-4 ml-2">
        <label
          htmlFor="uploadInput"
          className="text-lg font-semibold text-gray-700"
        >
          Upload Profile Image
        </label>
        <Input
          type="file"
          id="uploadInput"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div
          className={`flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 ${
            image ? "" : "hover:border-red-500"
          }`}
          onClick={handleClick}
        >
          {image ? (
            <img src={image} alt="Uploaded" className="h-32 w-36" />
          ) : (
            <div className="text-center">
              <div className="flex flex-col gap-2 items-center justify-center">
                <Upload size={32} className="text-gray-300 text-center" />
                <p className="text-gray-500 text-md text-center">
                  Upload Photo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Input
        type="text"
        placeholder="Enter Prompt"
        value={prompt}
        onChange={onPromptChange}
        className="w-full ml-2 mt-2"
      />
      <Button className="w-full ml-2 mt-2" onClick={handleSubmit}>
        Get Results
      </Button>
    </div>
  );
};

export default ImageUpload;
