const userGameRouter=require('express').Router()
const userGameController=require('../controllers/usergame')
userGameRouter.put('/kill/:id',userGameController.addKills)
userGameRouter.put('/death/:id',userGameController.addDeaths)
userGameRouter.put('/victories/:id',userGameController.addVictories)
userGameRouter.put('/defeates/:id',userGameController.addDefeats)
userGameRouter.put('/lvl/:id',userGameController.addLvl)
userGameRouter.put('/gamesPlayed/:id',userGameController.addGamesPlayed)
userGameRouter.get('/checkGamesPlayed/:id',userGameController.checkUserGamesPlayed)
userGameRouter.post('/transform/:id',userGameController.transformFromCoinsToDiamonds)
userGameRouter.post('/transfert/:id',userGameController.transfertCoinsToAnotherUser)


module.exports=userGameRouter
