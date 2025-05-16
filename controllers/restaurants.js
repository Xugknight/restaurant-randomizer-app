const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
// router.use(ensureLoggedIn);

// ALL paths start with '/restaurants'

// Index action
// GET /restaurants
router.get('/', (req, res) => {
  res.render('index.ejs');
});

// GET /restaurants/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a restaurant!');
});

module.exports = router;