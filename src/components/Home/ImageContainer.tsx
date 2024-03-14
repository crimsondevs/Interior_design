import ImageGallery from "@/components/Home/image-gallery";
import ImageSlider from "@/components/Home/image-slider";

const ImageContainer = () => {
  return (
    <div className="flex flex-col">
      <ImageSlider />
      <ImageGallery />
    </div>
  );
};

export default ImageContainer;
