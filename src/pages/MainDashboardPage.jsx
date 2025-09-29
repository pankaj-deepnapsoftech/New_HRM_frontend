import React from "react";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useSelector } from "react-redux";
import { useGetAllEmpDataQuery } from "@/service/EmpData.services";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const MainDashboardPage = () => {
  try {
  const userName = useSelector((state) => state.Auth.username);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { data, isLoading, error } = useGetAllEmpDataQuery({ page: 1, limit: 100 });
  
  // Mock data for testing if API fails
  const mockEmployees = [
    { department: 'IT', name: 'John Doe' },
    { department: 'HR', name: 'Jane Smith' },
    { department: 'Finance', name: 'Bob Johnson' },
    { department: 'IT', name: 'Alice Brown' },
    { department: 'Marketing', name: 'Charlie Wilson' },
    { department: 'HR', name: 'Diana Lee' },
  ];
  
  const employees = data?.data || (error ? mockEmployees : []);

  console.log('Dashboard Debug:', { data, isLoading, error, employees });

  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(departmentCounts);
  const counts = Object.values(departmentCounts);

  console.log('Department Data:', { departmentCounts, labels, counts });


  // Donut uses a single gradient fill across slices (see backgroundColor function below)

  // Simple dataPie without complex gradients to avoid errors
  const dataPie = {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [
      {
        label: 'Departments',
        data: counts.length > 0 ? counts : [1],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(79, 156, 249, 0.8)',
          'rgba(232, 113, 175, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 69, 19, 0.8)',
          'rgba(75, 0, 130, 0.8)',
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(79, 156, 249, 1)',
          'rgba(232, 113, 175, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(139, 69, 19, 1)',
          'rgba(75, 0, 130, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#0d4b55',
        },
      },
      title: {
        display: true,
        text: 'Department Distribution',
        color: '#0d4b55',
        font: {
          size: 18,
        },
      },
    },
    layout: { padding: 10 },
    elements: { arc: { borderColor: '#ffffff', borderWidth: 2 } },
    cutout: '55%',
  };

  const statsCards = [
    {
      label: "Total Employees",
      value: employees.length,
      iconBg: "bg-blue-200",
      iconColor: "text-red-500",
      icon: "👤",
      change: "+147%",
      changeColor: "text-green-500",
    },
    {
      label: "Departments",
      value: labels.length,
      iconBg: "bg-green-200",
      iconColor: "text-green-500",
      icon: "🏢",
      change: "+53%",
      changeColor: "text-green-500",
    },
    {
      label: "IT Department",
      value: departmentCounts['IT'] || 0,
      iconBg: "bg-red-200",
      iconColor: "text-black-500",
      icon: "💻",
      change: "-10.7%",
      changeColor: "text-red-500",
    },
    {
      label: "HR Department",
      value: departmentCounts['HR'] || 0,
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-500",
      icon: "👥",
      change: "+29%",
      changeColor: "text-green-500",
    },
  ];

  // Gradients for the 4 metric cards (to match the reference UI)
  const cardGradients = [
    'linear-gradient(135deg, #4f9cf9 0%, #6cc1ff 100%)', // blue
    'linear-gradient(135deg, #34d399 0%, #10b981 100%)', // green
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', // amber
    'linear-gradient(135deg, #f472b6 0%, #ef4444 100%)', // pink-red
  ];

  return (
    <main className="flex-1 font-sans p-4 md:p-8" style={{ backgroundColor: '#f0fbfc' }}>
      <section className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-center text-white rounded-3xl px-10 py-8 mb-10 shadow-xl transition hover:shadow-2xl" style={{ backgroundColor: 'rgb(17, 85, 96)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle at center, #ffffff, transparent 60%)' }} />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle at center, #0d4b55, transparent 60%)' }} />
        <div>
          <p className="text-sm mb-2 text-white/90">{today}</p>
          <h1 className="text-4xl font-extrabold mb-1 text-white">
            Welcome back, <br />{userName.charAt(0).toUpperCase() + userName.slice(1)} <span className="align-middle"></span>
          </h1>
          {/* <p className="text-sm text-white/90">
              Here's what's happening today in your portal.
          </p> */}
        </div>
        <img
          src="/Hand coding-amico.png"
          alt="Welcome Illustration"
          className="w-[150px] md:w-[200px] mt-6 sm:mt-0"
        />
      </section>

        {/* Error Display */}
        {error && (
          <div className="w-full p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error loading employee data:</p>
            <p className="text-sm">{error?.data?.message || error?.message || 'Unknown error'}</p>
          </div>
        )}

      {/* Cards and Chart in Single Row */}
      <div className="w-full flex flex-col lg:flex-row gap-4 pt-4 md:pt-10 md:pb-6 px-3 md:px-6" style={{ backgroundColor: '#e6f7f9' }}>
        {/* Cards Container */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {statsCards.map((card, i) => (
            <div
              key={i}
              className="rounded-md shadow w-full sm:w-72 md:w-60 h-[120px] p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ background: cardGradients[i % cardGradients.length], color: '#ffffff' }}
            >
              <div className="flex justify-between items-start">
                <div className="text-[12px] leading-4 opacity-90">{card.label}</div>
                <div className="text-lg font-bold">{card.value}</div>
              </div>
              <div className="flex items-center text-[12px] opacity-95">
                <span className="mr-2 text-base leading-none">{card.icon}</span>
                <span>{card.label}</span>
                <span className="ml-auto">{card.change?.replace('+', '') || '301'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart Container */}
          <div className="w-full lg:w-[350px] mt-6 lg:mt-0 lg:ml-auto">
          <div className="flex justify-center p-4 rounded-sm shadow-md" style={{ backgroundColor: '#ffffff', borderTop: '4px solid #0d4b55' }}>
            <div className="w-full max-w-xs md:max-w-sm">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-48 w-48 mx-auto rounded-full" style={{ backgroundColor: '#e6f7f9' }} />
                  <div className="h-3 w-3/4 mx-auto mt-4 rounded" style={{ backgroundColor: '#e6f7f9' }} />
                </div>
                ) : labels.length > 0 ? (
                  <Doughnut data={dataPie} options={options} />
              ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    <p>No department data available</p>
                  </div>
              )}
            </div>
          </div>
          </div>
      </div>
    </main>
  );
  } catch (error) {
    console.error('Dashboard Error:', error);
    return (
      <div className="flex-1 font-sans p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: '#f0fbfc' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600">Something went wrong. Please refresh the page.</p>
          <p className="text-sm text-gray-500 mt-2">Error: {error.message}</p>
        </div>
      </div>
    );
  }
};

export default MainDashboardPage;

