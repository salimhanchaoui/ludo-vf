import React from 'react';
import { FaTachometerAlt, FaUsers, FaHistory } from 'react-icons/fa'; // Importing icons from react-icons
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from react-router-dom
import { LiaRestroomSolid } from "react-icons/lia";

function DealerSideNav() {
  const location = useLocation();
  
  const getLinkClassName = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center justify-center hover:bg-gray-200 p-2 rounded w-full text-gray-800 ${isActive ? 'bg-gray-300 border-l-8 border-gray-600' : ''}`;
  };

  return (
    <div className="h-screen w-[350px] bg-white text-gray-800 flex flex-col shadow-md">
      <div className="p-4 text-center text-2xl font-semibold border-b border-gray-300">
        Admin Dashboard
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-4">
            <Link 
              to="/Admin-dashboard" 
              className={getLinkClassName('/Admin-dashboard')}
            >
              <FaTachometerAlt className="mr-3 text-2xl" />
              <span className="text-lg">Dashboard</span>
            </Link>
          </li>
         
          
         
          <li className="mb-4">
            <Link 
              to="/fournisseurs" 
              className={getLinkClassName('/fournisseurs')}
            >
              <FaUsers className="mr-3 text-2xl" />
              <span className="text-lg">Fournisseurs</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/dealers" 
              className={getLinkClassName('/dealers')}
            >
              <FaUsers className="mr-3 text-2xl" />
              <span className="text-lg">Dealers</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/users" 
              className={getLinkClassName('/users')}
            >
              <FaUsers className="mr-3 text-2xl" />
              <span className="text-lg">Users</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/rooms" 
              className={getLinkClassName('/rooms')}
            >
              <FaUsers className="mr-3 text-2xl" />
              <span className="text-lg">Rooms</span>
            </Link>
          </li>
         
          <li className="mb-4">
            <Link 
              to="/transaction-history" 
              className={getLinkClassName('/transaction-history')}
            >
              <FaHistory className="mr-3 text-2xl" />
              <span className="text-lg">Transaction History</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default DealerSideNav;
