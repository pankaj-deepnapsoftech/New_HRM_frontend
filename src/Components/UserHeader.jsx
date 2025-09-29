import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import EmpMenuBar from "@/Drawer/EmpDetails/EmpMenuBar";
import EmpNotification from "@/Drawer/EmpDetails/EmpNotification";

const UserHeader = ({ isMobile }) => {
  const [showEmpMenuBar, setShowEmpMenuBar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef();
  const userName = "Nitin Thakur";
  const userInitials = userName
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
    <div
      className={`w-full h-16 bg-white px-4 sm:px-6 md:px-10 flex items-center justify-end z-10 ${
        isMobile ? "" : "shadow-md"
      }`}
    >
      {/* Right Section: Notification & User */}
      <div className="flex items-center gap-5 ml-auto relative">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaRegBell className="text-gray-600 text-xl sm:text-2xl" />
            {/* Notification Dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotification && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <EmpNotification />
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <div
            onClick={() => setShowEmpMenuBar(!showEmpMenuBar)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            {userInitials}
          </div>
        </div>
      </div>

      {/* Drawer / Sidebar */}
      <EmpMenuBar
        setShowEmpMenuBar={setShowEmpMenuBar}
        showEmpMenuBar={showEmpMenuBar}
      />
    </div>
  );
};

export default UserHeader;
