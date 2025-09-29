import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaFingerprint, FaBars } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { browserName, isMobile } from "react-device-detect";
import {
  RiListSettingsLine,
  RiMoneyRupeeCircleFill,
  RiMoneyRupeeCircleLine,
  RiSecurePaymentLine,
} from "react-icons/ri";
import {
  MdPerson,
  MdCoPresent,
  MdOutlineBlock,
  MdOutlineStickyNote2,
} from "react-icons/md";
import { TbListDetails, TbReportMoney } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import {
  GiLaptop,
  GiSecurityGate,
  GiMoneyStack,
  GiTakeMyMoney,
} from "react-icons/gi";
import { FiAlertTriangle, FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/service/Auth.services";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeData } from "@/store/slice/AuthSlice";

// Pages
import EmployeeTable from "@/pages/Employees";
import EmployeesReports from "@/pages/EmployeesReports";
import DailyAttendance from "@/pages/DailyAttendance";
import AllAttendance from "@/pages/AllAttendence";
import Projects from "@/pages/Projects";
import EmpLeaveBalance from "@/pages/EmpLeaveBalance";
import SalaryManagement from "@/pages/SalaryManagement";
import EmpLocation from "@/pages/EmpLocation";
import AssignAssets from "@/pages/Assets";
import TerminatedEmp from "@/pages/TerminatedEmp";
import GatepassApprovals from "@/pages/GatepassAproval";
import ShowCauseNotices from "@/pages/ShowCauseNotices";
import { FaChalkboardUser, FaPeopleRoof } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import PayrollSummary from "@/pages/PayrollSummary";
import EmpMoneyRequest from "@/pages/EmpMoneyRequest";
import Incentives from "@/pages/Incentives";
import Reimbursements from "@/pages/Reimbursements";
import EmpPayslip from "@/pages/EmpPayslip";
import AllLeaves from "@/pages/AllLeaves";
import Departments from "@/pages/Departments";

const Sidebar = () => {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const navigator = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const currPath = location.pathname;
  const [isOpen, setIsopen] = useState(false);
  const [payroolOpenArrow, setPayrollarrow] = useState(false);

  const [LogoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      const res = await LogoutUser({ isMobile, browser: browserName }).unwrap();
      dispatch(removeData());
      toast.success(res.message || "Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      text: <span className="text-[1rem] font-semibold">Dashboard</span>,
      icon: <FaHome className="text-2xl" />,
      path: "/",
    },
    {
      text: <span className="text-[1rem] font-semibold">Emp Dashboard</span>,
      icon: <FaChalkboardUser className="text-2xl" />,
      path: "/empdashboard",
    },
    {
      text: (
        <span className="text-[1rem] font-semibold">Employees Details</span>
      ),
      icon: <BsPersonCircle className="text-2xl" />,
      path: "/employees",
      element: <EmployeeTable />,
    },
    {
      text: <span className="text-[1rem] font-semibold">Department</span>,
      icon: <FaPeopleRoof className="text-2xl" />,
      path: "/departments",
      element: <Departments />,
    },
    {
      text: <span className="text-[1rem] font-semibold">Projects</span>,
      icon: <HiOutlineDocumentReport className="text-xl" />,
      path: "/projects",
      element: <Projects />,
    },
    {
      text: <span className="text-[1rem] font-semibold">Reports</span>,
      icon: <RiListSettingsLine className="text-2xl" />,
      path: "/employees-reports",
      element: <EmployeesReports />,
    },
    {
      text: (
        <span className="text-[1rem] font-semibold">Update Leave Balance</span>
      ),
      icon: <MdPerson className="text-2xl" />,
      path: "/empleaves",
      element: <EmpLeaveBalance />,
    },
    {
      text: (
        <span className="text-[1rem] font-semibold">Salary Management</span>
      ),
      icon: <RiMoneyRupeeCircleFill className="text-2xl" />,
      path: "/salarymanagement",
      element: <SalaryManagement />,
    },
    {
      text: (
        <button
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsopen(!isOpen)}
        >
          <span className="text-[1rem] font-semibold">Attendance</span>
          {isOpen ? <IoIosArrowUp size={17} /> : <IoIosArrowDown size={17} />}
        </button>
      ),
      icon: <MdCoPresent className="text-2xl" />,
      onClick: () => setAttendanceOpen(!attendanceOpen),
      subMenu: attendanceOpen && [
        {
          text: (
            <span className="text-[1rem] font-semibold">Daily Attendance</span>
          ),
          icon: <MdCoPresent className="text-xl mr-2" />,
          path: "/empyloyees-attendence",
          element: <DailyAttendance />,
        },
        {
          text: (
            <span className="text-[1rem] font-semibold">All Attendance</span>
          ),
          icon: <FaFingerprint className="text-2xl mr-2" />,
          path: "/all-attendence",
          element: <AllAttendance />,
        },
        {
          text: <span className="text-[1rem] font-semibold">All Leave</span>,
          icon: <TbListDetails className="text-2xl mr-2" />,
          path: "/all-leaves",
          element: <AllLeaves />,
        },
      ],
    },
    {
      text: <span className="text-[1rem] font-semibold">Emp Location</span>,
      icon: <IoLocationOutline className="text-2xl" />,
      path: "/employee/location",
      element: <EmpLocation />,
    },
    {
      text: <span className="text-[1rem] font-semibold">Assets</span>,
      icon: <GiLaptop className="text-2xl" />,
      path: "/company/assets",
      element: <AssignAssets />,
    },
    {
      text: <span className="text-[1rem] font-semibold">Terminated Emp</span>,
      icon: <MdOutlineBlock className="text-2xl" />,
      path: "/employee/terminated",
      element: <TerminatedEmp />,
    },
    {
      text: (
        <span className="text-[1rem] font-semibold">Gatepass Approval</span>
      ),
      icon: <GiSecurityGate className="text-2xl" />,
      path: "/gatepass/approval",
      element: <GatepassApprovals />,
    },
    {
      text: (
        <span className="text-[1rem] font-semibold">Show Cause Notice</span>
      ),
      icon: <FiAlertTriangle className="text-2xl" />,
      path: "/view/employee/show-cause/notice",
      element: <ShowCauseNotices />,
    },
    {
      text: (
        <button
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setPayrollarrow(!payroolOpenArrow)}
        >
          <span className="text-[1rem] font-semibold">Payroll</span>
          {payroolOpenArrow ? (
            <IoIosArrowUp size={17} />
          ) : (
            <IoIosArrowDown size={17} />
          )}
        </button>
      ),
      icon: <RiMoneyRupeeCircleLine className="text-2xl" />,
      onClick: () => setPayrollOpen(!payrollOpen),
      subMenu: payrollOpen && [
        {
          text: (
            <span className="text-[1rem] font-semibold">Payroll Summary</span>
          ),
          icon: <MdOutlineStickyNote2 className="text-2xl mr-2" />,
          path: "/employee/payrollSummary",
          element: <PayrollSummary />,
        },
        {
          text: (
            <span className="text-[1rem] font-semibold">Advanced Money</span>
          ),
          icon: <TbReportMoney className="text-2xl mr-2" />,
          path: "/employee/advance/money/request",
          element: <EmpMoneyRequest />,
        },
        {
          text: <span className="text-[1rem] font-semibold">Incentives</span>,
          icon: <GiMoneyStack className="text-2xl mr-2" />,
          path: "/employee/incentives",
          element: <Incentives />,
        },
        {
          text: (
            <span className="text-[1rem] font-semibold">Reimbursements</span>
          ),
          icon: <GiTakeMyMoney className="text-2xl mr-2" />,
          path: "/employee/reimbursements",
          element: <Reimbursements />,
        },
        {
          text: <span className="text-[1rem] font-semibold">Emp Payslip</span>,
          icon: <RiSecurePaymentLine className="text-2xl mr-2" />,
          path: "/generate/employee/payslip",
          element: <EmpPayslip />,
        },
      ],
    },
  ];

  return (
    <>
      <div className="flex items-center gap-10">
        <div className="md:hidden absolute z-50 top-4 left-3">
          <button onClick={() => setShowSidebar(!showSidebar)}>
            <FaBars className="text-2xl text-indigo-700" />
          </button>
        </div>
      </div>
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={`sidebar-scroll overflow-y-auto fixed top-0 left-0 bottom-0 h-screen w-64 md:w-72 bg-white text-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
  ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0 md:static md:block`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-100 to-indigo-50 shadow-sm rounded-b-xl">
          <div className="flex-shrink-0 relative">
            <img
              src="/d logo.png"
              alt="Deepnap Softech Logo"
              className="h-14 w-14 rounded-lg bg-white p-1 shadow-md transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-lg md:text-xl font-medium tracking-wide text-sky-800">
            Deepnap Softech
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1 mt-6 px-4 text-sm">
          {menuItems.map((item, index) => {
            const isActive = item.path && currPath === item.path;
            return (
              <div key={index}>
                <div
                  onClick={() => {
                    if (item.path) navigator(item.path);
                    if (item.onClick) item.onClick();
                    if (window.innerWidth < 768) setShowSidebar(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition duration-300 
              ${
                isActive
                  ? "bg-indigo-500 text-white font-bold shadow-md"
                  : "hover:bg-indigo-50 hover:text-indigo-600"
              }`}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </div>

                {/* Submenu */}
                {item.subMenu && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subMenu.map((subItem, subIndex) => {
                      const isSubActive = currPath === subItem.path;
                      return (
                        <div
                          key={subIndex}
                          onClick={() => {
                            navigator(subItem.path);
                            if (window.innerWidth < 768) setShowSidebar(false);
                          }}
                          className={`flex items-center gap-1 px-1 py-2 rounded-md cursor-pointer transition duration-300 
                      ${
                        isSubActive
                          ? "bg-indigo-500 text-white font-semibold shadow-sm"
                          : "hover:bg-sky-50 hover:text-indigo-500"
                      }`}
                        >
                          {subItem.icon}
                          <span>{subItem.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-20 w-full px-6 py-6 border-t border-gray-300">
          <button
            type="submit"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            style={{
              background: "linear-gradient(80deg, #1e40af 0%, #4f46e5 100%)", 
              backgroundSize: "200% 200%",
              animation: "gradientAnimation 4s ease infinite",
            }}
          >
            <FiLogOut size={18} />
            <span className="text-base">Logout</span>
          </button>

          <style>{`
            @keyframes gradientAnimation {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
