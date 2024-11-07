import React, { useEffect, useState } from 'react';
import DealerSideNav from './DealerSideNav'; // Assume you already have this component
import { FaUsers, FaCoins, FaHistory } from 'react-icons/fa';
import { Line } from 'react-chartjs-2'; // For graphs
import 'chart.js/auto';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";

const DealerHome = () => {
  // State hooks
  const [newMonths, setNewMonths] = useState([]);
  const [dealers, setDealers] = useState({});
  const [transaction, setTransaction] = useState(0);
  const [coins, setCoins] = useState(0);
  const [users, setUsers] = useState(0);
  const [hist, setHist] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDealerInfo, setUpdatedDealerInfo] = useState({
    name: '',
    lastName: '',
    email: '',
    img: '',
    phoneNumber:''
  });
  const [chartData, setChartData] = useState({
    labels: newMonths,
    datasets: [
      {
        label: 'Transactions Over Time',
        data: [], // This will hold your dynamic data
        fill: false,
        borderColor: '#4f46e5',
        tension: 0.1,
      },
    ],
  });
  const id = localStorage.getItem('id');
  // Fetch dealer data and related information
  useEffect(() => {
    axios.get('http://localhost:5000/api/dealers/'+id)
      .then(r => {
        setDealers(r.data);
        setUpdatedDealerInfo({
          name: r.data.name,
          lastName: r.data.lastName,
          email: r.data.email,
          img: r.data.img,
          phoneNumber:r.data.phoneNumber
        });
      })
      .catch(err => console.log(err));

    axios.get('http://localhost:5000/api/history/fournisseur')
      .then(r => { setHist(r.data[r.data.length - 1]); })
      .catch(err => console.log(err));

    axios.get('http://localhost:5000/api/users/getAll')
      .then(r => setUsers(r.data.users.filter(e=>e.dealer_id+""===id).length))
      .catch(err => console.log(err));

    axios.get('http://localhost:5000/api/history')
      .then(r => setTransaction(r.data.filter(e=>''+e.dealer_id===id && e.fournisseur_id===null).length))
      .catch(err => console.log(err));

    axios.get('http://localhost:5000/api/allFournisseur')
      .then(r => {
        let s = 0;
        r?.data?.users?.forEach(e => {
          s += e.coins;
        });
        setCoins(s);
      })
      .catch(err => console.log(err));

    // Fetch transactions data for the graph
    const fetchTransactionData = async () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];

      let t = [];
      let m = [];
      try {
        const response = await axios.get('http://localhost:5000/api/history/transaction');
        response.data.forEach(e => {
          t.push(e.totalTransactions);
          m.push(months[e.month - 1]);
        });
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }

      setChartData(prevChartData => ({
        ...prevChartData,
        labels: m,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: t, // Update chart with dynamic data
          },
        ],
      }));
    };

    fetchTransactionData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDealerInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/updateDealer/${id}`, updatedDealerInfo)
      .then(response => {
        setIsEditing(false);
        setDealers((prev) => ({
          ...prev,
          ...updatedDealerInfo
        }));
      })
      .catch(err => {
        console.error('Error saving dealer info:', err);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <DealerSideNav />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>

        {/* DealerHome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaCoins className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Coins</p>
              <p className="text-xl font-semibold">{dealers.coins || 0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-purple-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-semibold">{users}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaHistory className="text-red-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{transaction}</p>
            </div>
          </div>
        </div>

        {/* Graph and Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Transactions Over Time (Graph) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Transactions Over Time</h2>
            <Line data={chartData} />
          </div>

          {/* Dealer Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <FaRegEdit className="mr-2" />
              Edit Info
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Dealer Information</h2>

            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={updatedDealerInfo.name}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={updatedDealerInfo.lastName}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedDealerInfo.email}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="img"
                      value={updatedDealerInfo.img}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <input
                      type="number"
                      name="phoneNumber"
                      value={updatedDealerInfo.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center mb-6">
                  <img
                    className="w-24 h-24 border-4 border-gray-200 rounded-full mr-4"
                    src={dealers.img}
                    alt="Dealer"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      <strong>Name: </strong>{dealers.name}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong>Last Name: </strong>{dealers.lastName}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong>Email: </strong>{dealers.email}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong>Phone: </strong>{dealers.phoneNumber}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong>Fee: </strong>{dealers.fee}%
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerHome;
