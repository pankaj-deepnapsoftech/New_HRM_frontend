import React from "react";
import Select from "react-select";
import { useFormik } from "formik";
import EmpLeaveSchema from "@/Validation/EmpLeaveBalance/EmpLeaveSchema";
import {
  useGetAllEmpDataQuery,
  useUpdateEmpDataMutation,
} from "@/service/EmpData.services";

const EmpLeaveBalance = () => {
  const { data: empResponse = {}, isLoading } = useGetAllEmpDataQuery();
  const employees = empResponse.data || [];

  const [updateEmpData] = useUpdateEmpDataMutation();

  const leaveTypes = [
    { value: "full", label: "Full-Day" },
    { value: "half", label: "Half-Day" },
  ];

  const actions = [
    { value: "increase", label: "Increase" },
    { value: "decrease", label: "Decrease" },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#6366F1" : "#E5E7EB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(99,102,241,0.3)" : "none",
      padding: "2px 4px",
      fontSize: "0.95rem",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "white",
      "&:hover": { borderColor: "#6366F1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#A5B4FC"
        : state.isFocused
        ? "#E0E7FF"
        : "white",
      color: "black",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      marginTop: "4px",
      zIndex: 20,
    }),
    singleValue: (base) => ({ ...base, color: "#111827" }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const formik = useFormik({
    initialValues: {
      employee: null,
      leaveType: null,
      action: null,
      days: "",
    },
    validationSchema: EmpLeaveSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const empId = values.employee.value;
        const leaveField =
          values.leaveType.value === "full"
            ? "fullDayLeavesThisMonth"
            : "halfDayLeavesThisMonth";
        const change = parseFloat(values.days);
        const isIncrement = values.action.value === "increase" ? 1 : -1;

        const selectedEmp = employees.find((e) => e._id === empId);
        const current = selectedEmp?.[leaveField] || 0;
        const newCount = Math.max(current + isIncrement * change, 0);

        await updateEmpData({
          id: empId,
          [leaveField]: newCount,
        }).unwrap();

        alert("✅ Leave balance updated successfully!");
        resetForm();
      } catch (err) {
        console.error("Update failed:", err);
        alert("❌ Something went wrong, check console.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-20 text-lg text-gray-600 font-medium animate-pulse">
        Loading employee list...
      </div>
    );

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.fname || "Unnamed",
  }));

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-xl -mt-20 w-full max-w-3xl p-8 md:p-10 transition-all duration-300">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Update Employee Leave Balance
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Employee */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              👤 Employee
            </label>
            <Select
              name="employee"
              options={employeeOptions}
              value={formik.values.employee}
              onChange={(value) => formik.setFieldValue("employee", value)}
              onBlur={() => formik.setFieldTouched("employee", true)}
              styles={customSelectStyles}
              placeholder="Select an Employee"
            />
            {formik.touched.employee && formik.errors.employee && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.employee}
              </p>
            )}
          </div>

          {/* Leave Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              🏷️ Leave Type
            </label>
            <Select
              name="leaveType"
              options={leaveTypes}
              value={formik.values.leaveType}
              onChange={(value) => formik.setFieldValue("leaveType", value)}
              onBlur={() => formik.setFieldTouched("leaveType", true)}
              styles={customSelectStyles}
              placeholder="Full or Half-Day"
            />
            {formik.touched.leaveType && formik.errors.leaveType && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.leaveType}
              </p>
            )}
          </div>

          {/* Action */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              ➕➖ Action
            </label>
            <Select
              name="action"
              options={actions}
              value={formik.values.action}
              onChange={(value) => formik.setFieldValue("action", value)}
              onBlur={() => formik.setFieldTouched("action", true)}
              styles={customSelectStyles}
              placeholder="Increase or Decrease"
            />
            {formik.touched.action && formik.errors.action && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.action}
              </p>
            )}
          </div>

          {/* Days Input */}
          <div>
            <label
              htmlFor="days"
              className="block font-medium text-gray-700 mb-2"
            >
              📆 Number of Days
            </label>
            <input
              type="number"
              id="days"
              name="days"
              min="0"
              step="0.5"
              value={formik.values.days}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg p-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g., 1 or 0.5"
            />
            {formik.touched.days && formik.errors.days && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.days}</p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formik.isSubmitting ? "Updating..." : "Update Leave Balance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpLeaveBalance;
