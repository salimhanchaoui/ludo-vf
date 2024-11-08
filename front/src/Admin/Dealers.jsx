import React, { useEffect, useState } from 'react';
import DealerSideNav from './DealerSideNav';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoPersonAdd } from "react-icons/io5";
import { RiChatDeleteLine } from "react-icons/ri";
import DealerAdd from './DealerAdd';

const Dealers = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [updated, setUpdated] = useState({});
  const [created, setCreated] = useState({});
const[showAddDealer,setShowAddDealer]=useState(false)
const[refresh,setrefresh]=useState(false)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/getAllDealers/?page=${pageIndex + 1}&limit=10`)
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [editingUser,pageIndex,refresh]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdated({
      name: user.name,
      lastName: user.lastName,
      email: user.email
    });
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:5000/api/updateDealer/${id}`, updated)
      .then(response => {
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
        setEditingUser(null);
        // Fetch updated users data
        axios.get(`http://localhost:5000/api/getAllDealers`)
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => console.error('Error fetching users:', error));
      })
      .catch(error => console.error('Error updating user:', error));
  };
  const handleSave1 = () => {
    axios.post(`http://localhost:5000/api/addDealer`, created)
      .then(response => {
        setrefresh(!refresh)
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdated(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setCreated(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleDelete = (id) => {
    axios.delete('http://localhost:5000/api/delhistory/dealer/'+id).then(r=>{
      axios.delete(`http://localhost:5000/api/deleteDealer/${id}`)
      .then(response => {
        toast.success('User Deleted Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setUsers(users.filter(user => user.id !== id));
       
      })
    })
    .catch(err=>{
      axios.delete(`http://localhost:5000/api/deleteDealer/${id}`)
      .then(response => {
        toast.success('User Deleted Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setUsers(users.filter(user => user.id !== id));
       
      })
    })
    
      .catch(error => {
        axios.delete(`http://localhost:5000/api/deleteDealer/${id}`)
      .then(response => {
        toast.success('User Deleted Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setUsers(users.filter(user => user.id !== id));
       
      })
      });
  };
  const [createUser,setcreateUser]=useState(false)
  const [dealers,setDealers]=useState([])
  const [popUp,setPopUp]=useState(false)
  const getUsersRelatedToDealer=(id)=>{
    axios.get('http://localhost:5000/api/users/getUsersRelatedToDealer/'+id)
    .then(r=>{setDealers(r.data);setPopUp(true)}).catch(err=>console.log(err))
  }
  return (
  <>
   {showAddDealer?<DealerAdd  setShowAddDealer={setShowAddDealer} />:
    <div className="flex max-h-screen">
    <DealerSideNav />
    <div className="flex-1  p-6 bg-gray-200 max-h-screen  w-full">
      <table className=" min-w-full  bg-white border border-gray-300 ">
        <thead>
          <tr >
            <th className="border-b px-4 py-2 text-left ">Name</th>
            <th className="border-b px-4 py-2 text-left">Last Name</th>
            <th className="border-b px-4 py-2 text-left">Phone Number</th>
            <th className="border-b px-4 py-2 text-left">coins</th>
            <th className="border-b px-4 py-2 text-left">Image</th>
            <th className="border-b px-4 py-2 text-left">Returning Fee</th>
            <th className="border-b px-4 py-2 text-left">Actions</th>
            <th className="border-b px-4 py-2 text-left">
              <div className='flex gap-3 cursor-pointer'
              onClick={()=>setcreateUser(true)}
              >
            <h1 >

            Add Dealer
            </h1>
            <IoPersonAdd size={25}/>

              </div>              </th>
          </tr>
        </thead>
        <tbody>
          {users.length&&users?.map(user => (
            <React.Fragment key={user.id}>
              <tr className='p-0 left-0 mr-40'>
                <td className="border-gray-400 border-b px-4 py-2 text-left underline cursor-pointer"
                onClick={()=>getUsersRelatedToDealer(user.id)}
                >{user.name}</td>
                <td className="border-b border-gray-400 px-4 py-2 text-left" >{user.lastName}</td>
                <td className="border-b border-gray-400 px-4 py-2 text-left" >{user.phoneNumber}</td>
                <td className="border-b border-gray-400 px-4 py-2 text-left" >{user.coins}</td>
                <td className="border-b border-gray-400 px-4 py-2 text-left" >
                  <img src={user.img} alt="User" style={{ width: '35px', height: '35px' }} className='rounded-full' />
                </td>
                <td className="border-b border-gray-400 px-4 py-2 text-left" >{user.fee}</td>
                <td className="border-gray-400 border-b px-4 py-2 text-left font-semibold" >
                  <button
                  
                  onClick={() => handleEdit(user)} className="text-white rounded-2xl w-[50px] bg-blue-500">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className=" text-white  rounded-2xl w-[75px] bg-red-500 ml-2">Delete</button>
                </td>
                <td className="border-gray-400 border-b px-4 py-2 text-left" ></td>
              </tr>
              {editingUser && editingUser.id === user.id && (
                // <tr>
                //   <td colSpan="6">

                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">

                      <h3 className="text-lg font-bold">Edit Dealer</h3>
                      <div className="mt-2">
                        
                      
                        <input
                          type="text"
                          name="name"
                          value={updated.name || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="Name"
                          />
                        <input
                          type="text"
                          name="lastName"
                          value={updated.lastName || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="Last Name"
                          />
                        <input
                          type="text"
                          name="phoneNumber"
                          value={updated.phoneNumber || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="Phone Number"
                          />
                        <input
                          type="email"
                          name="email"
                          value={updated.email || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="email"
                          />
                        <input
                          type="password"
                          name="password"
                          value={updated.password || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="password"
                          />
                        <input
                          type="number"
                          name="coins"
                          value={updated.coins || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="Coins"
                          />
                        <input
                          type="number"
                          name="fee"
                          value={updated.fee || ''}
                          onChange={handleChange}
                          className="block w-full mb-2 p-2 border rounded text-black"
                          placeholder="Returning Fee"
                          />
                        <button
                          onClick={() => handleSave(user.id)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                          >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="ml-2 mt-2 px-4 py-2 bg-gray-500 text-white rounded"
                          >
                          Cancel
                        </button>
                      </div>
                    </div>
                    </div>
                //   </td>
                // </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPageIndex(index)}
            className={`px-4 py-2 mx-1 ${index === pageIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
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
    <div>
      <ToastContainer />
    </div>
    {popUp && (
<>
  {/* Overlay */}
  <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setPopUp(false)}></div>

  {/* Popup */}
  <div className="p-4 absolute ml-[40%] mt-[10%] rounded-md w-[300px] h-[300px] bg-slate-600 flex flex-col z-50">
    <div className="flex justify-between w-full mb-2">
      <h1 className="text-white font-semibold">Users</h1>
      <RiChatDeleteLine size={25} color="white" className="cursor-pointer" onClick={() => setPopUp(false)} />
    </div>
    <hr className="mb-2" />
    <div className="overflow-y-auto flex-1">
      {dealers.length > 0 ? (
        dealers.map((e) => (
          <div key={e.id} className="text-left text-white font-semibold mb-2">
            <h1>Name: {e.name} {e.lastName}</h1>
            <h1>Coins: {e.coins}</h1>
            <hr className="mt-1" />
          </div>
        ))
      ) : (
        <p className="text-white">No users available.</p>
      )}
    </div>
  </div>
</>
)}
 {createUser && (
                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
                    <h3 className="text-lg font-bold">Add Dealer</h3>
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
                        name="fee"
                        value={created.fee || ''}
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Returning Fee"
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
                        name="fournisseurName"
                        
                        onChange={handleChange1}
                        className="block w-full mb-2 p-2 border rounded text-black"
                        placeholder="Fournisseur Name"
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
  </div>} 
  </>
   
  );
};

export default Dealers;
