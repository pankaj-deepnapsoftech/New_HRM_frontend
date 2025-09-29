import React from "react";
import { GoCodeReview } from "react-icons/go";

const showCauseData = [
  {
    complaintBy: "Nitish Prajapati",
    department: "It",
    reason: "misbehave",
    issuedAt: "2/26/2025",
    complaintTo: "abhi (ABH74130227)",
    status: "Reviewed",
  },
  {
    complaintBy: "komal singh",
    department: "IT",
    reason: "absent without Inform",
    issuedAt: "3/3/2025",
    complaintTo: "Nitish (NIT51130226)",
    status: "Reviewed",
  },
];

const ShowCauseNotices = () => {
  return (
    <div className="p-4 h-screen bg-gray-50 rounded shadow-md max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gray-300 text-gray-600 text-xl font-semibold py-4 px-4 rounded-xl shadow-md shadow-gray-400  w-full max-w-6xl text-center">
        Employee Show Cause Notices
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl overflow-x-auto scrollbar-visible bg-white shadow rounded-xl mt-20 ">
        <table className="w-4xl md:min-w-full divide-y divide-gray-200 text-sm text-left py-">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Complaint By</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Issued At</th>
              <th className="px-4 py-3">Complaint To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {showCauseData.map((entry, index) => (
              <tr
                key={index}
                className="border-b text-[16px] whitespace-nowrap border-gray-300 text-gray-600"
              >
                <td className="px-4 py-3">{entry.complaintBy}</td>
                <td className="px-4 py-3">{entry.department}</td>
                <td className="px-4 py-3">{entry.reason}</td>
                <td className="px-4 py-3">{entry.issuedAt}</td>
                <td className="px-4 py-3">{entry.complaintTo}</td>
                <td className="px-4 py-3">{entry.status}</td>
                <td className="px-4 py-3">
                  <button title="Review" className="text-blue-700 font-bold">
                    <GoCodeReview />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowCauseNotices;
