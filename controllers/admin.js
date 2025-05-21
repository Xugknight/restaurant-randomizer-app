const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const ensureAdmin   = require('../middleware/ensure-admin');

router.use(ensureLoggedIn, ensureAdmin);

// All paths start with '/admin'

// Index
// GET /admin/delete-requests
router.get('/delete-requests', async (req, res) => {
    const pendingDelete = await Restaurant.find({ requestDelete: true });
    res.render('admin/delete-requests.ejs', { pendingDelete });
});

module.exports = router;