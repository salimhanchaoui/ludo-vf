const Users = require("../models/users")

module.exports={
    addKills: async (req, res) => {
        try {
          // Fetch the user by ID first
          const user = await Users.findOne({ where: { id: req.params.id } });
      
          // Check if user exists
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Increment kills by 1
          const updatedKills = user.kills + 1;
      
          // Update the user with the new kills value
          const updatedUser = await Users.update(
            { kills: updatedKills },
            { where: { id: req.params.id } }
          );
      
          // Check if update was successful
          if (updatedUser[0] > 0) {
            return res.status(200).json('Kills updated successfully');
          } else {
            return res.status(400).json('Failed to update kills');
          }
      
        } catch (error) {
          // Handle errors and send error response
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      }
,      
addGamesPlayed: async (req, res) => {
    try {
      // Fetch the user by ID first
      const user = await Users.findOne({ where: { id: req.params.id } });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Increment gamesPlayed by 1
      const updatedGamesPlayed = user.gamesPlayed + 1;
  
      // Update the user with the new gamesPlayed value
      const updatedUser = await Users.update(
        { gamesPlayed: updatedGamesPlayed },
        { where: { id: req.params.id } }
      );
  
      // Check if update was successful
      if (updatedUser[0] > 0) {
        return res.status(200).json('Games played updated successfully');
      } else {
        return res.status(400).json('Failed to update games played');
      }
  
    } catch (error) {
      // Handle errors and send error response
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  ,
  addVictories: async (req, res) => {
    try {
      // Fetch the user by ID first
      const user = await Users.findOne({ where: { id: req.params.id } });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Increment victories by 1
      const updatedVictories = user.victories + 1;
  
      // Update the user with the new victories value
      const updatedUser = await Users.update(
        { victories: updatedVictories },
        { where: { id: req.params.id } }
      );
  
      // Check if update was successful
      if (updatedUser[0] > 0) {
        return res.status(200).json('Victories updated successfully');
      } else {
        return res.status(400).json('Failed to update victories');
      }
  
    } catch (error) {
      // Handle errors and send error response
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  ,
  addDefeats: async (req, res) => {
    try {
      // Fetch the user by ID first
      const user = await Users.findOne({ where: { id: req.params.id } });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Increment defeats by 1
      const updatedDefeats = user.defeats + 1;
  
      // Update the user with the new defeats value
      const updatedUser = await Users.update(
        { defeats: updatedDefeats },
        { where: { id: req.params.id } }
      );
  
      // Check if update was successful
      if (updatedUser[0] > 0) {
        return res.status(200).json('Defeats updated successfully');
      } else {
        return res.status(400).json('Failed to update defeats');
      }
  
    } catch (error) {
      // Handle errors and send error response
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  ,
  addDeaths: async (req, res) => {
    try {
      // Fetch the user by ID first
      const user = await Users.findOne({ where: { id: req.params.id } });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Increment deaths by 1
      const updatedDeaths = user.deaths + 1;
  
      // Update the user with the new deaths value
      const updatedUser = await Users.update(
        { deaths: updatedDeaths },
        { where: { id: req.params.id } }
      );
  
      // Check if update was successful
      if (updatedUser[0] > 0) {
        return res.status(200).json('Deaths updated successfully');
      } else {
        return res.status(400).json('Failed to update deaths');
      }
  
    } catch (error) {
      // Handle errors and send error response
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  ,
  addLvl: async (req, res) => {
    try {
        const user = await Users.findOne({ where: { id: req.params.id } });
        const lvl=user.level+1
      // Validate that the level is provided
      
  
      // Update the user's level
      const updatedUser = await Users.update(
        { level: lvl },
        { where: { id: req.params.id } }
      );
  
      // Check if update was successful
      if (updatedUser[0] > 0) {
        return res.status(200).json('Level updated successfully');
      } else {
        return res.status(400).json('Failed to update level');
      }
  
    } catch (error) {
      // Handle errors and send error response
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  ,
  transformFromCoinsToDiamonds:async(req,res)=>{
    try {
        const user = await Users.findOne({ where: { id: req.params.id } });

        const coins=user.coins
        const diamonds=user.diamonds
        if (user&&coins>=req.body.coins){
            const data1=await Users.update({diamonds:diamonds+(req.body.coins/1000)},{where:{id:req.params.id}})
            const data=await Users.update({coins:coins-req.body.coins},{where:{id:req.params.id}})
            if (data&&data1) return res.status(200).json({msg:true})
        }
        else{
            
            return res.status(404).json({msg:false})
        }
        
    } catch (e) {
        res.status(500).json('inetranl server error')
    }
  
  },
  transfertCoinsToAnotherUser:async(req,res)=>{
    try {
        const user = await Users.findOne({ where: { id: req.params.id } });
        const {idReciever}=req.body
        const user2 = await Users.findOne({ where: { id: idReciever } });
        const coins=user.coins
        const coins1=user2.coins
        if (user&&coins>=req.body.coinsTransfered){
            const data1=await Users.update({coins:coins-req.body.coinsTransfered},{where:{id:req.params.id}})
            const data=await Users.update({coins:coins1+req.body.coinsTransfered},{where:{id:idReciever}})
            if (data&&data1) return res.status(200).json({msg:true})
        }
        else{
            
            return res.status(404).json({msg:false})
        }
        
    } catch (e) {
        res.status(500).json('inetranl server error')
    }
  
  
  },
  checkUserGamesPlayed:async(req,res)=>{
    try {
        const data=await Users.findOne({where:{id:req.params.id}})
        const gamesPlayed=data.gamesPlayed
        if (data&&gamesPlayed){
            return res.status(200).json({msg:true})
        }
        else{
            
            return res.status(404).json({msg:false})
        }
        
    } catch (e) {
        res.status(500).json('inetranl server error')
    }
  }
}