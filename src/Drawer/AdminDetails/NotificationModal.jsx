import React from 'react'
const notifications=[
{label:"Profile Vistors" , count:"27" ,color:"bg-gray-300 text-gray-700"},
{label:"Block Users",count:"13", color:"bg-red-300 text-red-700"},
{label:"Favourite", count:"20", color:"bg-green-300 text-green-700"},
{label:"Matches", count:"4",color:"bg-blue-300 text-blue-700"}
]
const NotificationModal = () => {
  return (
     <div className="absolute right-2 top-12 w-64 bg-white text-gray-600 rounded shadow-lg z-50">
          <div className="absolute top-[-10px] right-24 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-indigo-400"></div>

      <div className="bg-indigo-500 text-white px-4 py-2 rounded-t flex justify-between items-center">
        <span className="font-semibold">Notifications</span>
        <span className="text-sm">135 new</span>
      </div>  
      <ul className="p-4 space-y-3">
        {notifications.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-sm">
            <span>{item.label}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${item.color}`}>
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationModal