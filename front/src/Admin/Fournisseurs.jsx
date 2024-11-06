import React, { useEffect, useState } from 'react';
import DealerSideNav from './DealerSideNav';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoPersonAdd } from "react-icons/io5";
import { RiChatDeleteLine } from "react-icons/ri";

const Dealers = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [createUser, setCreateUser] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [created, setCreated] = useState({});
  const [updated, setUpdated] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/allFournisseur/?page=${pageIndex + 1}&limit=10`)
      .then(response => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [editingUser,refresh,pageIndex]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdated({
     
      coins:user.coins
    });
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:5000/api/updateFournisseur/${id}`, updated)
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
    axios.post(`http://localhost:5000/api/addNewFournisseur`, created)
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
        setCreateUser(null);
        // Fetch updated users data
        
      })
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
        setCreateUser(null);
      } );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdated(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  const handleChange1 = (e) => {
    console.log(created)
    const { name, value } = e.target;
    setCreated(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (id) => {
    
        axios.delete('http://localhost:5000/api/delhistory/fournisseur/'+id).then(r=>{
          axios.delete(`http://localhost:5000/api/deleteFournisseur/${id}`)
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
      }).catch(error => console.error('Error deleting user:', error));
        }).catch(err=>{
          axios.delete(`http://localhost:5000/api/deleteFournisseur/${id}`)
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
      }).catch(error => console.error('Error deleting user:', error));
        })
      
      
  };
  const [dealers,setDealers]=useState([])
  const[popUp,setPopUp]=useState(false)
  const getDealers=(id)=>{
    axios.get('http://localhost:5000/api/getDealersRelatedToFournisseur/'+id).then(r=>
        setDealers(r.data)
    ).catch(err=>console.log(err))
  }
  return (
    <div className="flex">
      <DealerSideNav />
      <div className="flex-1  p-6 bg-gray-200  ">
        <table className="  bg-white border border-gray-300 w-full">
          <thead>
            <tr className=''>
              <th className="border-b px-4 py-2 text-left">Name</th>
              <th className="border-b px-4 py-2 text-left">Last Name</th>
              <th className="border-b px-4 py-2 text-left">Phone Number</th>
              <th className="border-b px-4 py-2 text-left">coins</th>
              {/* <th className="border-b px-4 py-2 text-left">Image</th> */}
              <th className="border-b px-4 py-2 text-left">Actions</th>
              <th className="border-b px-4 py-2 text-left">
                <div className='flex gap-3 cursor-pointer'
                onClick={()=>setCreateUser(true)}
                >
              <h1 
                onClick={()=>setCreateUser(true)}
              >

              Add Fournisseur
              </h1>
              <IoPersonAdd size={25}/>

                </div>              </th>
            </tr>
          </thead>
          <tbody>
            {users.length&&users?.map(user => (
              <React.Fragment key={user.id}>
                <tr className='p-0 left-0 mr-40'>
                  <td className="border-b px-4 py-2 text-left cursor-pointer underline"
                  onClick={()=>{getDealers(user.id)
                    setPopUp(true)
                  } }
                  >{user.name}</td>
                  <td className="border-b px-4 py-2 text-left">{user.lastName}</td>
                  <td className="border-b px-4 py-2 text-left">{user.phoneNumber}</td>
                  <td className="border-b px-4 py-2 text-left">{user.coins}</td>
                  {/* <td className="border-b px-4 py-2 text-left">
                    <img src={user.img} alt="User" style={{ width: '50px', height: '50px' }} />
                  </td> */}
                  <td className="border-b px-4 py-2 text-left font-semibold">
                    <button
                    
                    onClick={() => handleEdit(user)} className="text-white rounded-2xl w-[50px] bg-blue-500">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className=" text-white  rounded-2xl w-[75px] bg-red-500 ml-2">Delete</button>
                  </td>
                  <td className="border-b px-4 py-2 text-left"></td>
                </tr>
                {editingUser && editingUser.id === user.id && (
                  <tr>
                    <td colSpan="6">
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-bold">Edit Fournisseur</h3>
                        <div className="mt-2">
                          
                         
                          
                          <input
                            type="number"
                            name="coins"
                            value={updated.coins || ''}
                            onChange={handleChange}
                            className="block w-full mb-2 p-2 border rounded text-black"
                            placeholder="Coins"
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
                    </td>
                  </tr>
                )}
                
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {createUser && (
                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg border border-gray-300">
                    <h3 className="text-lg font-bold">Add Fournisseur</h3>
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
                        placeholder="phone Number"
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
                      <button
                        onClick={() => handleSave1()}
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
        <div className="mt-4">
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
      </div>
      <div>
        <ToastContainer />
      </div>
      {popUp && (
  <>
    {/* Overlay */}
    <div className="fixed rounded-md inset-0 bg-black bg-opacity-50 z-40" onClick={() => setPopUp(false)}></div>

    {/* Popup */}
    <div className="p-4 absolute ml-[40%] mt-[10%] w-[300px] h-[300px] bg-slate-600 flex flex-col z-50">
      <div className="flex justify-between w-full mb-2">
        <h1 className="text-white font-semibold">Dealers</h1>
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
          <p className="text-white">No dealers available.</p>
        )}
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default Dealers;
