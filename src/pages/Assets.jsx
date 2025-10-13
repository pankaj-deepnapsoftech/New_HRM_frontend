import React, { useState } from "react";
import Select from "react-select";
import {
  useGetAllEmpDataQuery,
  useAddAssetMutation, // ✅ Use the correct hook
  useRemoveAssetMutation,
} from "@/service/EmpData.services";

// Available assets to pick from
const assetOptions = ["Laptop", "Bike", "Mobile", "Headset"];
const formattedAssetOptions = assetOptions.map((asset) => ({
  value: asset,
  label: asset,
}));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.375rem",
    borderColor: state.isFocused ? "#8B5CF6" : "#D1D5DB",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(139, 92, 246, 0.5)" : "none",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#8B5CF6" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#E9D5FF"
      : state.isFocused
      ? "#F3E8FF"
      : "white",
    color: "black",
    cursor: "pointer",
  }),
};

const AssignAssets = () => {
  const { data, isLoading, refetch } = useGetAllEmpDataQuery();
  const [addAsset] = useAddAssetMutation();
  const [removeAsset] = useRemoveAssetMutation();

  const [selectedAssets, setSelectedAssets] = useState({});

  const handleAssetChange = (empId, selected) => {
    setSelectedAssets((prev) => ({
      ...prev,
      [empId]: selected ? selected.value : "",
    }));
  };

  const handleAddAsset = async (emp) => {
    const selected = selectedAssets[emp._id];
    if (!selected) return;

    try {
      await addAsset({ id: emp._id, asset: selected }).unwrap();
      setSelectedAssets((prev) => ({ ...prev, [emp._id]: "" }));
      refetch();
    } catch (err) {
      console.error("Failed to add asset:", err);
    }
  };

  const handleRemoveAsset = async (emp, asset) => {
    try {
      await removeAsset({ id: emp._id, asset }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to remove asset:", err);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading employees…</p>;

  const employees = data?.data || [];

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md max-w-4xl mx-auto mt-10">
      <div className="bg-gray-300 text-gray-600 text-xl font-semibold text-center rounded-md py-3 shadow-md shadow-gray-400">
        Assets
      </div>
      <div className="overflow-x-auto scrollbar-visible mt-10 rounded-t-md shadow-md">
        <table className="w-2xl md:w-full border-gray-500 text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase">
            <tr>
              <th className="p-2 py-3 text-left">Name</th>
              <th className="p-2 py-3 text-left">Department</th>
              <th className="p-2 py-3 text-left">Designation</th>
              <th className="p-2 py-3 text-left">Added Assets</th>
              <th className="p-2 py-3 text-left">Assets</th>
              <th className="p-2 py-3 text-left">Add</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="p-2">{emp.fname || "N/A"}</td>
                <td className="p-2">{emp.department || "N/A"}</td>
                <td className="p-2">{emp.designation || "N/A"}</td>
                <td className="p-2 space-x-2">
                  {(emp.assets || []).map((asset, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-blue-700 bg-blue-200 px-2 py-1 rounded-full text-xs"
                    >
                      {asset}
                      <button
                        onClick={() => handleRemoveAsset(emp, asset)}
                        className="ml-1 text-red-600 hover:text-red-800"
                        aria-label={`Remove ${asset}`}
                        title={`Remove ${asset}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </td>
                <td className="p-3 ">
                  <Select
                    options={formattedAssetOptions.filter((opt) => !(emp.assets || []).includes(opt.value))}
                    value={
                      selectedAssets[emp._id]
                        ? {
                            value: selectedAssets[emp._id],
                            label: selectedAssets[emp._id],
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleAssetChange(emp._id, selected)
                    }
                    placeholder="Assign or add assets"
                    styles={{
                      ...customStyles,
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="absolute"
                    isClearable
                    isDisabled={formattedAssetOptions.filter((opt) => !(emp.assets || []).includes(opt.value)).length === 0}
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleAddAsset(emp)}
                    className="bg-gradient-to-br from-green-400 to-green-500 text-white px-4 py-1 rounded hover:bg-gradient-to-tl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      formattedAssetOptions.filter((opt) => !(emp.assets || []).includes(opt.value)).length === 0 ||
                      !selectedAssets[emp._id]
                    }
                  >
                    ADD        
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

export default AssignAssets;
