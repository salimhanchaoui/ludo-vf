import React, { useEffect, useState } from 'react';
import DealerSideNav from './DealerSideNav'; // Assume you already have this component
import { FaUsers, FaCoins, FaChartLine, FaHistory } from 'react-icons/fa';
import { Line } from 'react-chartjs-2'; // For graphs
import 'chart.js/auto';
import axios from 'axios'
const DealerHome = () => {
  // Sample data for metrics and chart
  const [newMonths,setNewMonths]=useState([])
  const[dealers,setDealers]=useState(0)
  const[transaction,setTransaction]=useState(0)
  const[coins,setCoins]=useState(0) 
  const[users,setUsers]=useState(0) 
  const[hist,setHist]=useState([])
  var t=[]
  const [chartData, setChartData] = useState({
    labels: newMonths,
    datasets: [
      {
        label: 'Transactions Over Time',
        data: t, // This will hold your dynamic data
        fill: false,
        borderColor: '#4f46e5',
        tension: 0.1,
      },
    ],
  });
  useEffect(() => {
    
    axios.get('http://localhost:5000/api/getAllDealers').then(r=>
      
      {setDealers(r.data.users.length)})
    .catch(err=>console.log(err))
    axios.get('http://localhost:5000/api/history/fournisseur').then(r=>{setHist(r.data[r.data.length-1]);console.log(r.data)})
    .catch(err=>console.log(err))
    axios.get('http://localhost:5000/api/users/getAll').then(r=>setUsers(r.data.users.length))
    .catch(err=>console.log(err))
    axios.get('http://localhost:5000/api/history').then(r=>setTransaction(r.data.length))
    .catch(err=>console.log(err))
    axios.get('http://localhost:5000/api/allFournisseur').then(r=>{
      var s=0
      r?.data?.users?.forEach(e=>{
        s+=e.coins
      }
    )
    setCoins(s)
    })
    .catch(err=>console.log(err))
   
    
  

      const fetchTransactionData = async () => {
       
        
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        
  
       
        
        // Reverse the months array to show oldest first
        
  
        // Fetch transactions for the last 6 months from your API/DB
        // Assuming the API returns data for each month in sequence
        var t=[]
        var m=[]
        try {
          const response = await axios.get('http://localhost:5000/api/history/transaction'); // Adjust the endpoint to your needs
          console.log(response)
          response.data.forEach(e=>{
              t.push(e.totalTransactions)
              m.push(months[e.month-1])
            })
            
            // Push the transaction data for each month into the array
        } catch (error) {
          console.error('Error fetching transaction data:', error);
        }
        // Set the new months and transaction data in chartData
        console.log(t)
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
      
      fetchTransactionData(); // Call the function
    }, []);

 
  return (
    <div className="flex min-h-screen  bg-gray-100">
      {/* Sidebar */}
      <DealerSideNav />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
         
        </div>

        {/* DealerHome Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaCoins className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Coins</p>
              <p className="text-xl font-semibold">{coins?coins:0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-green-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Dealers</p>
              <p className="text-xl font-semibold">{dealers?dealers:0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaUsers className="text-purple-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-xl font-semibold">{users?users:0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FaHistory className="text-red-600 text-3xl mr-4" />
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{transaction?transaction:0}</p>
            </div>
          </div>
        </div>

        {/* Graph and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions Over Time (Graph) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Transactions Over Time</h2>
            <Line data={chartData} />
          </div>

          {/* Recent Transactions (Table) */}
          <div className="bg-white p-6 rounded-lg w-full shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {hist?<table className="max-w-fit text-[12px] bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-6 border border-gray-300">Fournisseur</th>
                  <th className="py-3 px-6 border border-gray-300">Action</th>
                  <th className="py-3 px-6 border border-gray-300">Dealer</th>
                  <th className="py-3 px-6 border border-gray-300">Total Coins</th>
                  <th className="py-3 px-6 border border-gray-300">Date</th>
                </tr>
              </thead>
             <tbody>
                {/* Example Data */}
                <tr className="hover:bg-gray-100">
                  <td className="py-3 px-6 border border-gray-300">{hist?hist?.Fournisseur?.name+" "+hist?.Fournisseur?.lastName:""}</td>
                  <td className="py-3 px-6 border border-gray-300 text-center">
                    <span className="text-green-500">Transfer</span>
                  </td>
                  <td className="py-3 px-6 border border-gray-300">{hist?hist?.Dealer?.name+" "+hist?.Dealer?.lastName:""}</td>
                  <td className="py-3 px-6 border border-gray-300 text-center">{hist?hist?.totalcoins:0}</td>
                  <td className="py-3 px-6 border border-gray-300 text-center text-[10px]" >
                    {hist?hist?.createdAt?.slice(0,10):"x"}
                  </td>
                </tr>
              </tbody>
            </table>
              :<h1>No Transaction Found .</h1>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerHome;
