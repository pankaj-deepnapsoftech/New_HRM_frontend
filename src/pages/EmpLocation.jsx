import LocationModal from '@/Drawer/Employees/LocationModal';
import React from 'react'
const employees = [
  {
    name: 'Nitish Prajapati',
    email: 'nitishprajapati987@gmail.com',
    location: 'Location',
    department: 'IT',
    designation: 'Developer',
    empCode: 'NIT51130226',
  },
  {
    name: 'abhi pjpt',
    email: 'abhi123@gmail.com',
    location: 'Location',
    department: 'IT',
    designation: 'Manager',
    empCode: 'ABH74130227',
  },
  {
    name: 'komal singh',
    email: 'komal@gmail.com',
    location: 'Location',
    department: 'sale',
    designation: 'manager',
    empCode: 'KOM98740307',
  },
  {
    name: 'Deepak Sharma',
    email: 'dsharma1010@gmail.com',
    location: 'Location',
    department: 'Sales',
    designation: 'Boss',
    empCode: 'DEE23890101',
  },
];
const EmpLocation = () => {
 
  return (
    <div  className="p-4 bg-gray-50 rounded shadow-md max-w-5xl mx-auto mt-10">
        
   
         <div className="bg-gray-300 text-gray-600 text-center py-4 mx-2 md:mx-10 mb-10 rounded-xl shadow-md shadow-gray-400">
           <h2 className="text-xl font-bold">Employee Location</h2>
         </div>
         <div className="overflow-x-scroll scrollbar-visible rounded-t-xl shadow-md mx-2 md:mx-10 mb-8">
         <table className=" w-3xl md:min-w-full shadow-lg border border-gray-200 text-sm">
           <thead className="bg-gray-200 text-gray-700">
             <tr>
               <th className="p-4  text-left">Full Name</th>
               <th className="p-2 text-left">Email</th>
               <th className="p-2 text-left">Location</th>
               <th className="p-2 text-left">Department</th>
               <th className="p-2 text-left">Designation</th>
               <th className="p-2 text-left">Emp-Code</th>
             </tr>
           </thead>
           <tbody>
             {employees.map((emp, idx) => (
               
               <tr key={idx} className={`border-t border-gray-200 ${idx%2==0? "bg-white":'bg-gray-100'}`}>
                 <td className="p-2 px-3">{emp.name}</td>
                 <td className="p-2 px-3">{emp.email}</td>
                 <td className="p-2 px-3 text-blue-700 cursor-pointer hover:underline" >View<br />Location</td>
                 <td className="p-2 px-3">{emp.department}</td>
                 <td className="p-2 px-3">{emp.designation}</td>
                 <td className="p-2 px-3">{emp.empCode}</td>
                 
               </tr>
             ))}
           </tbody>
         </table>
         </div>
       </div>
  )
}
export default EmpLocation