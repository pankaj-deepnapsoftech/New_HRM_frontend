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
    <div className={`w-full h-16 bg-gray-100 px-4 sm:px-6 md:px-10 flex items-center justify-end z-10 ${isMobile ? "" : "shadow-md"
      }`}
    >
      <div className="flex items-center gap-10"></div>
      {/* Right Section: Notification & User */}
      <div className="flex items-center gap-4 ml-auto">
        <div className=" w-10 h-10 flex items-center justify-center rounded-full">
          <button onClick={() => setShowNotification(!showNotification)}>
            <FaRegBell className="text-gray-600 text-2xl" />
          </button>
          {showNotification && (
            <div ref={notificationRef} className="absolute right-0 top-8 z-50">
              <EmpNotification />
            </div>
          )}
        </div>
        <div className="relative">
          <div
            onClick={() => setShowEmpMenuBar(!showEmpMenuBar)}
            className="bg-[#906eb1fd] text-gray-100 font-semibold text-xl w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          >
            {userInitials}
          </div>
        </div>
      </div>
      <EmpMenuBar
        setShowEmpMenuBar={setShowEmpMenuBar}
        showEmpMenuBar={showEmpMenuBar}
      />
    </div>
  );
};

export default UserHeader;
