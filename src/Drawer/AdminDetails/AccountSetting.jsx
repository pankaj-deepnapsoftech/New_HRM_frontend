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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-3xl ml-30 shadow-2xl p-8 relative overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/3 bg-gradient-to-b from-indigo-50 to-white border-r border-gray-200 pr-6 rounded-l-2xl">
            <div className="flex flex-col items-center text-center">
              <img
                src="/profilee.png"
                alt="Profile"
                className="w-24 h-24 rounded-full mb-3 shadow-md border-4 border-white object-cover"
              />
              <h2 className="font-semibold text-lg mb-6 text-gray-800 truncate">
                {fullName}
              </h2>
              <ul className="space-y-2 text-left w-full">
                <li className="px-4 py-2 rounded-lg cursor-pointer bg-indigo-100 text-indigo-700 font-semibold shadow-sm hover:shadow-md transition-all">
                  Account Settings
                </li>
                <li className="px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all">
                  Privacy
                </li>
              </ul>
            </div>
          </aside>

          {/* Form Content */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Account Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  defaultValue={firstName}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  defaultValue={lastName}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  defaultValue={username}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full mt-1 px-4 py-2 h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  defaultValue={email}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full mt-1 px-4 py-2 h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  defaultValue={phone}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                Save
              </button>
              <button
                onClick={onClose}
                className="flex-1 text-gray-600 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-[1.02] transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes scale-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-scale-in { animation: scale-in 0.25s ease-out; }
        `}
      </style>
    </div>
  );
};

export default AccountSettingsModal;
