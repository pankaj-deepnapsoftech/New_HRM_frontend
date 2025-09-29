import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import UserMenuBar from "@/Drawer/AdminDetails/UserMenuBar";
import NotificationModal from "@/Drawer/AdminDetails/NotificationModal";
import { useSelector } from "react-redux";

const Header = () => {
  const [showUserMenuBar, setShowUserMenuBar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef();
  const fullName = useSelector((state) => state.Auth.fullName);
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
    <div className="w-full h-16 border-b border-gray-200 shadow-sm bg-gradient-to-r from-blue-50 to-white px-4 sm:px-6 md:px-10 flex items-center justify-between z-10">
      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative rounded-full p-2 hover:bg-blue-50 transition-colors duration-200"
          >
            <FaRegBell className="text-gray-600 text-xl sm:text-2xl hover:text-blue-600 transition-colors" />
            {/* Badge */}
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 shadow">
              3
            </span>
          </button>
          {showNotification && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-12 z-50 w-72 sm:w-80"
            >
              <NotificationModal />
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative w-10 h-10">
          {/* Keep Admin Pulse Animation */}
          <span className="absolute inset-0 rounded-full border-4 border-blue-300 animate-customPulse z-0"></span>

          <div
            onClick={() => setShowUserMenuBar(!showUserMenuBar)}
            className="relative z-10 bg-gradient-to-br from-blue-600 to-sky-500 text-white font-semibold text-lg w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 shadow-lg transition-transform duration-200"
          >
            {userInitials}
          </div>
        </div>
      </div>

      {/* User Menu */}
      <UserMenuBar
        setShowUserMenuBar={setShowUserMenuBar}
        showUserMenuBar={showUserMenuBar}
      />
    </div>
  );
};

export default Header;
