const Rooms=require('../models/rooms')
module.exports={
    getAllRooms:async(req,res)=>{
        try {
            const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
        
            const offset = (page - 1) * limit;
            const users = await Rooms.findAndCountAll({
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
    addRoom:async(req,res)=>{
        try {
            const data=await Rooms.create(req.body)
            if (data) return res.status(200).json('created')
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },
    updateRoom:async(req,res)=>{
        try {
            const data=await Rooms.update(req.body,{where:{id:req.params.id}})
            if (data) return res.status(200).json('updated')
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },
    deleteRoom:async(req,res)=>{
        try {
            const data=await Rooms.destroy({where:{id:req.params.id}})
            if (data) return res.status(200).json('updated')
            return res.status(404).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    },
}