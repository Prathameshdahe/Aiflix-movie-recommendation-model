// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SearchResults from "./pages/SearchResults";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import AIRecommendations from "./pages/AIRecommendations";

const App = () => {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser().catch(() => {});
  }, [fetchUser]);

  if (fetchingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#e50914]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
      </Routes>
    </div>
  );
};

export default App;
