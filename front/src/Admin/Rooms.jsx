import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DealerSideNav from './DealerSideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Rooms = () => {
  const [data, setData] = useState([]);
  const [refresh,setRefresh]=useState(false)
  const [refresh1,setrefresh1]=useState(false)
  const [createUser,setcreateUser]=useState(false)
  const [created,setCreated]=useState({})

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    roomName:"",
    price:"",
    entryfees:"",
    burningRate:"",
    botDifficulty:""
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getRooms')
      .then((r) => setData(r.data.users))
      .catch((err) => console.log(err));
  }, [refresh,refresh1]);

const deleteRoom=(id)=>{
  axios.delete('http://localhost:5000/api/deleteRoom/'+id).then(r=>{
    setRefresh(!refresh)
        toast.success('Room Deleted Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  }).catch(err=>console.log(err))
}
  // Function to handle changes in the edit modal input fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    });
    console.log(editData)
  };

  // Function to handle saving the changes (placeholder for now)
  const handleSaveChanges = (id) => {
    axios.put('http://localhost:5000/api/updateRoom/'+id,editData).then(r=>{
      setRefresh(!refresh)
        toast.success('Room Updated Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    }).catch(err=>{
      console.log(err)
    })
    setIsActionModalOpen(false); // Close modal after saving
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setCreated(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave1 = () => {
    axios.post(`http://localhost:5000/api/addRoom`, created)
      .then(response => {
        setrefresh1(!refresh1)
        toast.success('Room Created Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setcreateUser(false);
        // Fetch updated users data
      //   axios.get(`http://localhost:5000/api/getAllDealers`)
      //     .then(response => {
      //       setUsers(response.data);
      //     })
      //     .catch(error => console.error('Error fetching users:', error))
      // 
    }
  )
      .catch(error =>{
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setcreateUser(false);
      } )
  };
  // Function to open the modal for a specific transaction
  const openEditModal = (transaction) => {
    setEditData({
      roomName:"",
    price:"",
    entryfees:"",
    burningRate:"",
    botDifficulty:""
    });
    setIsActionModalOpen(true);
  };

  return (
    <div className="flex">
      <DealerSideNav />
      <div className="p-4 w-full bg-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="py-3 px-6 border border-gray-300">Room Name</th>
              <th className="py-3 px-6 border border-gray-300">Price</th>
              <th className="py-3 px-6 border border-gray-300">Entry Fee</th>
              <th className="py-3 px-6 border border-gray-300">Burning Rate</th>
              <th className="py-3 px-6 border border-gray-300">Bot Difficulty</th>
              <th className="py-3 px-6 border border-gray-300">Actions</th>
              <th className="py-3 px-6 border border-gray-300 cursor-pointer"
              onClick={()=>setcreateUser(true)}
              >Add Room</th>
            </tr>
          </thead>
          <tbody>
            {data
              ? data.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100">
                    <td className="py-3 px-6 border border-gray-300">
                      {transaction.roomName}
                    </td>
                    <td className="py-3 px-6 border border-gray-300">
                      {transaction.price}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-center">
                      {transaction.entryfees}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-center">
                      {transaction.burningRate}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-center">
                      {transaction.botDifficulty}
                    </td>
                    <td className="py-2 px-4 border-b border-r border-gray-400">
                      <button
                        onClick={() => openEditModal(transaction)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        // Add delete function here
                        onClick={()=>deleteRoom(transaction.id)}
                        className="px-2 py-1 bg-red-500  text-white rounded ml-2"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="py-3 px-6  text-center">
                    </td>

                    {isActionModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
              <h3 className="text-lg font-bold mb-4">Edit Room Information</h3>
              <div className="flex flex-col gap-4">
                <label>
                  <span className="block font-bold">Room Name</span>
                  <input
                    type="text"
                    name="roomName"
                    value={editData.roomName}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  <span className="block font-bold">Price</span>
                  <label htmlFor="">{editData.price}</label>
                  <input
                    type="range"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  <span className="block font-bold">Entry Fee</span>
                  <label htmlFor="">{editData.entryfees}</label>
                  <input
                    type="range"
                    name="entryfees"
                    value={editData.entryfees}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  <span className="block font-bold">Burning Rate</span>
                  <label htmlFor="">{editData.burningRate}</label>
                  <input
                    type="range"
                    name="burningRate"
                    value={editData.burningRate}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <label>
                  <span className="block font-bold">Bot Difficulty</span>
                  <label htmlFor="">{editData.botDifficulty}</label>
                  <input
                    type="range"
                    name="botDifficulty"
                    value={editData.botDifficulty}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={()=>handleSaveChanges(transaction.id)}
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
                  </tr>
                ))
              : ''}
          </tbody>
        </table>

        {/* Edit Modal */}
       
      </div>
      {createUser && (
                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
                    <h3 className="text-lg font-bold">Edit Room</h3>
                    <div className="mt-2">
                      
                     
                    <label htmlFor="">Room Name</label>
                      <input
                        type="text"
                        name="roomName"
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Room Name"
                      />
                      <label htmlFor="">Entry Fees</label>
                      <br/>
                      <label htmlFor="">{created.entryfees}</label>
                      <input
                        type="range"
                        value={created.entryfees}
                        name="entryfees"
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Entry Fees"
                       
                      />
                      <label htmlFor="">Burning Rate</label>
                      <br />
                      <label htmlFor="">{created.burningRate}</label>
                      <input
                        type="range"
                        name="burningRate"
                        value={created.burningRate}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Burning Rate"
                      />
                      <label htmlFor="">Bot Difficulty</label>
                      <br />
                      <label htmlFor="">{created.botDifficulty}</label>
                      <input
                        type="range"
                        value={created.botDifficulty}
                        name="botDifficulty"
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Bot Difficulty "
                      />
                      <label htmlFor="">Price</label>
                      <br />
                      <label htmlFor="">{created.price}</label>
                      <input
                        type="range"
                        name="price"
                        value={created.price}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Price"
                      />
                      
                      <button
                        onClick={() => handleSave1()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setcreateUser(false)}
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
};

export default Rooms;
