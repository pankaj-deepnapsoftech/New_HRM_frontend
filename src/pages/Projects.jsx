//projects.jsx

import React, { useState } from "react";
import Select from "react-select";
import {
  useGetAllProjectsQuery,
  useAddProjectMutation,
  useDeleteProjectMutation,
} from "@/service/Projects.Service";
import ProjectViewModal from "@/Drawer/Projects/ProjectViewModal";
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";
import { IoIosClose } from "react-icons/io";
import Pagination from "./Pagination/Pagination";
import { Eye, Trash } from "lucide-react";
import { toast } from "react-toastify";

const Projects = ({ searchQuery }) => {
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useGetAllProjectsQuery({ page });
  const [addProject] = useAddProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const { data: empData } = useGetAllEmpDataQuery();
  const employees = empData?.data || [];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    members: [],
    startDate: "",
    endDate: "",
    description: "",
  });

  const getSelectedOptions = (options, selectedIds) =>
    options.filter((option) => selectedIds.includes(option.value));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      manager: formData.manager,
      members: formData.members,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
    };

    try {
      await addProject(payload).unwrap();
      setFormData({
        name: "",
        manager: "",
        members: [],
        startDate: "",
        endDate: "",
        description: "",
      });
      setShowModal(false);
      refetch(page);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      if (window.confirm("Are you sure you want to delete this project?")) {
        await deleteProject(projectId).unwrap();
        toast.success("Project deleted successfully!");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error?.data?.message || error.message || "Failed to delete project"
      );
    }
  };

  const projects = data?.data?.projectDetails || [];
  const filteredProjects = projects
    .filter((project) => {
      // Filter by date range
      if (!startDate && !endDate) return true;

      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const filterStart = startDate ? new Date(startDate) : null;
      const filterEnd = endDate ? new Date(endDate) : null;

      if (filterStart && projectEnd < filterStart) return false;
      if (filterEnd && projectStart > filterEnd) return false;

      return true;
    })
    .filter((project) => {
      if (!searchQuery) return true;

      const lowerQuery = searchQuery.toLowerCase();

      const nameMatch = project.name?.toLowerCase().includes(lowerQuery);
      const managerMatch = project.manager?.fullName
        ?.toLowerCase()
        .includes(lowerQuery);
      const membersMatch = project.members
        ?.map((m) => m.fullName?.toLowerCase())
        .some((name) => name?.includes(lowerQuery));

      return nameMatch || managerMatch || membersMatch;
    });

  if (isLoading) return <p className="text-center py-10">Loading projects…</p>;

  const managerOptions = employees
    .filter((emp) => emp.designation.toLowerCase() === "manager")
    .map((emp) => ({
      label: emp.fname,
      value: emp._id,
    }));

  const memberOptions = employees
    .filter((emp) => emp.designation.toLowerCase() !== "manager")
    .map((emp) => ({
      label: emp.fname,
      value: emp._id,
    }));

  return (
    <div className="p-6 bg-gray-50 rounded shadow-md max-w-4xl mx-auto mt-10">
      <div className="bg-gray-300 text-center py-4 my-8 rounded-md shadow-md shadow-gray-400">
        <h2 className="text-xl font-[500]">Projects</h2>
      </div>

      {/* Date Range + Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <label className="font-semibold text-md">Select date range:</label>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <label className="font-semibold text-sm text-gray-600">From-</label>
            <input
              type="date"
              className="border border-gray-400 px-3 py-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <label className="font-semibold text-sm text-gray-600">To-</label>
            <input
              type="date"
              className="border border-gray-400 px-3 py-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md w-fit"
        >
          ADD PROJECT DETAILS
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-xl shadow-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500 transition"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <IoIosClose size={32} />
            </button>
            <h3 className="text-lg font-bold mb-4">Add New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Project Name */}
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              {/* Select Manager */}
              <div>
                <label className="block font-medium text-sm mb-1">
                  Select Manager <span className="text-red-500">*</span>
                </label>
                <Select
                  name="manager"
                  options={managerOptions}
                  value={
                    managerOptions.find(
                      (opt) => opt.value === formData.manager
                    ) || null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      manager: selected ? selected.value : "",
                    }))
                  }
                  classNamePrefix="react-select"
                />
              </div>

              {/*  Select Members */}
              <div>
                <label className="block font-medium text-sm mb-1">
                  Select Members <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  name="members"
                  options={memberOptions}
                  value={memberOptions.filter((opt) =>
                    formData.members.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      members: selected ? selected.map((opt) => opt.value) : [],
                    }))
                  }
                  classNamePrefix="react-select"
                />
              </div>

              {/* Dates */}
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Description */}
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />

              {/* Action Buttons */}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Table */}
      <div className="overflow-x-auto scrollbar-visible shadow-lg rounded-t-sm md:rounded-t-lg">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 text-gray-700 text-sm font-[600] uppercase">
            <tr>
              <th className="px-2 py-3 text-left">Project Name</th>
              <th className="px-2 py-3 text-left">Member</th>
              <th className="px-2 py-3 text-left">Manager</th>
              <th className="px-2 py-3 text-left">Start-Date</th>
              <th className="px-2 py-3 text-left">End-Date</th>
              <th className="px-2 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, idx) => (
              <tr
                key={project._id}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="p-3 px-2">{project.name}</td>
                <td className="p-3 px-2">
                  {project.members?.length > 0
                    ? project.members
                        .map((m) => m.fname || "Unknown")
                        .join(", ")
                    : "N/A"}
                </td>
                <td className="p-3 px-2">{project.manager?.fname || "N/A"}</td>
                <td className="p-3 px-2">
                  {new Date(project.startDate).toLocaleDateString()}
                </td>
                <td className="p-3 px-2">
                  {new Date(project.endDate).toLocaleDateString()}
                </td>
                <td className="p-3 px-2 flex items-center">
                  <Eye
                    className="cursor-pointer hover:text-blue-600 mr-4"
                    size={18}
                    onClick={() => {
                      setShowDetailModal(true);
                      setSelectedProject(project);
                    }}
                    title="View Project"
                  />
                  <Trash
                    className="cursor-pointer hover:text-red-600"
                    size={18}
                    onClick={() => handleDelete(project._id)}
                    title="Delete Project"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProjectViewModal
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        project={selectedProject}
      />

      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={filteredProjects.length === 10}
      />
    </div>
  );
};

export default Projects;
