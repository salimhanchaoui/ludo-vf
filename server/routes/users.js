const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// Get all users for a specific dealer
router.get('/users/getAll', usersController.getAllUsers);

// Get user by ID
router.get('/users/:id', usersController.getUserById);

// Create a new user
router.post('/users/:name', usersController.createUser);

// Update user by ID
router.put('/users/edit-info/:id', usersController.editUserInfo);

// Edit user coins
router.put('/users/edit-coins/:id', usersController.editUserCoins);
router.put('/users/decrease-coins/:userId', usersController.decreaseUserCoins);
// Delete user by ID
router.delete('/users/:id', usersController.deleteUser);
//get users realted to dealer
router.get('/users/getUsersRelatedToDealer/:id', usersController.getUsersRelatedToDealer);

module.exports = router;