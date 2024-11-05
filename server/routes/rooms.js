const roomRouter=require('express').Router()
const roomController=require('../controllers/rooms')
roomRouter.post('/addRoom',roomController.addRoom)
roomRouter.get('/getRooms',roomController.getAllRooms)
roomRouter.delete('/deleteRoom/:id',roomController.deleteRoom)
roomRouter.put('/updateRoom/:id',roomController.updateRoom)

module.exports=roomRouter