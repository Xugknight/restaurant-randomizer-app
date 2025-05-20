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
  const filter = { requestDelete: false };
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

// Create action
// POST /restaurants
router.post('/', ensureLoggedIn, async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    await Restaurant.create(req.body);
    res.redirect('/restaurants');
  } catch (err) {
    console.log(err);
    res.redirect('/restaurants/new');
  }
});

// Randomizer
// GET /restaurants/random
router.get('/random', async (req, res) => {
  const selectedCategories = [].concat(req.query.category || []);
  const selectedCosts = [].concat(req.query.cost || []);

  const filter = { requestDelete: false };
  if (selectedCategories.length > 0) {
    filter.category = { $in: selectedCategories };
  }
  if (selectedCosts.length > 0) {
    filter.cost = { $in: selectedCosts };
  }

  const count = await Restaurant.countDocuments(filter);
  if (count === 0) return res.redirect('/restaurants');

  const randomIndex = Math.floor(Math.random() * count);
  const randomRestaurant = await Restaurant.findOne(filter).skip(randomIndex);

  res.render('restaurants/random.ejs', {
    restaurant: randomRestaurant,
    categories,
    costs: ['$', '$$', '$$$'],
    selectedCategories,
    selectedCosts
  });
});

// Show action
// GET /restaurants/:id
router.get('/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('createdBy');
  res.render('restaurants/show.ejs', { restaurant });
});

// Edit action
//GET /restaurants/:id/edit
router.get('/:id/edit', ensureLoggedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant.createdBy.equals(req.user._id)) {
    res.send('You cannot do that');
  }
  res.render('restaurants/edit.ejs', { restaurant, categories });
});

// Update action
// PUT /restaurants/:id
router.put('/:id', ensureLoggedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant.createdBy.equals(req.user._id)) {
    res.send('You cannot do that');
  }
  restaurant.name = req.body.name;
  restaurant.category = req.body.category;
  restaurant.cost = req.body.cost;
  restaurant.description = req.body.description;
  await restaurant.save();
  res.redirect(`/restaurants/${restaurant._id}`);
});

// Delete action
// DELETE /restaurants/:id
router.put('/:id/request-delete', ensureLoggedIn, async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant.createdBy.equals(req.user._id)) {
    res.send('You cannot do that');
  }
  restaurant.requestDelete = true;
  await restaurant.save();
  res.redirect(`/restaurants/${restaurant._id}`);
});

//TODO
/*
work on admin view to approve deletions
make reviews
make favorites
randomize favorites?
make sure no dupes in DB
*/

module.exports = router;