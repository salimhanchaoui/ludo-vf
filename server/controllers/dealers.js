const Dealer=require('../models/dealers')
const Fournisseur=require('../models/fournisseurs')
module.exports={
    getAllDealers:async(req,res)=>{
        try {
            const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
        
            const offset = (page - 1) * limit;
            const users = await Dealer.findAndCountAll({
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
        
      
    },
    addDealer: async (req, res) => {
        try {
            // Check if a dealer with the same name already exists

            const fournisseur=await Fournisseur.findOne({ where: { name: req.body.fournisseurName } });
            if (!fournisseur){
              return res.status(400).json({message:"Fournisseur Name doesn't exist"})
            }
            // If the dealer does not exist, create the new dealer
            const newDealer = await Dealer.create({...req.body,fournisseur_id:fournisseur.id});
            
            if (newDealer) {
                return res.status(200).json({ message: 'Dealer created successfully' });
            }
    
            return res.status(400).json({ message: 'Something went wrong while creating the dealer' });
        } catch (e) {
            // Handle any other errors
            return res.status(500).json({ message: 'Internal server error', error: e.message });
        }
    },
    
    updateDealer:async(req,res)=>{
        try {
            const data=await Dealer.update(req.body,{where:{id:req.params.id}})
            if (data) return res.status(200).json('updated')
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },
    deleteDealer:async(req,res)=>{
        try {
            const data=await Dealer.destroy({where:{id:req.params.id}})
            if (data) return res.status(200).json('updated')
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },
    getDealersRelatedToOneFournisseur:async(req,res)=>{
        try {
            const data=await Dealer.findAll({where:{fournisseur_id:req.params.id}})
            if (data) return res.status(200).json(data)
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },addDealerCoinsWithFee : async (req, res) => {
        const { amount } = req.body;
        const { dealerId } = req.params;
      
        try {
          // Find the dealer
          const dealer = await Dealer.findByPk(dealerId);
          if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
          }
      
          // Calculate the fee percentage
          const feePercentage = parseFloat(dealer.fee);
          if (isNaN(feePercentage) || feePercentage < 0 || feePercentage > 100) {
            return res.status(400).json({ message: 'Invalid fee percentage' });
          }
      
          // Calculate the actual amount after subtracting the fee
          const amountAfterFee = amount - (amount * feePercentage / 100);
      
          // Add the amount after fee to dealer's coins
          dealer.coins += amountAfterFee;
          await dealer.save();
      
          res.status(200).json({ message: 'Coins added to dealer successfully', dealer });
        } catch (error) {
          console.error('Error adding coins to dealer:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },decreaseDealerCoins: async (req, res) => {
        const { amount } = req.body;
        const { dealerId } = req.params;
      
        try {
          // Find the dealer by ID
          const dealer = await Dealer.findByPk(dealerId);
          if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
          }
      
          // Ensure the dealer has enough coins to decrease
          if (dealer.coins < amount) {
            return res.status(400).json({ message: 'Insufficient coins' });
          }
      
          // Decrease the dealer's coins by the specified amount
          dealer.coins -= amount;
          await dealer.save();
      
          // Return success message with the updated dealer information
          res.status(200).json({ message: 'Coins decreased successfully', dealer });
        } catch (error) {
          console.error('Error decreasing coins for dealer:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },getDealerById : async (req, res) => {
        try {
          const dealer = await Dealer.findByPk(req.params.id);
          if (dealer) {
            res.status(200).json(dealer);
          } else {
            res.status(404).json({ message: 'Dealer not found' });
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },DealerLogin: async (req, res) => {
        try {
            const { password, phoneNumber } = req.body;
    
            // Find dealer by email
            const dealer = await Dealer.findOne({ where: { phoneNumber } });
    
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
      
    
}