import React, { useState } from "react";
import {
  useGetAllEmpDataQuery,
  useAddEmpDataMutation,
  useUpdateEmpDataMutation,
  useDeleteEmpDataMutation,
  useCreateCredentialsMutation,
} from "@/service/EmpData.services";
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { validationSchema } from "@/Validation/EmpDashboardValidation";
import Pagination from "./Pagination/Pagination";
import { useGetAllDepartmentQuery } from "@/service/Department";

const EmpDashboard = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, refetch, isLoading } = useGetAllEmpDataQuery({ page, limit });
  const [addEmpData] = useAddEmpDataMutation();
  const [updateEmpData] = useUpdateEmpDataMutation();
  const [deleteEmpData] = useDeleteEmpDataMutation();
  const [createCredentials] = useCreateCredentialsMutation();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [credModal, setCredModal] = useState(null);
  const [credForm, setCredForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || "");
  const { data: departmentData } = useGetAllDepartmentQuery()
  const employees = data?.data || [];
  const [selectedDepartment, setSelectedDepartment] = useState('');
   
  const departmentMap = departmentData?.data?.reduce((acc, curr) => {
    const dept = curr.department_name?.trim();
    if (!acc[dept]) acc[dept] = new Set();
    acc[dept].add(curr.sub_department);
    return acc;
  }, {});
  
  const uniqueDepartments = Object.keys(departmentMap || {});

  const filteredSubDepartments = selectedDepartment
    ? Array.from(departmentMap[selectedDepartment] || [])
    : [];



  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      searchQuery === "" ||
      emp.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" || emp.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const formik = useFormik({
    initialValues: {
      fname: selectedEmployee?.fname || "",
      department: selectedEmployee?.department || "",
      designation: selectedEmployee?.designation || "",
      empCode: selectedEmployee?.empCode || "",
      salary: selectedEmployee?.salary || "",
      date: selectedEmployee?.date?.split("T")[0] || "",
      location: selectedEmployee?.location || "",
      email: selectedEmployee?.email || "",
      sub_department: selectedEmployee?.sub_department || ""
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (editMode && selectedEmployee) {
          await updateEmpData({ id: selectedEmployee._id, ...values }).unwrap();
        } else {
          await addEmpData(values).unwrap();
        }
        setShowModal(false);
        setEditMode(false);
        setSelectedEmployee(null);
        formik.resetForm();
        refetch(page);
      } catch (error) {
        console.error("Error saving employee:", error);
      }
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmpData(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading employees…</p>;

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md max-w-5xl mx-auto mt-10">
      <div className="bg-gray-300 text-center py-4 my-8 rounded-md shadow-md shadow-gray-400">
        <h2 className="text-xl font-[500]">Employee Dashboard</h2>
      </div>
      <div className="flex justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-4 flex-wrap flex-1">
          <input
            type="text"
            placeholder="Search Name, Emp Code, Dept, Email..."
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
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setSelectedEmployee(null);
          }}
          className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md"
        >
          ADD EMPLOYEE DETAILS
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded">
        <table className="w-full min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-200 whitespace-nowrap text-gray-700 uppercase font-semibold">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-4 text-left whitespace-nowrap">Sub Department</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Emp Code</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
              <th className="p-3 text-left">Login</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-8 text-gray-500">
                  {searchQuery || selectedDepartment
                    ? "No employees found matching your filters"
                    : "No employees found"}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, idx) => (
                <tr
                  key={emp._id}
                  className={`border-b whitespace-nowrap  border-gray-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                >
                  <td className="pl-4 py-2 px-2 text-[16px]">{emp.fname}</td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {emp.email || "N/A"}
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {emp.department}
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {emp.sub_department} 
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {emp.designation}
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">{emp.empCode}</td>
                  <td className="pl-4 py-2 px-2 text-[16px]">{emp.salary}</td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {emp.location || "NA"}
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    {new Date(emp.date).toLocaleDateString()}
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px] flex gap-3 ">
                    <FaEye
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowViewModal(true);
                      }}
                      className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                      title="View"
                    />
                    <FaEdit
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                      className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
                      title="Edit"
                    />
                    <FaTrash
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                      title="Delete"
                    />
                  </td>
                  <td className="pl-4 py-2 px-2 text-[16px]">
                    <button
                      onClick={() => {
                        setCredModal(emp);
                        setCredForm({
                          email: emp.email || "",
                          password: "",
                          fullName: emp.fname || "",
                          phone: "",
                        });
                      }}
                      className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-md shadow hover:from-indigo-600 hover:to-indigo-700 active:scale-95 transition"
                      title="Create login credentials"
                    >
                      Create Login
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>{" "}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-md w-[80%] max-w-xl shadow-md relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
                formik.resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500 transition"
            >
              <IoIosClose size={32} />
            </button>

            <h3 className="text-lg font-bold mb-4">
              {editMode ? "Edit Employee" : "Add New Employee"}
            </h3>
            <form onSubmit={formik.handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="fname"
                  placeholder="Full Name"
                  value={formik.values.fname}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.fname && formik.errors.fname && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.fname}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>

             
              <div>
                <label htmlFor="department" className="block mb-1 font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedDepartment(selected);
                    formik.setFieldValue('department', selected);
                    formik.setFieldValue('sub_department', '');
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="">Select Department</option>
                  {uniqueDepartments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {formik.touched.department && formik.errors.department && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.department}</div>
                )}
              </div>

              {/* Sub Department Dropdown */}
              <div className="mt-4">
                <label htmlFor="sub_department" className="block mb-1 font-medium text-gray-700">
                  Sub Department
                </label>
                <select
                  name="sub_department"
                  id="sub_department"
                  value={formik.values.sub_department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-3 rounded-lg border border-gray-300"
                  disabled={!selectedDepartment}
                >
                  <option value="">Select Sub Department</option>
                  {filteredSubDepartments.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                {formik.touched.sub_department && formik.errors.sub_department && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.sub_department}</div>
                )}
              </div>


              <div>
                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.designation && formik.errors.designation && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.designation}
                  </div>
                )}
              </div>

              {/* <div>
                <input
                  type="text"
                  name="empCode"
                  placeholder="Employee Code"
                  value={formik.values.empCode}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.empCode && formik.errors.empCode && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.empCode}
                  </div>
                )}
              </div> */}

              <div>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.salary && formik.errors.salary && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.salary}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.location}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.date}
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  {editMode ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-xl shadow-md relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500 transition"
            >
              <IoIosClose size={32} />
            </button>

            <h3 className="text-lg font-bold mb-4">Employee Details</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Name", value: selectedEmployee.fname },
                { label: "Department", value: selectedEmployee.department },
                { label: "Designation", value: selectedEmployee.designation },
                { label: "Emp Code", value: selectedEmployee.empCode },
                { label: "Salary", value: selectedEmployee.salary },
                { label: "Location", value: selectedEmployee.location || "NA" },
                {
                  label: "Date",
                  value: new Date(selectedEmployee.date).toLocaleDateString(),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b py-2">
                  <span className="font-medium">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {credModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md shadow-md relative">
            <button
              onClick={() => setCredModal(null)}
              className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500 transition"
            >
              <IoIosClose size={32} />
            </button>
            <h3 className="text-lg font-bold mb-4">Create Login</h3>
            <div className="space-y-3">
              <input
                type="email"
                value={credForm.email}
                onChange={(e) =>
                  setCredForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="Email"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={credForm.password}
                  onChange={(e) =>
                    setCredForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Password (optional)"
                  className="w-full p-3 pr-10 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto text-gray-600 hover:text-gray-800"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  title={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Agar password blank hua to temporary password auto-generate
                hoga.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setCredModal(null)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    if (!isValidEmail(credForm.email)) {
                      toast.error("Please enter a valid email");
                      return;
                    }
                    if (
                      credForm.password &&
                      (credForm.password.length < 6 ||
                        credForm.password.length > 16)
                    ) {
                      toast.error("Password must be 6-16 characters");
                      return;
                    }
                    const res = await createCredentials({
                      id: credModal._id,
                      email: credForm.email.trim(),
                      password: credForm.password?.trim(),
                    }).unwrap();
                    const pwd = res?.data?.tempPassword;
                    if (pwd) {
                      toast.success(`Temporary password: ${pwd}`);
                    } else {
                      toast.success("Credentials created");
                    }
                    setCredModal(null);
                    refetch();
                  } catch (e) {
                    const msg =
                      e?.data?.message || "Failed to create credentials";
                    toast.error(msg);
                  }
                }}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={filteredEmployees?.length === 10}
      />
    </div>
  );
};

export default EmpDashboard;
