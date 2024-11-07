const express = require('express');
const routerHist = express.Router();
const { createHistoryEntry,getAll,getLast,getAllHistoryEntries, getAllHistoryEntriesOfFournisseurs,getAllHistoryEntriesOfDealers,getAllHistoryEntriesOfUsers, deleteHistUser, deleteHistDealer, deleteHistFournisseur, getTransactionsByMonth } = require('../controllers/historyController');

// Route to create a new history entry
routerHist.post('/history', createHistoryEntry);
routerHist.get('/history', getAllHistoryEntries);
routerHist.get('/history/getLast', getLast);

// Route to get all history entries
routerHist.get('/history/fournisseur', getAllHistoryEntriesOfFournisseurs);
routerHist.get('/history/dealer', getAllHistoryEntriesOfDealers);
routerHist.get('/history/user', getAllHistoryEntriesOfUsers);
routerHist.get('/history/transaction', getTransactionsByMonth);
routerHist.delete('/delhistory/user/:id', deleteHistUser);
routerHist.delete('/delhistory/dealer/:id', deleteHistDealer);
routerHist.delete('/delhistory/fournisseur/:id', deleteHistFournisseur);

module.exports = routerHist;
