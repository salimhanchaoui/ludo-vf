const Dealers = require('../models/dealers');
const Users = require('../models/users');

// Get all users for a specific dealer

exports.getAllUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  
      const offset = (page - 1) * limit;
      const users = await Users.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
  
      const totalPages = Math.ceil(users.count / limit);
  
      res.json({
        users: users.rows,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const dealer=await Dealers.findOne({where:{name:req.params.name}})
    const user = await Users.create({...req.body,dealer_id:dealer.id});
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
exports.editUserInfo = async (req, res) => {
  const { id } = req.params;
  const { name, lastName, phone, email,coins } = req.body;

  try {
    const [updated] = await Users.update(
      { name, lastName, phone, email,coins },
      { where: { id } }
    );

    if (updated) {
      const updatedUser = await Users.findOne({ where: { id } });
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user info' });
  }
};
exports.editUserCoins = async (req, res) => {
  const { id } = req.params;
  const { coinsToAdd } = req.body;

  try {
    // Fetch the current user
    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the coins to the existing balance
    const newCoinBalance = user.coins + coinsToAdd;

    // Update the user's coin balance
    const [updated] = await Users.update(
      { coins: newCoinBalance },
      { where: { id } }
    );

    if (updated) {
      const updatedUser = await Users.findOne({ where: { id } });
      res.status(200).json({ message: 'User coins updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user coins' });
  }
};

exports.decreaseUserCoins = async (req, res) => {
  const { amount } = req.body;
  const { userId } = req.params;

  try {
    // Find the user
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the user has enough coinsa
    if (user.coins < amount) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Update the user's coin balance by subtracting the full amount
    user.coins -= amount;
    await user.save();

    res.status(200).json({ message: 'Coins deducted successfully', user });
  } catch (error) {
    console.error('Error decreasing user coins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await Users.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUsersRelatedToDealer = async (req, res) => {
  try {
    const deleted = await Users.findAll({
      where: { dealer_id: req.params.id }
    });
    if (deleted) {
      res.status(200).json(deleted);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};