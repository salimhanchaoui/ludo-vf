const Admin=require('../models/admin')
module.exports={
    getAdmin:async(req,res)=>{
        try {
            const data=await Admin.findOne({where:{email:req.body.email}})
            if (data&&data.password===req.body.password){
                return res.status(200).json({message:'true'})
            }
            return res.status(400).json('something went wrong')
            
        } catch (e) {
            res.status(500).json('internal server error')
        }
    }
}