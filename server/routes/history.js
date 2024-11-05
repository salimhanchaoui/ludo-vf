const express = require('express');
const router = express.Router();
const { createHistoryEntry, getAllHistoryEntries } = require('../controllers/historyController');

// Route to create a new history entry
router.post('/history', createHistoryEntry);

// Route to get all history entries
router.get('/history', getAllHistoryEntries);

module.exports = router;
