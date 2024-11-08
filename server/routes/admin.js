const adminRouter=require('express').Router()
const adminController=require('../controllers/admin')
adminRouter.post('/adminLogin',adminController.getAdmin)


module.exports=adminRouter