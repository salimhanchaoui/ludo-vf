import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DealerHome from './Dealer/DealerHome';
import Userslist from './Dealer/Userslist';
import TransactionHist1 from './Dealer/TransactionHist';
import TransactionHist from './Fournisseurs/TransactionHist';
import DealersList from './Fournisseurs/DealersList';
import FournisseursDashboard from './Fournisseurs/FournisseursDashboard';
import LoginDealer from './LoginDealer';
import LoginFournisseur from './LoginFournisseur';
import ChooseLogin from './ChooseLogin';
import DealerHome2 from './Admin/DealerHome';
import Userslist2 from './Admin/Userslist';
import TransactionHist2 from './Admin/TransactionHist';
import Fournisseurs from './Admin/Fournisseurs';
import Dealers from './Admin/Dealers';
import Rooms from './Admin/Rooms';
import FourHist from './Admin/FourHist';
import DealerHist from './Admin/DealerHist';
import UserHist from './Admin/UserHist';
function App() {
  return (
    <Router>
    <div className="App">
      {/* Assuming this component handles navigation links */}
      <Routes>
        <Route path="/Dealer-dashboard" element={ <DealerHome/>} />
        <Route path="/users-list" element={ <Userslist/>} />
        <Route path="/transaction-history-dealer" element={ <TransactionHist1/>} />
        <Route path="/Fournisseur-dashboard" element={ <FournisseursDashboard/>} />
        <Route path="/transaction-history-fournisseur" element={ <TransactionHist/>} />
        <Route path="/DealersList" element={ <DealersList/>} />
        <Route path="/" element={ <ChooseLogin/>} />
        <Route path="/Login-dealer" element={ <LoginDealer/>} />
        <Route path="/login-fournisseur" element={ <LoginFournisseur/>} />
        <Route path="/Admin-dashboard" element={ <DealerHome2/>} />
        <Route path="/users" element={ <Userslist2/>} />
        <Route path="/fournisseurs" element={ <Fournisseurs/>} />
        <Route path="/dealers" element={ <Dealers/>} />
        <Route path="/rooms" element={ <Rooms/>} />
        <Route path="/transaction-history" element={ <TransactionHist2/>} />
        <Route path="/fournisseur-history" element={ <FourHist/>} />
        <Route path="/dealer-history" element={ <DealerHist/>} />
        <Route path="/user-history" element={ <UserHist/>} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
