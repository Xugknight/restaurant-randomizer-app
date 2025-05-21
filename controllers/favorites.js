const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const restaurant = require('../models/restaurant');

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