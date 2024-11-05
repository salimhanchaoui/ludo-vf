import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

function DealerSideNav() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getLinkClassName = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center justify-center hover:bg-gray-200 p-2 rounded w-full text-gray-800 ${isActive ? 'bg-gray-300 border-l-8 border-gray-600' : ''}`;
    };

    return (
        <>
            {/* Mobile Toggle Button (Visible only on mobile) */}
            <button
                onClick={toggleSidebar}
                className="md:hidden p-4 text-gray-800 focus:outline-none fixed top-0 left-0 z-50 "
            >
                {isSidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen bg-white text-gray-800 shadow-md transition-transform transform  ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:relative md:w-[350px] z-40 md:z-auto`}
            >
                <div className="p-4 text-center text-2xl font-semibold border-b border-gray-300 mt-[20px]" >
                    Fournisseur Dashboard
                </div>
                <nav className="flex-1 p-4">
                    <ul>
                        <li className="mb-4">
                            <Link
                                to="/Dealer-dashboard"
                                className={getLinkClassName('/')}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile link click
                            >
                                <FaTachometerAlt className="mr-3 text-2xl" />
                                <span className="text-lg">Dashboard</span>
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/users-list"
                                className={getLinkClassName('/users-list')}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile link click
                            >
                                <FaUsers className="mr-3 text-2xl" />
                                <span className="text-lg">Users</span>
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/transaction-history-dealer"
                                className={getLinkClassName('/transaction-history')}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile link click
                            >
                                <FaHistory className="mr-3 text-2xl" />
                                <span className="text-lg">Transaction History</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Overlay for mobile view */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}

export default DealerSideNav;