import React, { useEffect, useRef, useState } from "react";
import { FaRegBell, FaBars, FaRegUser } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import UserMenuBar from "@/Drawer/AdminDetails/UserMenuBar";
import NotificationModal from "@/Drawer/AdminDetails/NotificationModal";
import { useSelector } from "react-redux";
const Header = () => {
  const[searchQuery,setSearchQuery] =useState("")
  const [showUserMenuBar, setShowUserMenuBar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef();
  const fullName = useSelector((state=>state.Auth.fullName))
  const userInitials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="w-full h-16 border-b border-gray-300  shadow-md bg-white px-4 sm:px-6 md:px-10 flex items-center justify-between z-10">
      <div className="flex items-center gap-10">
        {/* Search Bar */}
        <div className="relative w-48 ml-12 md:ml-1 md:w-72 right-4">
          <input
            type="search"
            placeholder="Type to Search..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-1.5 border border-gray-300 bg-gray-50  focus:outline-none focus:ring-1 focus:ring-gray-300 rounded-full"
          />

          <div onClick={()=>console.log("searching for:",searchQuery)} className="absolute top-1 bottom-1 right-1 bg-gray-300 px-2 py-2 flex items-center justify-center rounded-full cursor-pointer">
            <IoSearchSharp className="text-gray-500 text-lg hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Right Section: Notification & User */}
      <div className="flex items-center gap-4 ml-auto">
        <div className=" w-10 h-10 flex items-center justify-center rounded-full">
          <button onClick={()=>setShowNotification(!showNotification)}>
          <FaRegBell className="text-gray-600 text-2xl" />
           {/* <span className="absolute top-1 right-16 bg-red-500 text-white text-xs rounded-full px-1.5">
              13
            </span> */}
            </button>
          {showNotification && (
            <div ref={notificationRef} className="absolute right-0 top-8 z-50">
              <NotificationModal />
            </div>
          )}
        </div>
      <div className="relative w-12 h-12">
  {/* Custom Pulse Ring */}
  <span className="absolute inset-0 rounded-full border-4 border-purple-300 animate-customPulse z-0"></span>

  {/* Avatar */}
  <div
    onClick={() => setShowUserMenuBar(!showUserMenuBar)}
    className="relative z-10 bg-[#8a759efd] text-white font-semibold text-xl w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
  >
    {userInitials}
  </div>
 </div>
</div>

      <UserMenuBar
        setShowUserMenuBar={setShowUserMenuBar}
        showUserMenuBar={showUserMenuBar}
      />
    </div>
  );
};

export default Header;
