
import React from "react";
import { IoIosClose } from "react-icons/io"
import { useSelector } from "react-redux";

const UserProfile = ({ showUserMenu, setShowMenu }) => {
  
   const fullName=useSelector((state=>state.Auth.fullName))
const username=useSelector((state=>state.Auth.username))
const email=useSelector((state=>state.Auth.email))
const phone=useSelector((state=>state.Auth.phone))
const handleBackgroundClick = () => {
    setShowMenu(false);
  };

  // Prevent closing when clicking inside the modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
  onClick={handleBackgroundClick}
      className={`fixed top-0 left-0 w-full h-screen inset-0 z-50 bg-black/40 p-4 flex items-center justify-center transition-opacity duration-300 ease-in-out
      ${showUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}
    `}


    >
     
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden relative"  onClick={ handleContentClick}>

        <div className="h-24 bg-gradient-to-r from-[#533F60] to-[#372a41] p-5 text-white flex items-start justify-between">
          <h1 className="text-xl font-semibold">User Profile</h1>
          <button
            className="text-white hover:text-gray-300"
            onClick={() => setShowMenu(false)}
            aria-label="Close"
          >
            <IoIosClose size={28} />
          </button>
        </div>


        <div className="flex justify-center -mt-12">
          <img
            src="/3dd.png"
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover  border-white "
          />
        </div>


        <div className="px-6 py-4 text-gray-900 text-sm sm:text-base">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-sm text-gray-600">Admin</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">User Name</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">{username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Email</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">{email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Phone Number</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">{phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
