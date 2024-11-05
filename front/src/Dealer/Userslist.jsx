import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');
  const [userId, setID] = useState(0);
  const [refresh, setREF] = useState(false);
  const [transactionMode, setTransactionMode] = useState('transfer'); // 'transfer' or 'withdraw'
    // State for adding a new user
    const [newUserData, setNewUserData] = useState({
      name: '',
      lastName: '',
      email: '',
      password: '',
      img: '',
      phone: '',
    });
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [addUserError, setAddUserError] = useState('');
    const [addUserSuccess, setAddUserSuccess] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/getAll`)
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [pageIndex, refresh]);

    // Handler for input changes (new user form)
    const handleNewUserChange = (e) => {
      const { name, value } = e.target;
      setNewUserData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
    // Function to add a new user
  const handleAddUser = () => {
    setAddUserError('');
    setAddUserSuccess('');

    const { name, lastName, email, password, img, phone } = newUserData;
    if (!name || !lastName || !email || !password || !img || !phone) {
      setAddUserError('All fields are required.');
      return;
    }

    axios.post('http://localhost:5000/api/users/'+'salim', newUserData)
      .then(response => {
        setUsers(prevUsers => [...prevUsers, response.data]);
        setAddUserSuccess('User added successfully!');
        setNewUserData({ name: '', lastName: '', email: '', password: '', img: '', phone: '' });
        setIsAddUserModalOpen(false);
      })
      .catch(error => {
        setAddUserError('Error adding user. Please try again.');
        console.error('Error adding user:', error);
      });
  };
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
    });
    setIsDetailModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    axios.put(`http://localhost:5000/api/users/edit-info/${selectedUser.id}`, editData)
      .then(response => {
        setUsers(prevUsers => 
          prevUsers.map(user =>
            user.id === selectedUser.id ? { ...user, ...editData } : user
          )
        );
        setSelectedUser(prevUser => ({ ...prevUser, ...editData }));
        setEditData({ name: '', lastName: '', phone: '', email: '' });
        setIsActionModalOpen(false);
      })
      .catch(error => console.error('Error updating user info:', error));
  };

  const handleTransactionAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };

  const handleTransaction = () => {
    // Input validation
    if (!transactionAmount || isNaN(transactionAmount) || parseFloat(transactionAmount) <= 0) {
      setTransactionError('Please enter a valid amount.');
      return;
    }
  
    const amount = parseFloat(transactionAmount);
    const dealerId = 1; // Assuming the dealer ID is 1. Adjust as needed.
  
    // Clear previous success and error messages
    setTransactionSuccess('');
    setTransactionError('');
  
    if (transactionMode === 'transfer') {
      // Handle transfer logic
      axios.put(`http://localhost:5000/api/dealers/edit-coins/${dealerId}`, { dealerId, amount })
        .then(response => {
          if (response.status === 200) {
            return axios.put(`http://localhost:5000/api/users/edit-coins/${userId}`, { coinsToAdd: amount });
          } else {
            throw new Error('Error adjusting dealer coins.');
          }
        }).catch(err=>console.log(err))
        .then(response => {
          if (response.status === 200) {
            return axios.post('http://localhost:5000/api/history', {
              totalcoins: amount,
              role: 'transfer',
              dealer_id: dealerId,
              user_id: userId,
            });
          } else {
            throw new Error('Error adjusting user coins.');
          }
        }).catch(err=>console.log(err))
        .then(response => {
         
            setTransactionAmount('');
            setTransactionSuccess('Coins transferred successfully!');
            setIsTransactionModalOpen(false);
            setREF(!refresh); // Trigger refresh
        })
        .catch(error => {
          setTransactionError('Error during transaction. Please try again.');
          console.error('Error transferring coins:', error);
        });
    } else if (transactionMode === 'withdraw') {
      // Handle withdraw logic
      axios.put(`http://localhost:5000/api/users/decrease-coins/${userId}`, { amount })
        .then(response => {
          if (response.status === 200) {
            return axios.put(`http://localhost:5000/api/dealers/addCoins/${dealerId}`, { amount });
          } else {
            throw new Error('Error adjusting user coins.');
          }
        })
        .then(response => {
          if (response.status === 200) {
            return axios.post('http://localhost:5000/api/history', {
              totalcoins: amount,
              role: 'withdraw',
              dealer_id: dealerId,
              user_id: userId,
            });
          } else {
            throw new Error('Error adjusting dealer coins.');
          }
        }).catch(err=>console.log(err))
        .then(response => {
         
            setTransactionAmount('');
            setTransactionSuccess('Coins withdrawn successfully!');
            setIsTransactionModalOpen(false);
            setREF(!refresh); // Trigger refresh
        })
        .catch(error => {
          setTransactionError('Error during transaction. Please try again.');
          console.error('Error withdrawing coins:', error);
        });
    }
  };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
    });
    setIsActionModalOpen(true);
  };
   // Open the add user modal
   const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };
  return (
    <div className="flex flex-col lg:flex-row">
    {/* Sidebar */}
    <DealerSideNav />
  
    {/* Main Content */}
    <div className="flex-1 p-6 bg-gray-200">
      {/* Add User Button */}
      <button
        onClick={openAddUserModal}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4 w-full lg:w-auto"
      >
        Add New User
      </button>
  
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300">ID</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Last Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Phone</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Email</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Coins</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="py-2 px-4 border-b border-gray-400">{user.id}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.lastName}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.phone}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.coins}</td>
                <td className="py-2 px-4 border-b border-gray-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(user);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTransactionMode('transfer');
                      setIsTransactionModalOpen(true);
                      setID(user.id);
                    }}
                    className="px-2 py-1 bg-green-500 text-white rounded ml-2"
                  >
                    Transfer
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTransactionMode('withdraw');
                      setIsTransactionModalOpen(true);
                      setID(user.id);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                  >
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex(pageIndex - 1)}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${pageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <button
          disabled={pageIndex === totalPages - 1}
          onClick={() => setPageIndex(pageIndex + 1)}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${pageIndex === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  
    {/* Modals */}
    {/* Edit User Modal */}
    {isActionModalOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
          <h3 className="text-lg font-bold mb-4">Edit User Information</h3>
          <div className="flex flex-col gap-4">
            <label>
              <span className="block font-bold">Name</span>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <label>
              <span className="block font-bold">Last Name</span>
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <label>
              <span className="block font-bold">Phone</span>
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <label>
              <span className="block font-bold">Email</span>
              <input
                type="text"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsActionModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  
    {/* Transaction Modal */}
    {isTransactionModalOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
          <h3 className="text-lg font-bold mb-4">
            {transactionMode === 'transfer' ? 'Transfer Coins' : 'Withdraw Coins'}
          </h3>
          <div className="flex flex-col gap-4">
            <label>
              <span className="block font-bold">Amount</span>
              <input
                type="number"
                value={transactionAmount}
                onChange={handleTransactionAmountChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsTransactionModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleTransaction}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {transactionMode === 'transfer' ? 'Transfer' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>
    )}
  
    {/* Add User Modal */}
    {isAddUserModalOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          {addUserError && <p className="text-red-500 mb-4">{addUserError}</p>}
          {addUserSuccess && <p className="text-green-500 mb-4">{addUserSuccess}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={newUserData.lastName}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newUserData.email}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={newUserData.password}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              type="text"
              name="img"
              value={newUserData.img}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={newUserData.phone}
              onChange={handleNewUserChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}
export default UsersList;
