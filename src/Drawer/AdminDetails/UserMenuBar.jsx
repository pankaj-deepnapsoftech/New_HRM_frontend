import React, { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FiUser, FiLock, FiSettings, FiLogOut } from "react-icons/fi";
import UserProfile from "@/Drawer/AdminDetails/UserProfile";
import { useDispatch } from "react-redux";
import { removeData } from "@/store/slice/AuthSlice";
import { toast } from "react-toastify";
import {
  useChangePasswordMutation,
  useLogoutUserMutation,
} from "@/service/Auth.services";
import { ChangePassSchema } from "@/Validation/AuthValidation/ChangePassValidation";
import { useFormik } from "formik";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import AccountSettingsModal from "./AccountSetting";
import { browserName, isMobile } from "react-device-detect";

const UserMenuBar = ({ showUserMenuBar, setShowUserMenuBar }) => {
  const sidebarRef = useRef(null);
  const [ChangePassword, { isLoading }] = useChangePasswordMutation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePassPage, setshowChangePassPage] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [LogoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await LogoutUser({ isMobile, browser: browserName }).unwrap();
      dispatch(removeData());
      window.location.href = "/";
      toast.success(res.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const {
    handleBlur,
    handleSubmit,
    resetForm,
    handleChange,
    touched,
    errors,
    values,
  } = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangePassSchema,
    onSubmit: async (values) => {
      try {
        const res = await ChangePassword(values).unwrap();
        toast.success(res?.message);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowUserMenuBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <section
        ref={sidebarRef}
        className={`${
          showUserMenuBar ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 z-50 h-screen w-[60vw] md:w-[22vw] bg-white shadow-2xl transition-transform duration-500 ease-in-out rounded-l-2xl overflow-auto`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            className="text-black hover:text-gray-700 transition-all cursor-pointer"
            onClick={() => setShowUserMenuBar(false)}
            aria-label="Close menu"
          >
            <IoIosClose size={32} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 px-4 sm:px-6 text-black">
          <ul className="flex flex-col gap-4 text-base font-medium">
            <li>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowUserMenuBar(!showUserMenuBar);
                }}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 shadow-md hover:bg-indigo-500 hover:text-white cursor-pointer"
              >
                <FiUser size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  View Profile
                </span>
              </button>
            </li>

            <li>
              <button
                disabled={isLoading}
                onClick={() => {
                  setshowChangePassPage(!showChangePassPage);
                  setShowUserMenuBar(!showUserMenuBar);
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              >
                <FiLock size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  Change Password
                </span>
              </button>
            </li>

            <li>
              <button
                className="flex items-center gap-4 hover:bg-indigo-500 hover:text-white p-3 rounded-xl  transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => {
                  setSettingsOpen(true);
                  setShowUserMenuBar(false);
                }}
              >
                <FiSettings size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  Account Settings
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-600/20 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-red-600 hover:text-red-800"
              >
                <FiLogOut size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="w-full absolute bottom-0 text-center p-4 text-xs text-black/70">
          © 2025 Your Company
        </div>
      </section>

      {/* Change Password Modal */}
      <div
        className={`${
          showChangePassPage ? "opacity-100 visible" : "opacity-0 invisible"
        } fixed inset-0 z-60 bg-black/40 flex items-center justify-center transition-opacity duration-300`}
      >
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative animate-slide-in overflow-auto max-h-[90vh]">
          <button
            onClick={() => setshowChangePassPage(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-600 transition-all"
          >
            <IoIosClose size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-6 text-center text-black">
            Change Password
          </h2>
          <form
            className="space-y-6 w-full max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            {/* Current Password */}
            <div className="relative group">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={values.oldPassword}
                className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all"
                placeholder=" "
              />
              <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-xs">
                Current Password
              </label>
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {showOldPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
              </button>
              {touched.oldPassword && errors.oldPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="relative group">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={values.newPassword}
                className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all"
                placeholder=" "
              />
              <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-xs">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {showNewPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
              </button>
              {touched.newPassword && errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword}
                </p>
              )}
              {/* Password Strength Indicator */}
              {values.newPassword && (
                <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      values.newPassword.length < 6
                        ? "w-1/3 bg-red-500"
                        : values.newPassword.length < 10
                        ? "w-2/3 bg-yellow-400"
                        : "w-full bg-green-500"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="relative group">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                className="peer w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all"
                placeholder=" "
              />
              <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-xs">
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {showConfirmPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
              </button>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                isLoading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* External Components */}
      <UserProfile showUserMenu={showUserMenu} setShowMenu={setShowUserMenu} />
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default UserMenuBar;
