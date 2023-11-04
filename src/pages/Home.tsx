import SideMenu from "../components/Home/Sidebar";
import ImageContainer from "../components/Home/ImageContainer";

const Home = () => {
  return (
    <>
      <div className="flex overflow-hidden">
        <SideMenu />
        <ImageContainer />
      </div>
    </>
  );
};

export default Home;
