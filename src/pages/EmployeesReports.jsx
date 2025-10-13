import React, { useEffect, useRef, useState } from "react";
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";
import * as XLSX from "xlsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "react-toastify";
import Pagination from "./Pagination/Pagination";

mapboxgl.accessToken = `${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;

const EmployeesReports = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: data } = useGetAllEmpDataQuery({ page, limit });
  const employees = data?.data || [];

  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState({
    lng: 0,
    lat: 0,
    place: "",
  });

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (showMap && mapContainer.current && mapData.lng && mapData.lat) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [mapData.lng, mapData.lat],
        zoom: 12,
      });

      new mapboxgl.Marker()
        .setLngLat([mapData.lng, mapData.lat])
        .addTo(map.current);

      return () => map.current?.remove();
    }
  }, [showMap, mapData]);

  const handleLocationClick = async (location) => {
    try {
      const query = encodeURIComponent(location);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data?.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        setMapData({ lng, lat, place: location });
        setShowMap(true);
      } else {
        toast("Location not found on map.");
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const handleExport = () => {
    const exportData = employees.map((emp) => ({
      Name: emp.fname || "NA",
      Location: emp.location || "NA",
      Department: emp.department || "NA",
      Designation: emp.designation || "NA",
      Salary: emp.salary ? emp.salary.toLocaleString() : "NA",
      Assets:
        emp.assets && emp.assets.length > 0 ? emp.assets.join(", ") : "NA",
      PresentDays: emp.attendance ? emp.attendance.length : "NA",
      GatePass: emp.gatePassRequests ? emp.gatePassRequests.length : "NA",
      Status: emp.Empstatus || "NA",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
    XLSX.writeFile(workbook, "Employee_Report.xlsx");
  };

  return (
    <div className="p-2 bg-gray-50 rounded shadow-md max-w-6xl mx-auto">
      <div className="bg-gray-300 text text-center mx-4 md:mx-10 py-4 my-6 rounded-md shadow-md shadow-gray-400">
        <h2 className="text-xl font-semibold">Employees Report</h2>
      </div>

      <div className="flex justify-end mr-10 mb-4">
        <button
          onClick={handleExport}
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
        >
          EXPORT
        </button>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto rounded-lg shadow-lg mx-4 md:mx-6 mb-8 border border-gray-200">
        <table className="min-w-[1100px] bg-white text-gray-800 text-sm">
          {/* Table Head */}
          <thead className="sticky top-0 bg-gray-100 text-gray-700 uppercase text-sm tracking-wider z-10">
            <tr>
              {[
                "Name",
                "Location",
                "Department",
                "Designation",
                "Salary",
                "Assets",
                "Present Days",
                "Gate Pass",
                "Status",
              ].map((header) => (
                <th key={header} className="text-left px-6 py-4 font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr
                  key={emp._id}
                  className={`hover:bg-indigo-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 font-medium">{emp.fname || "NA"}</td>

                  <td
                    className="px-6 py-3 text-indigo-600 hover:underline cursor-pointer whitespace-nowrap"
                    onClick={() => handleLocationClick(emp.location)}
                  >
                    {emp.location || "NA"}
                  </td>

                  <td className="px-6 py-3 capitalize whitespace-nowrap">
                    {emp.department || "NA"}
                  </td>

                  <td className="px-6 py-3 capitalize whitespace-nowrap max-w-[200px] truncate" title={emp.designation}>
                    {emp.designation || "NA"}
                  </td>

                  <td className="px-6 py-3 whitespace-nowrap">{emp.salary || "NA"}</td>

                  <td className="px-6 py-3 max-w-[250px]">
                    <div className="flex flex-wrap gap-2">
                      {emp.assets?.length > 0 ? (
                        emp.assets.map((asset, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                          >
                            {asset}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    {emp.attendance?.length || 0}
                  </td>

                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    {emp.gatePassRequests?.length || 0}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${
                        emp.Empstatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {emp.Empstatus || "NA"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white p-4 rounded-lg w-[90%] max-w-3xl shadow-xl animate-scaleIn">
            <h3 className="text-lg font-semibold mb-2">
              Location: {mapData.place}
            </h3>
            <div
              ref={mapContainer}
              className="w-full h-96 rounded-lg overflow-hidden shadow-inner"
            />
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease forwards;
        }
      `}</style>

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={employees?.length === 10}
      />
    </div>
  );
};

export default EmployeesReports;
