import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';
import { FaArrowUp } from 'react-icons/fa'; // Importing icons for up arrow
import ReactPaginate from 'react-paginate'; // Import the pagination component

const DealerHist = () => {
  const [historyF, setHistoryF] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const [itemsPerPage] = useState(6); // Set how many items to show per page

  useEffect(() => {
    // Fetch transaction history
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/history/dealer');
        console.log(response.data);
        setHistoryF(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching transaction history');
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

  // Calculate the total number of pages
  const pageCount = Math.ceil(historyF.length / itemsPerPage);

  // Get the items for the current page
  const itemsToDisplay = historyF.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="flex">
      <DealerSideNav />
      <div className="p-4 w-full bg-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Dealer History</h2>
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className="py-3 px-6 border border-gray-300">Dealer</th>
              <th className="py-3 px-6 border border-gray-300">Action</th>
              <th className="py-3 px-6 border border-gray-300">User</th>
              <th className="py-3 px-6 border border-gray-300">Total Coins</th>
              <th className="py-3 px-6 border border-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="py-3 px-6 border border-gray-300">
                  {transaction.Dealer
                    ? transaction.Dealer.name + ' ' + transaction.Dealer.lastName
                    : 'N/A'}
                </td>
                <td className="py-3 px-6 border border-gray-300 text-center">
                  <span className="text-green-500 flex items-center justify-center">
                    <FaArrowUp className="mr-1" />
                    Transfer
                  </span>
                </td>
                <td className="py-3 px-6 border border-gray-300">
                  {transaction.PrimaryUser
                    ? transaction.PrimaryUser.name + ' ' + transaction.PrimaryUser.lastName
                    : 'N/A'}
                </td>
                <td className="py-3 px-6 border border-gray-300 text-center">
                  {transaction.totalcoins}
                </td>
                <td className="py-3 px-6 border border-gray-300 text-center">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center items-center mt-6 space-x-2'}
          pageClassName={
            'border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-400'
          }
          activeClassName={'bg-gray-500 text-white'}
          previousClassName={
            'border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-200'
          }
          nextClassName={
            'border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-200'
          }
          breakLinkClassName={'text-gray-500'}
          activeLinkClassName={'text-black'}
        />
      </div>
    </div>
  );
};

export default DealerHist;
