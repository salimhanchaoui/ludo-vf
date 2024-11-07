const History = require('../models/history');
const Dealers = require('../models/dealers');
const Users = require('../models/users');
const Fournisseurs = require('../models/fournisseurs');
const { Op } = require('sequelize');
const sequelize = require('../db/index'); // Import Sequelize instance

// Create a new history entry

const createHistoryEntry = async (req, res) => {
  try {
    const { totalcoins, role, dealer_id, user_id,fournisseur_id, admin_id,user_id2 } = req.body;
    const newHistory = await History.create({
      totalcoins,
      role,
      dealer_id,
      user_id,
      user_id2,
      admin_id,
      fournisseur_id
    });
    if (newHistory) return res.status(200).json('created')
    return res.status(404).json('internal server error')
  } catch (error) {
    console.error('Error creating history entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all history entries with dealer and user details
const getAllHistoryEntriesOfFournisseurs = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        { model: Dealers },  // Include dealer details
        { model: Users,as: 'PrimaryUser', foreignKey: 'user_id' },    // Include user details
        { model: Fournisseurs },    // Include user details
      ],
      order: [['createdAt', 'DESC']],
      where:{role:'fournisseur'}
    });

    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAll = async (req, res) => {
  try {
    const histories = await History.findAll({ });

    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllHistoryEntriesOfDealers = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        { model: Dealers },  // Include dealer details
        { model: Users, as: 'PrimaryUser', foreignKey: 'user_id'},    // Include user details
        { model: Fournisseurs },    // Include user details
      ],
      order: [['createdAt', 'DESC']],
      where:{role:'dealer'}
    });

    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllHistoryEntriesOfUsers = async (req, res) => {
  try {
    const histories = await History.findAll({
      include: [
        { model: Users, as: 'PrimaryUser', foreignKey: 'user_id' },   // For the 'user_id' field
        { model: Users, as: 'SecondaryUser', foreignKey: 'users_id' }   
      ],
      order: [['createdAt', 'DESC']],
      where:{role:'user'},
      
    });
    
    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getLast = async (req, res) => {
  try {
    const histories = await History.findOne({order: [['createdAt', 'DESC']]});
    
    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteHistUser=async(req,res)=>{
  try {
    const histories = await History.destroy({where:{user_id:req.params.id}});
    if (histories) return  res.status(200).json('deleted');
    return res.status(404).json('something went wrong')
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const deleteHistFournisseur=async(req,res)=>{
  try {
    const histories = await History.destroy({where:{fournisseur_id:req.params.id}});
    if (histories) return  res.status(200).json('deleted');
    return res.status(404).json('something went wrong')
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const deleteHistDealer=async(req,res)=>{
  try {
    const histories = await History.destroy({where:{dealer_id:req.params.id}});
    if (histories) return  res.status(200).json('deleted');
    return res.status(404).json('something went wrong')
  } catch (error) {
    console.error('Error fetching history entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const getTransactionsByMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();

    currentDate.setMonth(currentDate.getMonth() +1);
    sixMonthsAgo.setMonth(currentDate.getMonth() -5);

    // Query the database for transactions between six months ago and now
    const transactions = await History.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'], // Group by year and month
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'], // Count the transactions per month
      ],
      where: {
        createdAt: {
          [Op.between]: [sixMonthsAgo, currentDate], // Between the last 6 months and now
        },
      },
      group: ['month'], // Group the results by month
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']], // Order by ascending date
    });

    // Format the response to send back totals for each month
    var t;
    const formattedData = transactions.map(transaction => ({
      month: parseInt(transaction.get('month').split('-')[1]),
      totalTransactions: transaction.get('totalTransactions'),
    }));
    const last=formattedData[0]
    
    
    date=parseInt(last.month)-1
    while(formattedData.length<6){
      formattedData.push({totalTransactions:0,month:date})
      date--
      if (date===1){
        date=12
      }
    }
    formattedData.sort((a,b)=>{
      return a.month-b.month
    })
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'An error occurred while fetching transactions' });
  }
};
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
  
  getAllHistoryEntriesOfFournisseurs,
  getAllHistoryEntriesOfDealers,
  getAllHistoryEntriesOfUsers,
  getAll,
  getLast,
  deleteHistDealer,
  deleteHistFournisseur,
  deleteHistUser,
  getTransactionsByMonth,
  getAllHistoryEntries
};