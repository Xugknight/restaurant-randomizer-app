const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const restaurant = require('../models/restaurant');

// Index
// GET /favorites
router.get('/', ensureLoggedIn, async (req, res) => {
    const favorites = await Favorite.find({ user: req.user._id }).populate('restaurant');
    const favoriteRestaurants = favorites.map((favorite) => favorite.restaurant);
    res.render('favorites/index.ejs', { favoriteRestaurants });
});

// Random Favorites
// GET /favorites/random
router.get('/random', ensureLoggedIn, async (req, res) => {
    const favorites = await Favorite.find({ user: req.user._id }).populate('restaurant');
    const favoriteRestaurants = favorites.map((favorite) => favorite.restaurant);
    if (favoriteRestaurants.length === 0) {
        return res.redirect('/favorites');
    }
    const randomIndex = Math.floor(Math.random() * favoriteRestaurants.length);
    const randomRestaurant = favoriteRestaurants[randomIndex];
    res.render('favorites/random.ejs', { restaurant: randomRestaurant });
});

// Favorite
// POST /favorites/:restaurantId
router.post('/:restaurantId', ensureLoggedIn, async (req, res) => {
    try {
        await Favorite.create({
        user: req.user._id,
        restaurant: req.params.restaurantId
    });
    } catch (err) {
        if (err.code !== 11000) {
        console.log(err);
        }
    }
    res.redirect(`/restaurants/${req.params.restaurantId}`);
});

// Unfavorite
// DELETE /favorites/:restaurantId
router.delete('/:restaurantId', ensureLoggedIn, async (req, res) => {
    await Favorite.findOneAndDelete({
        user: req.user._id,
        restaurant: req.params.restaurantId
    });
    res.redirect(`/restaurants/${req.params.restaurantId}`);
});

module.exports = router;