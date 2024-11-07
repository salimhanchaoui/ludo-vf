import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Importing icons for up and down arrows

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page as needed
  
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history
    .filter(e => '' + e.dealer_id === id && e.fournisseur_id === null)
    .slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate the total number of pages
  const totalPages = Math.ceil(history.filter(e => '' + e.dealer_id === id && e.fournisseur_id === null).length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
              {currentItems.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 sm:px-6 border border-gray-300 text-center">{transaction.id}</td>
                  <td className="py-3 px-4 sm:px-6 border border-gray-300">
                    {transaction.Dealer ? transaction.Dealer.phoneNumber : 'N/A'}
                  </td>
                  <td className="py-3 px-4 sm:px-6 border border-gray-300">
                    {transaction?.PrimaryUser ? transaction.PrimaryUser.phoneNumber : 'N/A'}
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

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
