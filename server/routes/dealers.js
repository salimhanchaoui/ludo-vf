const dealersRoutes=require('express').Router()
const dealerController=require('../controllers/dealers')
//fetch all dealers data
dealersRoutes.get('/getAllDealers',dealerController.getAllDealers)
dealersRoutes.get('/dealers/:id', dealerController.getDealerById);
//add a dealer
dealersRoutes.post('/addDealer',dealerController.addDealer)
//update dealer data
dealersRoutes.put('/updateDealer/:id',dealerController.updateDealer)
//delete a dealer
dealersRoutes.delete('/deleteDealer/:id',dealerController.deleteDealer)
// get dealers related to one fournisseur
dealersRoutes.get('/getDealersRelatedToFournisseur/:id',dealerController.getDealersRelatedToOneFournisseur)
dealersRoutes.put('/dealers/addCoins/:dealerId', dealerController.addDealerCoinsWithFee);
dealersRoutes.put('/dealers/edit-coins/:dealerId', dealerController.decreaseDealerCoins);
dealersRoutes.post('/dealerLogin',dealerController.DealerLogin)
module.exports=dealersRoutes