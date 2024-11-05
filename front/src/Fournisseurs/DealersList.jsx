import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FournisseursSideNav from './FournisseursSideNav';

function DealersList() {
  const [dealers, setDealers] = useState([]);
  const [error, setError] = useState(null);
  const [showAddDealerPopup, setShowAddDealerPopup] = useState(false);
  const [newDealer, setNewDealer] = useState({ name: '', lastName: '', phone: '', email: '', password: '', fournisseur_id: 1 });
  const [sendCoins, setSendCoins] = useState({ visible: false, dealerId: null, amount: '' });

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dealers/getAll');
        console.log("Fetched dealers:", response.data); // Debugging log
        setDealers(response.data);
      } catch (error) {
        console.error("Error fetching dealers:", error); // Log error details
        setError('Error fetching dealers');
      }
    };

    fetchDealers();
  }, []);

  const handleCreateDealer = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/dealers/add', newDealer);
      console.log("Dealer created:", response.data); // Debugging log
      setDealers([...dealers, response.data]);
      closeAddDealerPopup();
    } catch (error) {
      console.error("Error creating dealer:", error); // Log error details
      setError('Error creating dealer');
    }
  };

  const openAddDealerPopup = () => setShowAddDealerPopup(true);
  const closeAddDealerPopup = () => {
    setShowAddDealerPopup(false);
    resetNewDealerForm();
  };

  const openSendCoinsPopup = (id) => setSendCoins({ visible: true, dealerId: id, amount: '' });
  const closeSendCoinsPopup = () => setSendCoins({ visible: false, dealerId: null, amount: '' });

  const handleSendCoins = async (event) => {
    event.preventDefault();
    const totalcoins = parseInt(sendCoins.amount, 10);
    
    if (isNaN(totalcoins) || totalcoins < 0) {
      setError('Invalid amount. Only non-negative values are allowed.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/add-coins', {
        dealerId: sendCoins.dealerId,
        totalcoins,
        fournisseurId: 1
      });
      setDealers(dealers.map(dealer =>
        dealer.id === sendCoins.dealerId ? { ...dealer, coins: (dealer.coins || 0) + totalcoins } : dealer
      ));
      closeSendCoinsPopup();
    } catch (error) {
      console.error("Error sending coins:", error); // Log error details
      setError('Error sending coins');
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only non-negative numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setSendCoins({ ...sendCoins, amount: value });
    }
  };

  const resetNewDealerForm = () => {
    setNewDealer({ name: '', lastName: '', phone: '', email: '', password: '', fournisseur_id: 1 });
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
    <div className="flex flex-col md:flex-row ">
      <FournisseursSideNav className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10" />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto h-screen relative">
        <h1 className="text-2xl font-bold mb-4">Dealers List</h1>
        <div className="flex justify-between items-center">
          <button 
            onClick={openAddDealerPopup} 
            className=" mb-[10px] left-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center z-20"
          >
            <span className="mr-2">+</span>
            Create Dealer Account
          </button>
        </div>

        {showAddDealerPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
  <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-xs md:max-w-lg w-full">
    <h2 className="text-xl font-bold mb-4">New Dealer</h2>
    <form onSubmit={handleCreateDealer}>
      {['name', 'lastName', 'phone', 'email', 'password'].map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
            value={newDealer[field]}
            onChange={(e) => setNewDealer({ ...newDealer, [field]: e.target.value })}
            className="form-input mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
        >
          Create Dealer
        </button>
        <button 
          type="button" 
          onClick={closeAddDealerPopup} 
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {dealers.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  {['First Name', 'Last Name', 'Phone', 'Email', 'Coins', 'Actions'].map((header) => (
                    <th key={header} className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dealers.map((dealer) => (
                  <tr key={dealer.id}>
                    <td className="py-4 px-6 whitespace-nowrap">{dealer.name}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dealer.lastName}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dealer.phone}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dealer.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{dealer.coins || 0}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => openSendCoinsPopup(dealer.id)} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Send Coins
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Table */}
            <div className="block md:hidden">
              {dealers.map((dealer) => (
                <div key={dealer.id} className="border p-4 mb-4 bg-white rounded shadow">
                  <h2 className="text-lg font-bold">{`${dealer.name} ${dealer.lastName}`}</h2>
                  <p>Phone: {dealer.phone}</p>
                  <p>Email: {dealer.email}</p>
                  <p>Coins: {dealer.coins || 0}</p>
                  <button 
                    onClick={() => openSendCoinsPopup(dealer.id)} 
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send Coins
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No dealers found.</p>
        )}

        {sendCoins.visible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Send Coins</h2>
              <form onSubmit={handleSendCoins}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Amount of Coins</label>
                  <input
                    type="text"
                    value={sendCoins.amount}
                    onChange={handleAmountChange}
                    className="form-input mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                  >
                    Send
                  </button>
                  <button 
                    type="button" 
                    onClick={closeSendCoinsPopup} 
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default DealersList;
