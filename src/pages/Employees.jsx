import LocationModal from "@/Drawer/Employees/LocationModal";
import EmployeeForm from "@/Drawer/EmployeeDetails/EmployeeRegistration";
import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import ViewModal from "@/Drawer/Employees/ViewModal";
import {
  useEpmDeleteDataMutation,
  useEpmGetDataQuery,
} from "@/service/Employee.services";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "./Pagination/Pagination";
import { useGetAllDepartmentQuery } from "@/service/Department";

const EmployeeTable = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowFrom] = useState(false);
  const [editTable, setEdittable] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { data, refetch } = useEpmGetDataQuery({ page });
  const [EmpDeleteData] = useEpmDeleteDataMutation();
  const { data: departmentData } = useGetAllDepartmentQuery()
  const employee = data?.data || [];

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.toString().split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const departmentMap = departmentData?.data?.reduce((acc, curr) => {
    const dept = curr.department_name?.trim();
    if (!acc[dept]) acc[dept] = new Set();
    acc[dept].add(curr.sub_department);
    return acc;
  }, {});

  const uniqueDepartments = Object.keys(departmentMap || {});

  const filteredEmployees = employee.filter((emp) => {
    const matchesSearch =
      searchQuery === "" ||
      emp.Emp_id?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.Address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Back_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Bank_Account?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.IFSC_Code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.UAN_number?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emp.salary?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" || emp.Department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const hanldedelete = async (_id) => {
    try {
      if (window.confirm("are you sure you want to delete this element ?")) {
        const res = await EmpDeleteData(_id).unwrap();
        toast.success(res?.message);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || error.message || "Failed to delete employee"
      );
    }
  };

  useEffect(() => {
    if (!showForm) {
      refetch(page);
    }
  }, [refetch, showForm, page]);

  return (
    <div className="p-1 h-screen bg-gray-50 rounded shadow-md max-w-5xl mx-auto ">
      <div className="bg-gradient-to-b from-gray-300 to bg-gray-300 text text-center  mx-5 md:mx-10 py-4 my-6 rounded-md shadow-md shadow-gray-400">
        <h2 className="text-xl font-[500]">Employees All Details</h2>
      </div>
                     
      <div className="flex justify-between mb-4 mt-10 gap-4 flex-wrap mx-5 md:mx-10">
        <div className="flex gap-4 flex-wrap flex-1">
          <input
            type="text"
            placeholder="Search Emp ID, Address, Department, Bank Details, Salary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg flex-1 min-w-[250px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg min-w-[150px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setShowFrom(!showForm);
              setEdittable(null);
            }}
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Add Employee Details
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-t-sm md:rounded-t-xl shadow-md mx-5 md:mx-10 mb-8 scrollbar-visible">
        <table className="min-w-full shadow-lg border mt-10 border-gray-200 text-sm">
          <thead className="bg-gray-200 text-[16px] text-gray-700 font-semibold">
            <tr>
              <th className="p-4 text-left whitespace-nowrap">Emp ID</th>
              
              <th className="p-4 text-left whitespace-nowrap">Bank Name</th>
              <th className="p-4 text-left whitespace-nowrap">Bank Account</th>
              <th className="p-4 text-left whitespace-nowrap">IFSC Code</th>
              <th className="p-4 text-left whitespace-nowrap">UAN Number</th>
              <th className="p-4 text-left whitespace-nowrap">Aadhaar</th>
              <th className="p-4 text-left whitespace-nowrap">PAN Card</th>
              <th className="p-4 text-left whitespace-nowrap">Voter ID</th>
              <th className="p-4 text-left whitespace-nowrap">
                Driving License
              </th>
              <th className="p-4 text-left whitespace-nowrap">Bank Proof</th>
              <th className="p-4 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center py-8 text-gray-500">
                  {searchQuery || selectedDepartment
                    ? "No employees found matching your filters"
                    : "No employees found"}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp._id}
                  className={`border-t border-gray-200 ${
                    emp._id % 2 === 0 ? "bg-gray-200" : "bg-white"
                  } text-[16px] `}
                >
                  <td className="pl-4 py-3">
                    {highlightSearchTerm(emp?.Emp_id?.empCode, searchQuery)}
                  </td>
              
                  <td className="pl-4 py-3">
                    {highlightSearchTerm(emp.Back_Name, searchQuery)}
                  </td>
                  <td className="pl-4 py-3">
                    {highlightSearchTerm(emp.Bank_Account, searchQuery)}
                  </td>
                  <td className="pl-4 py-3">
                    {highlightSearchTerm(emp.IFSC_Code, searchQuery)}
                  </td>
                  <td className="pl-4 py-3">
                    {highlightSearchTerm(emp.UAN_number, searchQuery)}
                  </td>
                  <td className="pl-4 py-3">
                    <a
                      href={emp.aadhaar}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Aadhaar"
                    >
                      Aadhaar
                    </a>
                  </td>
                  <td className="pl-4 py-3">
                    <a
                      href={emp.pancard}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View PAN"
                    >
                      Pancard
                    </a>
                  </td>
                  <td className="pl-4 py-3">
                    <a
                      href={emp.Voter_Id}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Voter ID"
                    >
                      Voter Id
                    </a>
                  </td>
                  <td className="pl-4 py-3">
                    <a
                      href={emp.Driving_Licance}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Driving License"
                    >
                      Driving Licance
                    </a>
                  </td>
                  <td className="pl-4 py-3">
                    <a
                      href={emp.Bank_Proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Bank Proof"
                    >
                      Bank Proof
                    </a>
                  </td>
               

                  <td className="pl-4 py-6 flex gap-2 text-lg">
                    <FaEye
                      onClick={() => {
                        setShowDetailModal(true);
                        setSelectedEmployee(emp);
                      }}
                      className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                      title="View"
                    />
                    <FaEdit
                      onClick={() => {
                        setShowFrom(true);
                        setEdittable(emp);
                      }}
                      className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
                      title="Edit"
                    />
                    <FaTrash
                      onClick={() => hanldedelete(emp._id)}
                      className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                      title="Delete"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewModal
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        employee={selectedEmployee}
      />
      <EmployeeForm
        setShowFrom={setShowFrom}
        showForm={showForm}
        editTable={editTable}
      />
      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={filteredEmployees?.length === 10}
      />
    </div>
  );
};

export default EmployeeTable;
