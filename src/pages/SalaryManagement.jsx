import React, { useState, useEffect } from "react";
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import Pagination from "./Pagination/Pagination";

export default function SalaryManagement() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useGetAllEmpDataQuery({ page, limit });

  useEffect(() => {
    if (data?.data) {
      setEmployees(
        data.data.map((emp) => {
          const currentMonth = "2025-09";
          const presentDays = emp.attendance.filter(
            (a) =>
              a.date.startsWith(currentMonth) &&
              a.status.toLowerCase() === "present"
          ).length;

          const leaves =
            emp.fullDayLeavesThisMonth + emp.halfDayLeavesThisMonth * 0.5;

          return {
            id: emp._id,
            name: `${emp.fname} ${emp.lastName || ""}`.trim(),
            code: emp.empCode,
            salary: emp.salary,
            days: presentDays,
            leaves: leaves,
          };
        })
      );
    }
  }, [data]);

  const handleInputChange = (index, field, value) => {
    const newEmps = [...employees];
    newEmps[index][field] = parseFloat(value) || 0;
    setEmployees(newEmps);
  };

  const calculateSalary = (emp) => {
    const daysInMonth = 30;
    return Math.round((emp.salary / daysInMonth) * emp.days);
  };

  const downloadReport = () => {
    const reportData = employees.map((emp) => ({
      "Full Name": emp.name,
      "Emp-Code": emp.code,
      "New Monthly Salary": emp.salary,
      "Present Days": emp.days,
      Leaves: emp.leaves,
      "Calculated Salary": calculateSalary(emp),
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Report");
    XLSX.writeFile(wb, "salary_report.xlsx");
  };

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading employee data...
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-sm max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-300 to-gray-200 py-4 px-6 my-6 mx-2 md:mx-10 rounded-md shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">
          Salary Management
        </h2>

        <button
          onClick={downloadReport}
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-medium px-5 py-2 rounded-md shadow-md flex items-center gap-2 transition-all"
        >
          <FaDownload />
          Download Report
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md mx-4 md:mx-12 my-8 border border-gray-200">
        <table className="min-w-full w-full table-auto bg-white">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold">    
            <tr>
              <th className="py-4 px-5 text-left">Full Name</th>
              <th className="py-4 px-5 text-left">Emp-Code</th>
              <th className="py-4 px-5 text-left">New Monthly Salary</th>
              <th className="py-4 px-5 text-left">Present Days</th>
              <th className="py-4 px-5 text-left">Leaves</th>
              <th className="py-4 px-5 text-left">Calculated Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-all`}
              >
                <td className="py-4 px-5 whitespace-nowrap">{emp.name}</td>
                <td className="py-4 px-5">{emp.code}</td>
                <td className="py-4 px-5">
                  <input
                    type="number"
                    value={emp.salary}
                    onChange={(e) =>
                      handleInputChange(i, "salary", e.target.value)
                    }
                    className="w-40 px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                </td>
                <td className="py-4 px-5">
                  <input
                    type="number"
                    value={emp.days}
                    onChange={(e) =>
                      handleInputChange(i, "days", e.target.value)
                    }
                    className="w-28 px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                </td>
                <td className="py-4 px-5">
                  <input
                    type="number"
                    value={emp.leaves}
                    onChange={(e) =>
                      handleInputChange(i, "leaves", e.target.value)
                    }
                    className="w-28 px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  />
                </td>
                <td className="py-4 px-5 text-gray-800 font-semibold">
                  ₹ {calculateSalary(emp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={employees?.length === 10}
      />
    </div>
  );
}
