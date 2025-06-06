import React, { useState } from "react";
import { FaRegBell, FaBars, FaRegUser } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import UserMenuBar from "@/Drawer/UserDetails/UserMenuBar";

const Header = () => {
  const [showUserMenuBar, setShowUserMenuBar] = useState(false);
 const userName = "Dinki Kaur";
const userInitials = userName
  .split(" ")                 
  .map(word => word[0])        
  .join("")                    
  .toUpperCase();              


  return (
    <div className="w-full h-16 border-b border-gray-200  shadow-md bg-white px-4 sm:px-6 md:px-10 flex items-center justify-between z-10">
      <div className="flex items-center gap-10">
        {/* Search Bar */}
        <div className="relative w-48 ml-12 md:ml-1 md:w-72 right-4">
          <input
            type="search"
            placeholder="Type to Search..."
            className="w-full pl-4 pr-12 py-1.5 border border-gray-300 bg-slate-50  focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full"
          />

          <div className="absolute right-0 top-0 bottom-0  px-3 flex items-center justify-center rounded-tr rounded-br cursor-pointer">
            <IoSearchSharp className="text-gray-500 text-lg hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Right Section: Notification & User */}
      <div className="flex items-center gap-4 ml-auto">
        <div className=" w-10 h-10 flex items-center justify-center rounded-full">
          <FaRegBell className="text-gray-500 text-2xl" />
        </div>

        <div className="relative">
         
           <div
  onClick={() => setShowUserMenuBar(!showUserMenuBar)}
  className="bg-[#906eb1fd] text-gray-100 font-semibold text-xl w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
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
