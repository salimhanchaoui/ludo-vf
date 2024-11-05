const History = require('../models/history');
const Dealers = require('../models/dealers');
const Users = require('../models/users');

// Create a new history entry
// Create a new history entry
const createHistoryEntry = async (req, res) => {
  try {
    const { totalcoins, role, dealer_id, user_id } = req.body;

    // Check if dealer and user exist
    const dealer = await Dealers.findByPk(dealer_id);
    const user = await Users.findByPk(user_id);

    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the new history entry
    const newHistory = await History.create({
      totalcoins,
      role,
      dealer_id,
      user_id,
      date: new Date(), // Automatically set the date as current date/time
    });

    // Fetch the new history with included dealer and user models
    const historyWithDetails = await History.findByPk(newHistory.id, {
      include: [
        { model: Dealers },  // Include dealer details
        { model: Users },    // Include user details
      ],
    });

    res.status(201).json(historyWithDetails);
  } catch (error) {
    console.error('Error creating history entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all history entries with dealer and user details
const getAllHistoryEntries = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        { model: Dealers },  // Include dealer details
        { model: Users, as: 'PrimaryUser', foreignKey: 'user_id' },    // Include user details
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createHistoryEntry,
  getAllHistoryEntries,
};