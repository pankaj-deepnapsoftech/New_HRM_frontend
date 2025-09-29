import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useSelector } from "react-redux";
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

const MainDashboardPage = () => {
  try {
    const userName = useSelector((state) => state.Auth.username);

    const today = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = useGetAllEmpDataQuery({
      page: 1,
      limit: 100,
    });

    const mockEmployees = [
      {
        department: "IT",
        name: "John Doe",
        designation: "Developer",
        salary: 60000,
        location: "New York",
      },
      {
        department: "HR",
        name: "Jane Smith",
        designation: "Manager",
        salary: 50000,
        location: "London",
      },
      {
        department: "Finance",
        name: "Bob Johnson",
        designation: "Accountant",
        salary: 55000,
        location: "New York",
      },
      {
        department: "IT",
        name: "Alice Brown",
        designation: "Developer",
        salary: 62000,
        location: "London",
      },
      {
        department: "Marketing",
        name: "Charlie Wilson",
        designation: "Executive",
        salary: 48000,
        location: "Berlin",
      },
      {
        department: "HR",
        name: "Diana Lee",
        designation: "Recruiter",
        salary: 45000,
        location: "Berlin",
      },
    ];

    const employees = data?.data || (error ? mockEmployees : []);

    // Department Distribution
    const departmentCounts = employees.reduce((acc, emp) => {
      const dept = emp.department || "Unknown";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(departmentCounts);
    const counts = Object.values(departmentCounts);

    // Designation Distribution
    const designationCounts = employees.reduce((acc, emp) => {
      const desig = emp.designation || "Unknown";
      acc[desig] = (acc[desig] || 0) + 1;
      return acc;
    }, {});
    const designationLabels = Object.keys(designationCounts);
    const designationValues = Object.values(designationCounts);

    // Location Distribution
    const locationCounts = employees.reduce((acc, emp) => {
      const loc = emp.location || "NA";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
    const locationLabels = Object.keys(locationCounts);
    const locationValues = Object.values(locationCounts);

    // Salary Distribution
    const salaryValues = employees.map((emp) => emp.salary || 0);
    const salaryBins = [0, 20000, 40000, 60000, 80000, 100000, 120000];
    const salaryCounts = salaryBins.map((bin, i) => {
      if (i === salaryBins.length - 1) return 0;
      return salaryValues.filter((val) => val >= bin && val < salaryBins[i + 1])
        .length;
    });

    // Colors
    const chartColors = ["#2563eb", "#3b82f6", "#1e40af", "#60a5fa", "#1e3a8a"];
    const cardColors = ["#3b82f6", "#6366f1", "#60a5fa", "#818cf8"];

    // Chart Data
    const dataPie = {
      labels: labels.length > 0 ? labels : ["No Data"],
      datasets: [
        {
          label: "Departments",
          data: counts.length > 0 ? counts : [1],
          backgroundColor: chartColors.slice(0, labels.length),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#1e3a8a",
            font: { size: 13, weight: 500 },
            boxWidth: 18,
            padding: 15,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem) {
              const dataset = tooltipItem.dataset;
              const total = dataset.data.reduce((sum, val) => sum + val, 0);
              const value = dataset.data[tooltipItem.dataIndex];
              const percentage = ((value / total) * 100).toFixed(1);
              return `${tooltipItem.label}: ${value} (${percentage}%)`;
            },
          },
        },
        title: {
          display: true,
          text: "Department Distribution",
          color: "#1e3a8a",
          font: { size: 18, weight: 600 },
        },
      },
      layout: { padding: 20 },
      elements: {
        arc: { borderColor: "#ffffff", borderWidth: 2, hoverOffset: 20 },
      },
      cutout: "60%",
      animation: { animateRotate: true, animateScale: true },
    };

    const dataDesignation = {
      labels: designationLabels.length > 0 ? designationLabels : ["No Data"],
      datasets: [
        {
          label: "Employees by Designation",
          data: designationValues.length > 0 ? designationValues : [1],
          backgroundColor: "#6366f1",
        },
      ],
    };

    const optionsDesignation = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Employees by Designation",
          color: "#1e3a8a",
          font: { size: 16, weight: 600 },
        },
      },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    };

    const dataLocation = {
      labels: locationLabels.length > 0 ? locationLabels : ["No Data"],
      datasets: [
        {
          label: "Employees by Location",
          data: locationValues.length > 0 ? locationValues : [1],
          backgroundColor: [
            "#2563eb",
            "#3b82f6",
            "#1e40af",
            "#60a5fa",
            "#1e3a8a",
            "#818cf8",
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };

    const optionsLocation = {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Employees by Location",
          color: "#1e3a8a",
          font: { size: 16, weight: 600 },
        },
      },
      cutout: "50%",
    };

    const dataSalary = {
      labels: salaryBins
        .slice(0, -1)
        .map((b, i) => `${b}-${salaryBins[i + 1]}`),
      datasets: [
        {
          label: "Salary Distribution",
          data: salaryCounts,
          backgroundColor: "#3b82f6",
        },
      ],
    };

    const optionsSalary = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Salary Distribution",
          color: "#1e3a8a",
          font: { size: 16, weight: 600 },
        },
      },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    };

    const statsCards = [
      {
        label: "Total Employees",
        value: employees.length,
        icon: "👤",
        change: "+147%",
      },
      {
        label: "Departments",
        value: labels.length,
        icon: "🏢",
        change: "+53%",
      },
      {
        label: "IT Department",
        value: departmentCounts["IT"] || 0,
        icon: "💻",
        change: "-10.7%",
      },
      {
        label: "HR Department",
        value: departmentCounts["HR"] || 0,
        icon: "👥",
        change: "+29%",
      },
    ];

    return (
      <main className="flex-1 font-sans p-4 md:p-8 bg-[#f0f9ff]">
        {/* Header */}
        <section className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-center rounded-2xl px-8 py-6 mb-10 shadow-lg bg-gradient-to-r from-sky-100 to-indigo-100 text-gray-800 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-300">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-20 bg-gradient-to-br from-white/50 to-transparent animate-pulse-slow"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full opacity-10 bg-gradient-to-tr from-indigo-200 to-transparent animate-pulse-slow"></div>

          <div className="relative z-0">
            <p className="text-sm mb-2 text-gray-600">{today}</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-snug">
              Welcome back, <br />
              <span className="text-indigo-700">
                {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </span>
            </h1>
            <p className="mt-2 text-gray-500 text-sm md:text-base">
              Here's what's happening today in your dashboard.
            </p>
          </div>

          <div className="relative z-0 w-[150px] md:w-[200px] mt-4 sm:mt-0 overflow-hidden">
            <img
              src="/Hand coding-amico.png"
              alt="Welcome Illustration"
              className="w-full h-auto object-contain animate-float"
            />
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="w-full p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error loading employee data:</p>
            <p className="text-sm">
              {error?.data?.message || error?.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Four Cards on Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((card, i) => (
            <div
              key={i}
              className="relative h-36 p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden border-l-4"
              style={{ borderLeftColor: cardColors[i % cardColors.length] }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{
                    backgroundColor: cardColors[i % cardColors.length] + "33",
                  }}
                >
                  <span className="text-xl">{card.icon}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {card.label}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl md:text-3xl font-bold text-gray-800">
                  {card.value}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    card.change?.includes("-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {card.change?.replace("+", "") || "301"}
                </span>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-sky-50 via-indigo-50"></div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Department Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 h-72 flex items-center justify-center">
            <Doughnut data={dataPie} options={optionsPie} />
          </div>

          {/* Chart 2: Employees by Designation */}
          <div className="bg-white rounded-xl shadow-md p-4 h-72 flex items-center justify-center">
            <Bar data={dataDesignation} options={optionsDesignation} />
          </div>

          {/* Chart 3: Employees by Location */}
          <div className="bg-white rounded-xl shadow-md p-4 h-72 flex items-center justify-center">
            <Doughnut data={dataLocation} options={optionsLocation} />
          </div>

          {/* Chart 4: Salary Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 h-72 flex items-center justify-center">
            <Bar data={dataSalary} options={optionsSalary} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Dashboard Error:", error);
    return (
      <div className="flex-1 font-sans p-4 md:p-8 flex items-center justify-center bg-[#f0f9ff]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Dashboard Error
          </h1>
          <p className="text-gray-600">
            Something went wrong. Please refresh the page.
          </p>
          <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
        </div>
      </div>
    );
  }
};

export default MainDashboardPage;
