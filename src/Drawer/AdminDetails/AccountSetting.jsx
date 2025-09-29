import React from "react";
import { useSelector } from "react-redux";

const AccountSettingsModal = ({ isOpen, onClose }) => {
  
  const fullName = useSelector((state) => state.Auth.fullName);
  const [firstName, lastName] = fullName?.split(" ") || ["", ""];
  const username = useSelector((state) => state.Auth.username);
  const email = useSelector((state) => state.Auth.email);
  const phone = useSelector((state) => state.Auth.phone);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/3 border-r border-gray-200 pr-6">
            <div className="flex flex-col items-center text-center">
              <img
                src="/profilee.png"
                alt="Profile"
                className="w-24 h-24 rounded-full mb-2"
              />
              <h2 className="font-semibold text-lg mb-6">{fullName}</h2>
              <ul className="space-y-4 text-left w-full">
                <li className="text-gray-600 hover:text-blue-500 font-semibold">
                  Account Settings
                </li>
                <li className="text-gray-600 hover:text-blue-500 font-semibold">
                  Privacy
                </li>
                {/* <li className="text-gray-600">Personal Information</li>
                <li className="text-gray-600">Notification</li> */}
              </ul>
            </div>
          </aside>

          {/* Form Content */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-800">First name</label>
                <input
                  type="text"
                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  defaultValue={firstName}
                />
              </div>
              <div>
                <label className="text-sm text-gray-800">Last name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  defaultValue={lastName}
                />
              </div>
              <div>
                <label className="text-sm text-gray-800">Username</label>
                <input
                  type="text"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  defaultValue={username}
                />
              </div>
              {/* <div>
                <label className="text-sm text-gray-800">Password</label>
                <input type="password" className="w-full border border-gray-400 rounded px-3 py-2 mt-1" defaultValue={} />
              </div> */}
              <div>
                <label className="text-sm text-gray-800">E-mail</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  defaultValue={email}
                />
              </div>
              <div>
                <label className="text-sm text-gray-800">Phone number</label>
                <input
                  type="tel"
                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  defaultValue={phone}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-6 py-2 rounded">
                Save
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 px-4 border border-gray-400 rounded hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
