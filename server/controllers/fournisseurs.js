// const Fournisseurs = require('../models/fournisseurs');
// const Dealers = require('../models/dealers');
// const History = require('../models/history');
const { Dealers, History, Fournisseurs, Admin } = require('../models/relations');

// Get all fournisseurs
exports.getAllFournisseurs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    const offset = (page - 1) * limit;
    const users = await Fournisseurs.findAndCountAll({
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

// Get fournisseur by ID
exports.getFournisseurById = async (req, res) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseurs.findByPk(id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }
    res.status(200).json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fournisseur', error });
  }
};


// Create new fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const { name, lastName, img, email, password, phone, coins } = req.body;

    // Check if a fournisseur with the same name already exists
    const existingFournisseur = await Fournisseurs.findOne({ where: { name } });
    
    if (existingFournisseur) {
      // If fournisseur exists, return a conflict error
      return res.status(409).json({ message: 'Fournisseur with this name already exists' });
    }

    // If no existing fournisseur, create the new one, setting coins to 0 if missing
    const newFournisseur = await Fournisseurs.create({
      name,
      lastName,
      img,
      email,
      password,
      phone,
      coins: coins || 0 // Default to 0 if coins are not provided
    });

    // Return the new fournisseur as the response
    return res.status(201).json(newFournisseur);

  } catch (error) {
    // Handle errors and send error response
    return res.status(500).json({ message: 'Error creating fournisseur', error: error.message });
  }
};

// Update fournisseur by ID
exports.updateFournisseur = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, img, email, password, phone, coins } = req.body;  // Use 'coins' instead of 'coin'
    
    // Find the fournisseur by its primary key
    const fournisseur = await Fournisseurs.findByPk(id);
    
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }

    // Update fields including coins
    await fournisseur.update({ 
      name, 
      lastName, 
      img, 
      email, 
      password, 
      phone, 
      coins   // Ensure coins are updated correctly
    });

    res.status(200).json(fournisseur);  // Return the updated fournisseur
  } catch (error) {
    res.status(500).json({ message: 'Error updating fournisseur', error });
  }
};


// Delete fournisseur by ID
exports.deleteFournisseur = async (req, res) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseurs.findByPk(id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }
    await fournisseur.destroy();
    res.status(200).json({ message: 'Fournisseur deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fournisseur', error });
  }
};

// Add coins to a dealer
exports.addCoinsToDealer = async (req, res) => {
  try {
    const { dealerId, totalcoins, fournisseurId } = req.body;

    // Check if the required fields are present in the request body
    if (!dealerId || !totalcoins || !fournisseurId) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    // Find the dealer by  ID
    const dealer = await Dealers.findByPk(dealerId);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    // Find the fournisseur by ID
    const fournisseur = await Fournisseurs.findByPk(fournisseurId);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }

    // Check if the fournisseur has enough coins to send
    if (fournisseur.coins < totalcoins) {
      return res.status(400).json({ message: 'Not enough coins' });
    }

    // Deduct the coins from the fournisseur
    fournisseur.coins -= totalcoins;
    await fournisseur.save();  // Save the updated fournisseur balance

    // Add the coins to the dealer
    dealer.coins += totalcoins;
    await dealer.save();  // Save the updated dealer balance

    // Log this transaction in the History table
    await History.create({
      totalcoins: totalcoins,
      role: 'fournisseur',           // Role performing the action
      fournisseur_id: fournisseurId, // Fournisseur ID who performed the action
      dealer_id: dealerId            // Dealer ID who received the coins
    });

    res.status(200).json({ message: 'Coins transferred successfully', fournisseur, dealer });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ message: 'Error adding coins', error: error.message });
  }
};



// Get fournisseur's history
exports.getFournisseurHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing fournisseurId' });
    }

    // Fetch the history for the given fournisseur
    const history = await History.findAll({
      where: { fournisseur_id: id },
      include: [
        { model: Fournisseurs }, // Remove alias and use the model directly
        { model: Dealers },      // Remove alias and use the model directly
      ],
    });

    if (!history.length) {
      return res.status(404).json({ message: 'No transaction history found for this Fournisseur' });
    }

    // Return the history along with the fournisseur and dealer info for each transaction
    res.status(200).json({ message: "history", history });
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).json({ message: 'Error retrieving history', error: error.message });
  }
};
exports.FournisseursLogin= async (req, res) => {
  try {
      const { password, phoneNumber } = req.body;

      // Find dealer by email
      const dealer = await Fournisseurs.findOne({ where: { phoneNumber } });

      if (!dealer) {
          return res.status(404).json({ message: 'Dealer not found' });
      }

      if (dealer.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
    }

      // If login is successful
      res.status(200).json({ message: 'Login successful', dealer });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
}