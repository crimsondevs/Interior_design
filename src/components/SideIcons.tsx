import React, { createContext, useContext, useEffect, useState } from "react";
import {
    Folder,
    UserCircle,
    MessageCircle,
    Upload,
    Minus,
    Plus,
} from "lucide-react";
import { imageGalleryAtom } from "@/atom";
import { useAtom } from "jotai";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import './Home/SideMenu.css'; // Assume styles are defined in this CSS file
import { useNavigate } from 'react-router-dom';
import { auth } from "./../firebase"; // Import your Firebase auth instance
import { useAuth } from "./../context/AuthContext"; // Adjust the import path as needed
import { db } from "../firebase"; // Adjust the import path as needed
import { collection, addDoc } from "firebase/firestore";


const SideIcons = ({ }) => {
    const goToLibrary = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to see your Library", {
                icon: '🔐',
            });
        }
        else {
            navigate('/library'); // Use the path to your library page
        }
    };

    const goToDashboard = () => {
        navigate('/UserDashboard'); // Use the path to your library page

    };

    const goToHome = () => {
        navigate('/'); // Use the path to your library page

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


    return (
        <div className={`flex min-h-screen ${logoutAnimation}`}>
            <Toaster />
            {/* Sidebar */}
            <div className="flex flex-col w-20 bg-[#ddddde] text-white">
                <div className="flex flex-col p-0 mt-24">
                    <button className="mb-4 text-sm" onClick={goToHome}>
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-700 transition duration-300 ml-5">
                            <img
                                src="/assets/logo genia 1.png"
                                alt="Logo"
                                className="w-12 h-12 absolute -mt-2 ml-3"
                            />
                        </div>
                        <p className="text-center text-black mt-0 ml-0 font-semibold text-sm leading-relaxed max-w-xl">Create</p>
                    </button>
                    <button className="mb-4 text-sm text-center" onClick={goToDashboard}>
                        <div className="border-2 border-purple-500 p-2 rounded-full flex items-center justify-center w-10 h-10 bg-[#BEBEBE] ml-5">
                            <UserCircle size={32} color="purple" />
                        </div>
                        <p style={{ textAlign: "justify" }} className="text-center text-black mt-0 font-semibold text-sm leading-relaxed">Dashboard</p>
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
        </div>
    );
};

export default SideIcons;
