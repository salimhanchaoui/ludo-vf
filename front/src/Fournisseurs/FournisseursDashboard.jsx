import React, { useEffect, useState } from 'react';
import FournisseursSideNav from './FournisseursSideNav'; // Assuming you have this component already
import { FaUsers, FaCoins, FaHistory } from 'react-icons/fa';
import { Line } from 'react-chartjs-2'; // For graphs
import 'chart.js/auto';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";

function FournisseursDashboard() {
  const [newMonths, setNewMonths] = useState([]);
  const [fournisseurInfo, setFournisseurInfo] = useState({});
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [coins, setCoins] = useState(0);
  const [dealersCount, setDealersCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    img: '',
    phoneNumber: ''
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

  useEffect(() => {
    // Retrieve the fournisseurId from local storage
    const fournisseurId = localStorage.getItem('id');
    
    if (!fournisseurId) {
      console.error('No fournisseurId found in local storage');
      return;
    }

    // Fetch fournisseur details
    axios.get(`http://localhost:5000/api/getOneFournisseur/${fournisseurId}`)
      .then(response => {
        const data = response.data;
        setFournisseurInfo(data);
        setCoins(data.coins); // Set coins from fournisseur info
        setFormData({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          img: data.img,
          phoneNumber: data.phoneNumber
        });
      })
      .catch(error => console.error('Error fetching fournisseur info:', error.response ? error.response.data : error.message));

    // Fetch dealers count
    axios.get(`http://localhost:5000/api/getDealersRelatedToFournisseur/${fournisseurId}`)
      .then(response => {
        setDealersCount(response.data.length);
      })
      .catch(error => console.error('Error fetching dealers count:', error.response ? error.response.data : error.message));

    // Fetch transactions count
    axios.get(`http://localhost:5000/api/transaction-history/${fournisseurId}`)
      .then(response => {
        if (response.data.history && response.data.history.length > 0) {
          setTransactionsCount(response.data.history.length);
        } else {
          console.log('No transactions found for this fournisseur');
          setTransactionsCount(0);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log('No transactions found for this fournisseur:', fournisseurId);
          setTransactionsCount(0);
        } else {
          console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
        }
      });

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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Send the updated fournisseur data to the server
    axios.put(`http://localhost:5000/api/updateFournisseur/${fournisseurInfo.id}`, formData)
      .then(response => {
        setIsEditing(false); // Close edit mode after saving
        setFournisseurInfo((prev) => ({
          ...prev,
          ...formData // Update the local state with the new data
        }));
      })
      .catch(err => {
        console.error('Error saving fournisseur info:', err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <FournisseursSideNav />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold mt-[20px]">Fournisseur Dashboard</h1>
        </div>

        {/* Fournisseur Dashboard Cards */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
          <div className="bg-white w-full lg:w-60 p-4 rounded-lg shadow-md flex items-center">
            <FaCoins className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Coins</p>
              <p className="text-xl font-semibold">{coins || 0}</p>
            </div>
          </div>
          <div className="bg-white w-full lg:w-60 p-4 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-purple-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Dealers</p>
              <p className="text-xl font-semibold">{dealersCount || 0}</p>
            </div>
          </div>
          <div className="bg-white w-full lg:w-60 p-4 rounded-lg shadow-md flex items-center">
            <FaHistory className="text-red-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{transactionsCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Graph and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions Over Time (Graph) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Transactions Over Time</h2>
            <Line data={chartData} />
          </div>

          {/* Fournisseur Info */}
          <div className="bg-white p-8 rounded-lg w-full shadow-lg">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <FaRegEdit className="mr-2" />
              Edit Info
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fournisseur Information</h2>

            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 space-y-4">
                {['name', 'lastName', 'email', 'phoneNumber', 'coins'].map((field, index) => (
                  <div key={index} className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-md">
                    <span className="text-sm font-semibold text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    <span className="text-sm text-gray-900">{fournisseurInfo[field] || 'N/A'}</span>
                  </div>
                ))}
              </div>

              {/* Image Section */}
              <div className="flex-shrink-0 flex justify-center">
                <img
                  src={fournisseurInfo.img || ''}
                  alt="Fournisseur"
                  className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Edit Fournisseur Info</h2>
              {['name', 'lastName', 'email', 'phoneNumber'].map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FournisseursDashboard;
