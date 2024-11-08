import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function UsersList() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [created, setCreated] = useState({});
  const [refresh1, setrefresh1] = useState(false);
  const [editData, setEditData] = useState({
   coins:'',
   name:'',
   phoneNumber:'',
   email:'',
   password:'',
   lastName:''
  });
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const[createUser,setCreateUser]=useState(false)
  const [userId, setID] = useState(0);
  
  const [refresh,setRefresh]=useState(false)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/getAll/?page=${pageIndex + 1}&limit=10`)
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [pageIndex, refresh,refresh1]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setEditData({
      
      coins: user.coins,
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
  const handleSave1 = (e) => {
    axios.post(`http://localhost:5000/api/users/${e}`, created)
      .then(response => {
        setrefresh1(!refresh1)
        toast.success('User Created Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setCreateUser(null);
        // Fetch updated users data
        axios.get(`http://localhost:5000/api/getAllDealers`)
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => console.error('Error fetching users:', error));
      })
      .catch(error => console.error('Error updating user:', error));
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setCreated(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSaveChanges = () => {
    axios.put(`http://localhost:5000/api/users/edit-info/${userId}`, editData)
      .then(response => {
        setRefresh(!refresh)
        toast.success('User Updated Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setEditData({ name: '', lastName: '', phone: '', email: '' });
        setIsActionModalOpen(false);
        setIsDetailModalOpen(false);
      })
      .catch(error => console.error('Error updating user info:', error));
  };

 

  
  const deleteUser=(id)=>{
    axios.delete('http://localhost:5000/api/delhistory/user/'+id).then(r=>{
      axios.delete('http://localhost:5000/api/users/'+id).then(r=>{
        toast.success('User Deleted Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      setRefresh(!refresh)
      
    })
    })
    .catch(err=>{
      axios.delete('http://localhost:5000/api/users/'+id).then(r=>{
        toast.success('User Deleted Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      setRefresh(!refresh)
      
    })
    })
   
  }
  return (
    <div className="flex">
      <DealerSideNav />
      <div className="flex-1 p-6 bg-gray-200">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300">Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Last Name</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Phone</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Email</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Coins</th>
              <th className="py-2 px-4 border-b-2 border-gray-300">Actions</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 cursor-pointer"
              onClick={()=>setCreateUser(true)}
              >Add User</th>
            </tr>
          </thead>
          <tbody>
            {users.length&&users?.map(user => (
              <tr
                key={user.id}
                
                className="cursor-pointer"
              >
               
                <td className="py-2 px-4 border-b border-gray-400"
                onClick={() => handleRowClick(user)}
                >{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.lastName}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.phoneNumber}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-400">{user.coins}</td>
                <td className="py-2 px-4 border-b border-gray-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsActionModalOpen(true);
                      setID(user.id);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => {
                      deleteUser(user.id)
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
                <td className="py-2 px-4 border-b border-gray-400"></td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Edit Modal */}
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
                  
                  <span className="block font-bold">Phone Number</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editData.phoneNumber}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  
                  <span className="block font-bold">email</span>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  
                  <span className="block font-bold">password</span>
                  <input
                    type="password"
                    name="password"
                    value={editData.password}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>

              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={()=>{handleSaveChanges()}}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsActionModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Detail Modal */}
        {selectedUser && isDetailModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
              <h3 className="text-lg font-bold mb-4">User In-game Details</h3>
              <div className="flex flex-col gap-4">
                {selectedUser.img && (
                  <img src={selectedUser.img} alt="User" className="w-24 h-24 border rounded-full mx-auto" />
                )}
                <p className="bg-gray-200 p-2 border rounded-lg shadow-inner"><strong>Coins:</strong> {selectedUser.coins}</p>
                <p className="bg-gray-200 p-2 border rounded-lg shadow-inner"><strong>Diamonds:</strong> {selectedUser.diamonds}</p>
                <p className="bg-gray-200 p-2 border rounded-lg shadow-inner"><strong>Victories:</strong> {selectedUser.victories}</p>
                <p className="bg-gray-200 p-2 border rounded-lg shadow-inner"><strong>Defeats:</strong> {selectedUser.defeats}</p>
                <p className="bg-gray-200 p-2 border rounded-lg shadow-inner"><strong>Kills:</strong> {selectedUser.kills}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Action Modal (Transfer/Withdraw) */}
     

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Previous
          </button>
          <span className="self-center">Page {pageIndex + 1} of {totalPages}</span>
          <button
            onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={pageIndex === totalPages - 1}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
      {createUser && (
                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
                    <h3 className="text-lg font-bold">Add User</h3>
                    <div className="mt-2">
                      
                     
                      
                      <input
                        type="text"
                        name="name"
                        value={created.name || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={created.lastName || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Last Name"
                      />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={created.phoneNumber || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Phone Number"
                      />
                      <input
                        type="email"
                        name="email"
                        value={created.email || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Email"
                      />
                      <input
                        type="password"
                        name="password"
                        value={created.password || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Password"
                      />
                      <input
                        type="number"
                        name="coins"
                        value={created.coins || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Coins"
                      />
                      <input
                        type="text"
                        name="dealerName"
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Dealer Name"
                      />
                      <button
                        onClick={() => handleSave1(created.name)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setCreateUser(null)}
                        className="ml-2 mt-2 px-4 py-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  </div>
            )}
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UsersList;