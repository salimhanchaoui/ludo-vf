// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DealerSideNav from './DealerSideNav';
// import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Importing icons for up and down arrows
// import { Link } from 'react-router-dom';

// const TransactionHistory = () => {
//   const [historyF, setHistoryF] = useState([]);
//   const [historyU, setHistoryU] = useState([]);
//   const [historyD, setHistoryD] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch transaction history
//     const fetchHistory = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/history/fournisseur');
//         console.log(response.data)
//         setHistoryF(response.data.splice(response.data.length-2,1));
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching transaction history');
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);
//   useEffect(() => {
//     // Fetch transaction history
//     const fetchHistory = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/history/dealer');
//         console.log(response.data)
//         setHistoryD(response.data.splice(response.data.length-3,1));
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching transaction history');
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);
//   useEffect(() => {
//     // Fetch transaction history
//     const fetchHistory = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/history/user');
//         console.log("aze",response.data)
//         setHistoryU(response.data.splice(response.data.length-3,1));
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching transaction history');
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   if (loading) {
//     return <div>Loading transaction history...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="flex">
//       <DealerSideNav />
//       <div className="p-4 w-full bg-gray-200">
//         <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
//         {/* <table className="min-w-full bg-white border-collapse border border-gray-300">
//           <thead>
//             <tr className="">
//               <th className="py-3 px-6 border border-gray-300">Fournisseur</th>
//               <th className="py-3 px-6 border border-gray-300">Action</th>
//               <th className="py-3 px-6 border border-gray-300">Dealer</th>
//               <th className="py-3 px-6 border border-gray-300">Total Coins</th>
//               <th className="py-3 px-6 border border-gray-300">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyF.map((transaction) => (
//               <tr key={transaction.id} className="hover:bg-gray-100">
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.Fournisseur ? transaction.Fournisseur.name + ' ' + transaction.Fournisseur.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
                
//                     <span className="text-green-500 flex items-center justify-center">
//                       <FaArrowUp className="mr-1" />
//                       Transfer
//                     </span>
//           </td>
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.Dealer ? transaction.Dealer.name + ' ' + transaction.Dealer.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">{transaction.totalcoins}</td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
//                   {new Date(transaction.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table> */}
//         {/* <Link to={'/fournisseur-history'} className='text-blue-500 float-right'>See More</Link> */}
//         <table className="min-w-full bg-white border-collapse border border-gray-300">
//           <thead>
//             <tr className="">
//               <th className="py-3 px-6 border border-gray-300">Dealer</th>
//               <th className="py-3 px-6 border border-gray-300">Action</th>
//               <th className="py-3 px-6 border border-gray-300">User</th>
//               <th className="py-3 px-6 border border-gray-300">Total Coins</th>
//               <th className="py-3 px-6 border border-gray-300">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyD.map((transaction) => (
//               <tr key={transaction.id} className="hover:bg-gray-100">
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.Dealer ? transaction.Dealer.name + ' ' + transaction.Dealer.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
                 
//                     <span className="text-green-500 flex items-center justify-center">
//                       <FaArrowUp className="mr-1" />
//                       Transfer
//                     </span>
                 
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.PrimaryUser ? transaction.PrimaryUser.name + ' ' + transaction.PrimaryUser.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">{transaction.totalcoins}</td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
//                   {new Date(transaction.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Link to={'/dealer-history'}className='text-blue-500 float-right'>See More</Link>
//         {/* <table className="min-w-full bg-white border-collapse border border-gray-300">
//           <thead>
//             <tr className="">
//               <th className="py-3 px-6 border border-gray-300">User1</th>
//               <th className="py-3 px-6 border border-gray-300">Action</th>
//               <th className="py-3 px-6 border border-gray-300">User2</th>
//               <th className="py-3 px-6 border border-gray-300">Total Coins</th>
//               <th className="py-3 px-6 border border-gray-300">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyU.map((transaction) => (
//               <tr key={transaction.id} className="hover:bg-gray-100">
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.PrimaryUser ? transaction.PrimaryUser.name + ' ' + transaction.PrimaryUser.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
//                     <span className="text-green-500 flex items-center justify-center">
//                       <FaArrowUp className="mr-1" />
//                       Transfer
//                     </span>
                
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300">
//                   {transaction.SecondaryUser ? transaction.SecondaryUser.name + ' ' + transaction.SecondaryUser.lastName : 'N/A'}
//                 </td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">{transaction.totalcoins}</td>
//                 <td className="py-3 px-6 border border-gray-300 text-center">
//                   {new Date(transaction.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table> */}
//         {/* <Link to={'/user-history'} className='text-blue-500 float-right'>See More</Link> */}
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Importing icons for up and down arrows

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = localStorage.getItem('id');
  const name = localStorage.getItem('name');
  useEffect(() => {
    // Fetch transaction history
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history');
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading transaction history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
console.log('histoo',)
  return (
    <div className="flex flex-col lg:flex-row">
    {/* Sidebar */}
    <DealerSideNav />
  
    {/* Main Content */}
    <div className="p-4 w-full bg-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
  
      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">Transaction ID</th>
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">Dealer</th>
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">User</th>
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">Total Coins</th>
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">Role</th>
              <th className="py-3 px-4 bg-white sm:px-6 border border-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.filter(e=>''+e.dealer_id===id).map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="py-3 px-4 sm:px-6 border border-gray-300 text-center">{transaction.id}</td>
                <td className="py-3 px-4 sm:px-6 border border-gray-300">
                  {transaction.Dealer ? transaction.Dealer.phoneNumber : 'N/A'}
                </td>
                <td className="py-3 px-4 sm:px-6 border border-gray-300">
                  {transaction?.PrimaryUser ? transaction.PrimaryUser.phone : 'N/A'}
                </td>
                <td className="py-3 px-4 sm:px-6 border border-gray-300 text-center">{transaction.totalcoins}</td>
                <td className="py-3 px-4 sm:px-6 border border-gray-300 text-center">
                  {transaction.role === 'transfer' ? (
                    <span className="text-green-500 flex items-center justify-center">
                      <FaArrowUp className="mr-1" />
                      Transfer
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center justify-center">
                      <FaArrowDown className="mr-1" />
                      Withdraw
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 sm:px-6 border border-gray-300 text-center">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  );
};

export default TransactionHistory;