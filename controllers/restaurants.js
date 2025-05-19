const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const categories = require('../utils/categories');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
// router.use(ensureLoggedIn);

// ALL paths start with '/restaurants'

// Index action
// GET /restaurants
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.cost) {
    filter.cost = req.query.cost;
  }
  const restaurants = await Restaurant.find(filter);
  res.render('restaurants/index.ejs', { 
    restaurants, 
    categories,
    selectedCategory: req.query.category || '',
    selectedCost: req.query.cost || ''
  });
});

// New action
// GET /restaurants/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('restaurants/new.ejs', { categories });
});

//Create action
// POST /restaurants
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    await Restaurant.create(req.body);
    res.redirect('/restaurants');
  } catch (err) {
    console.log(err);
    res.redirect('restaurants/new');
  }
});

module.exports = router;