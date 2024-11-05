import React from 'react';
import { Link } from 'react-router-dom'; // For navigation (React Router v6+)

function ChooseLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">Choose Your Login</h2>
        
        {/* Dealer Login Button */}
        <div className='flex flex-row justify-between gap-4'>
        <Link
          to="/login-dealer"
          className="w-full h-20 p-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Login as Dealer
        </Link>

        {/* Fournisseur Login Button */}
        <Link
          to="/login-fournisseur"
          className="w-full h-20 p-3 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
        >
          Login as Fournisseur
        </Link>
        </div>
      </div>
    </div>
  );
}

export default ChooseLogin;