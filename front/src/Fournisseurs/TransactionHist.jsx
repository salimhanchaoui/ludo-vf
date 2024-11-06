import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FournisseursSideNav from './FournisseursSideNav';
import { FaArrowUp } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

function TransactionHist() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);

  // Fetch fournisseurId from localStorage
  const fournisseurId = localStorage.getItem('id');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!fournisseurId) {
        setError('Fournisseur ID is missing');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/transaction-history/${fournisseurId}`);
        if (response.data && Array.isArray(response.data.history)) {
          setHistory(response.data.history);
        } else {
          setError('Invalid data format');
        }
      } catch (error) {
        setError(error.response?.data.message || 'Error fetching history');
      }
    };

    if (fournisseurId) {
      fetchHistory();
    }
  }, [fournisseurId]);

  const pageCount = Math.ceil(history.length / itemsPerPage);
  const itemsToDisplay = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <FournisseursSideNav className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-gray-800 text-white" />
        <div className="flex-1 p-6 ">
          <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">Transaction History</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {history.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse border border-gray-300 text-sm lg:text-base">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border border-gray-300">Dealer Name</th>
                      <th className="py-3 px-6 border border-gray-300">Dealer phoneNumber</th>
                      <th className="py-3 px-6 border border-gray-300">Fournisseur Name</th>
                      <th className="py-3 px-6 border border-gray-300">Fournisseur phoneNumber</th>
                      <th className="py-3 px-6 border border-gray-300">Transferred Coins</th>
                      <th className="py-3 px-6 border border-gray-300">Action</th>
                      <th className="py-3 px-6 border border-gray-300">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsToDisplay.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border border-gray-300">{entry.Dealer ? entry.Dealer.name : 'N/A'}</td>
                        <td className="py-2 px-4 border border-gray-300">{entry.Dealer ? entry.Dealer.phoneNumber : 'N/A'}</td>
                        <td className="py-2 px-4 border border-gray-300">{entry.Fournisseur ? entry.Fournisseur.name : 'N/A'}</td>
                        <td className="py-2 px-4 border border-gray-300">{entry.Fournisseur ? entry.Fournisseur.phoneNumber : 'N/A'}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">{entry.totalcoins}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          <span className="text-green-500 flex items-center justify-center">
                            <FaArrowUp className="mr-1" />
                            Transfer
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          <div>
                            {new Date(entry.createdAt).toLocaleDateString()}
                            <br />
                            {new Date(entry.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'flex justify-center items-center mt-6 space-x-1'}
                pageClassName={'border border-gray-300 rounded-md px-2 py-1 text-xs lg:text-sm cursor-pointer hover:bg-gray-400'}
                activeClassName={'bg-gray-500 text-white'}
                previousClassName={'border border-gray-300 rounded-md px-2 py-1 text-xs lg:text-sm cursor-pointer hover:bg-gray-200'}
                nextClassName={'border border-gray-300 rounded-md px-2 py-1 text-xs lg:text-sm cursor-pointer hover:bg-gray-200'}
                breakLinkClassName={'text-gray-500'}
                activeLinkClassName={'text-black'}
              />
            </>
          ) : (
            <p className="text-gray-600">No transaction history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionHist;
