import React from "react";
// ✅ Import RTK hook
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";

const AllLeaves = () => {
  // ✅ Fetch employees from empdata API
  const { data: empResponse = {}, isLoading } = useGetAllEmpDataQuery();
  const employees = empResponse.data || [];

  // ✅ Show loader if needed
  if (isLoading) {
    return <p className="text-center py-10">Loading employee leaves…</p>;
  }

  return (
    <div className="p-2 bg-gray-50 rounded shadow-md max-w-5xl mx-auto">
      <div className="bg-gray-300 text-gray-600 font-semibold text-xl py-4 px-6 mx-4 md:mx-6 text-center rounded-lg shadow-md shadow-gray-400">
        Employee All Leave
      </div>

      <div className="overflow-x-scroll scrollbar-visible rounded-t-xl shadow-md mx-4 md:mx-6 mb-8 mt-8">
        <table className="w-5xl md:min-w-full whitespace-nowrap table-auto bg-white">
          <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-3 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Department</th>
              <th className="px-3 py-3 text-left">Role</th>
              <th className="px-3 py-3 text-left">Emp-Code</th> 
              <th className="px-3 py-3 text-left">No. of Half Leaves</th>
              <th className="px-3 py-3 text-left">No. of Full Leaves</th>
              <th className="px-3 py-3 text-left">Present Leave</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {employees.map((emp, index) => (
              <tr
                key={emp._id || index}
                className={`border-t border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-2 text-[17px]">
                  {emp.fname || emp.fullName || "NA"}
                </td>
                <td className="px-3 py-2 text-[17px]">{emp.email || "NA"}</td>
                <td className="px-3 py-2 text-[17px]">{emp.department || "NA"}</td>
                <td className="px-3 py-2 text-[17px]">{emp.designation || "NA"}</td>
                <td className="px-3 py-2 text-[17px]">{emp.empCode || "NA"}</td>
                <td className="px-3 py-2 text-[17px]">
                  {emp.halfDayLeavesThisMonth ?? "NA"}
                </td>
                <td className="px-3 py-2 text-[17px]">
                  {emp.fullDayLeavesThisMonth ?? "NA"}
                </td>
                <td className="px-3 py-2 text-[17px]">{"NA"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllLeaves;
