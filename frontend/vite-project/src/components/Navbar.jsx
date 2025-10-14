import React, { useState } from "react";
import { Search, HelpCircle, LogOut, Settings } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      {/* Logo */}
      <Link to="/">
        <img src={Logo} alt="Logo" className="w-20 cursor-pointer brightness-125" />
      </Link>

      {/* Menu */}
      <ul className="hidden xl:flex space-x-6">
        <li>
          <Link to="/" className="cursor-pointer hover:text-[#e50914]">Home</Link>
        </li>
        <li>
          <Link to="/tvshows" className="cursor-pointer hover:text-[#f5dd07f8]">Tv Shows</Link>
        </li>
        <li>
          <Link to="/movies" className="cursor-pointer hover:text-[#0ff8d5]">Movies</Link>
        </li>
        <li>
          <Link to="/anime" className="cursor-pointer hover:text-[#e48518]">Anime</Link>
        </li>
        <li>
          <Link to="/games" className="cursor-pointer hover:text-[#41ed38]">Games</Link>
        </li>
        <li>
          <Link to="/new-popular" className="cursor-pointer hover:text-[#f52fbd]">New & Popular</Link>
        </li>
        <li>
          <Link to="/upcoming" className="cursor-pointer hover:text-[#b890f0]">Upcoming</Link>
        </li>
      </ul>

      {/* Right side */}
      <div className="flex items-center space-x-4 relative">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden md:inline-flex">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none"
            placeholder="Search..."
          />
          <Search className="absolute top-2 right-4 w-5 h-5" />
        </form>

        <Link to={user ? "/ai-recommendations" : "/signin"}>
          <button className="bg-[#e50914] px-5 py-2 text-white cursor-pointer">
            Get AI Movie Picks
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="border border-[#333333] py-2 px-4 cursor-pointer">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white relative">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>
                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
