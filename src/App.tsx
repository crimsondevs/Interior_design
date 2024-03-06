import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SideMenu from "./components/Home/Sidebar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Library from "./components/LibraryPage";

// Import AuthProvider
import { AuthProvider } from "./context/AuthContext"; // Adjust the import path as necessary to where you've defined AuthProvider

const App = () => {
  return (
    <AuthProvider> {/* Wrap the Routes with AuthProvider */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sidebar" element={<SideMenu/>} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App;
