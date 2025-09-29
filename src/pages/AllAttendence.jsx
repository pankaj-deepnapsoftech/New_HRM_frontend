import React, { useState } from "react";
import Select from "react-select";

const monthOptions = [];
const startDate = new Date("2025-01-01");
const currentDate = new Date();
const endDate = new Date(currentDate.getFullYear() + 2, 11);

while (startDate <= endDate) {
  const value = startDate.toISOString().slice(0, 7);
  const label = startDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  monthOptions.push({ value, label });
  startDate.setMonth(startDate.getMonth() + 1);
}

const AllAttendance = () => {
  const departmentOptions = [
    { value: "all", label: "All" },
    { value: "hr", label: "HR" },
    { value: "engineering", label: "Engineering" },
    { value: "sales", label: "Sales" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#6366F1" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(99,102,241,0.4)" : "none",
      padding: "2px",
      fontSize: "0.875rem",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "#6366F1",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#E0E7FF"
        : state.isFocused
        ? "#F5F3FF"
        : "white",
      color: "#111827",
      cursor: "pointer",
    }),
  };

  const FilterByMonth = ({ selectedMonth, onChange }) => {
    return (
      <div className="flex flex-col w-36 md:w-60 shrink-0">
        <label className="text-sm font-medium mb-1 text-gray-700">
          Filter by Month
        </label>
        <Select
          options={monthOptions}
          styles={customStyles}
          value={monthOptions.find((opt) => opt.value === selectedMonth)}
          onChange={(selected) => onChange(selected.value)}
          placeholder="Select month"
        />
      </div>
    );
  };

  const [selectedMonth, setSelectedMonth] = useState("2025-01");
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="bg-gradient-to-b from-gray-300 to-gray-300 text-center mx-5 md:mx-10 py-5 my-6 rounded-lg shadow-md shadow-gray-400">
        <h2 className="text-xl md:text-2xl font-semibold text-black tracking-wide">
          All Employees Attendance
        </h2>
      </div>

      {/* Filters Row */}
      <div className="mt-8 mx-2 md:mx-10">
        <div className="flex flex-wrap gap-6 items-end">
          {/* Month Filter */}
          <div className="flex flex-col w-full sm:w-52 md:w-60">
            <FilterByMonth
              selectedMonth={selectedMonth}
              onChange={setSelectedMonth}
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-col w-full sm:w-52 md:w-60">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Filter by Department
            </label>
            <Select
              name="departments"
              options={departmentOptions}
              styles={customStyles}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#6366F1",
                  primary25: "#EEF2FF",
                  primary50: "#E0E7FF",
                },
              })}
              classNamePrefix="select"
              placeholder="Select Department(s)"
              value={selectedDepartments}
              onChange={setSelectedDepartments}
            />
          </div>

          {/* Export Button */}
          <div className="ml-auto">
            <button className="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200">
              EXPORT
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow-lg rounded-xl mx-2 md:mx-10 mt-10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm md:text-base text-left">
            <thead>
              <tr className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 uppercase text-xs md:text-sm font-medium tracking-wide">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Salary</th>
                <th className="px-4 py-4">Present Days</th>
                <th className="px-4 py-4">Absent Days</th>
                <th className="px-4 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition duration-150">
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-500 text-sm md:text-base"
                >
                  No attendance data found for the selected filters
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AllAttendance;
