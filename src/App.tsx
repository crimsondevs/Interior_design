import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import SideMenu from "./components/Home/Sidebar";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sidebar" element={<SideMenu  />} />
      </Routes>
    </div>
  )
}

export default App
