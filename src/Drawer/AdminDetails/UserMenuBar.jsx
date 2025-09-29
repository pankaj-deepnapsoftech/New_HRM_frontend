import React, { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FiUser, FiLock, FiSettings, FiLogOut } from "react-icons/fi";
import UserProfile from "@/Drawer/AdminDetails/UserProfile";
import { useDispatch } from "react-redux";
import { removeData } from "@/store/slice/AuthSlice";
import { toast } from "react-toastify";
import {useChangePasswordMutation,useLogoutUserMutation} from "@/service/Auth.services";
import { ChangePassSchema } from "@/Validation/AuthValidation/ChangePassValidation";
import { useFormik } from "formik";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import AccountSettingsModal from "./AccountSetting";
import { browserName, isMobile } from "react-device-detect";
// import { browserName, isMobile } from "react-device-detect";

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
      const res = await LogoutUser({isMobile, browser: browserName}).unwrap();
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
        toast.success(res?.message)
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
      <section
        ref={sidebarRef}
        className={`${
          showUserMenuBar ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 z-50 h-screen w-[60vw] md:w-[20vw] bg-gradient-to-b from-[#805d96] to-[#43344d] shadow-lg transition-transform duration-500 ease-in-out`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end p-4">
          <button
            className="text-white hover:text-gray-300 transition cursor-pointer"
            onClick={() => setShowUserMenuBar(false)}
            aria-label="Close menu"
          >
            <IoIosClose size={32} />
          </button>
        </div>

        <nav className="mt-4 px-6 text-white">
          <ul className="flex flex-col gap-3 text-base font-medium">
            <li>
              <button
                onClick={() => {setShowUserMenu(!showUserMenu), setShowUserMenuBar(!showUserMenuBar)}}
                className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <FiUser size={20} className="shrink-0" />
                <span>View Profile</span>
              </button>
            </li>

            <li>
              <button
                disabled={isLoading}
                onClick={() => {setshowChangePassPage(!showChangePassPage),setShowUserMenuBar(!showUserMenuBar)}}
                className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <FiLock size={20} className="shrink-0" />
                <span>Change Password</span>
              </button>
            </li>
           
            <li>
              <button
                className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => {
                  setSettingsOpen(true); // open modal
                  setShowUserMenuBar(false); // close sidebar
                }}
              >
                <FiSettings size={20} className="shrink-0" />
                <span>Account Settings</span>
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out text-red-200 hover:text-red-100 cursor-pointer"
              >
                <FiLogOut size={20} className="shrink-0" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="w-full absolute bottom-0 text-center p-4 text-xs text-white/70">
          © 2025 Your Company
        </div>
      </section>

      <div
        className={` ${
          showChangePassPage ? "opacity-100 visible" : "opacity-0 invisible"
        } fixed inset-0 z-60 bg-black/40 flex items-center justify-center transition-opacity duration-300`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
          <button
            onClick={() => setshowChangePassPage(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          >
            <IoIosClose size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Change Password
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={values.oldPassword}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showOldPassword ? <IoEyeOutline/>  : <FaRegEyeSlash/>}
                </button>
              </div>
              {touched.oldPassword && errors.oldPassword && (
                <p className="text-sm text-red-500">{errors.oldPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={values.newPassword}
                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showNewPassword ?  <IoEyeOutline/>  : <FaRegEyeSlash/>}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={values.confirmPassword}
                   className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <IoEyeOutline/>  : <FaRegEyeSlash/>}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md transition duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      <UserProfile showUserMenu={showUserMenu} setShowMenu={setShowUserMenu} />
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default UserMenuBar;
