const express = require('express');
const router = express.Router();
const fournisseursController = require('../controllers/fournisseurs');

// Get all fournisseurs
router.get('/allFournisseur', fournisseursController.getAllFournisseurs);

// Get fournisseur by ID
router.get('/getOneFournisseur/:id', fournisseursController.getFournisseurById);

// Create new fournisseur
router.post('/addNewFournisseur', fournisseursController.createFournisseur);

// Update fournisseur by ID
router.put('/updateFournisseur/:id', fournisseursController.updateFournisseur);

// Delete fournisseur by ID
router.delete('/deleteFournisseur/:id', fournisseursController.deleteFournisseur);

// Route to add coins to a dealer
router.post('/add-coins', fournisseursController.addCoinsToDealer);


// Route to get fournisseur history
router.get('/transaction-history/:id', fournisseursController.getFournisseurHistory);
// get the dealers eli marboutin m3a  fournisseurs
router.get('/getAllDealers/:id', fournisseursController.getFournisseurHistory);
router.post('/fournisseurLogin', fournisseursController.FournisseursLogin);

module.exports = router;