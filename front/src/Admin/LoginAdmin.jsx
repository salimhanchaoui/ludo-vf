import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { ToastContainer, toast } from 'react-toastify';

function LoginAdmin() {
    const {login,isAuthenticated}=useAuth()
    const navigate=useNavigate()

    const [created,setCreated]=useState({})
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(created)
        setCreated(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('http://localhost:5000/api/adminLogin',created).then(r=>{
            login()
            navigate('/admin-dashboard')
        }).catch(err=>toast.error('wrong credentials !', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            
            theme: "light",
            // transition: Bounce,
            }))
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Admin Login</h2>
        
        <form>
          {/* Email or Phone Input */}
          <div className="mb-4">
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="email"
              placeholder="Enter Email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e)=>handleChange(e)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e)=>handleChange(e)}
            />
          </div>

          {/* Login Button */}
          <button
        
            className="w-full py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e)=>handleSubmit(e)}
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm">
            Forgot your password?
          </a>
        </div>
      </div>
      <div>
      <ToastContainer />
      </div>
    </div>
  );
}

export default LoginAdmin;