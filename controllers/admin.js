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

// Approve
// PUT /admin/delete-requests/:id/approve
router.put('/delete-requests/:id/approve', async (req, res) => {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.redirect('/admin/delete-requests');
});

// Reject
// PUT /admin/delete-requets/:id/reject
router.put('/delete-requests/:id/reject', async (req, res) => {
    await Restaurant.findByIdAndUpdate(req.params.id, { requestDelete: false });
    res.redirect('/admin/delete-requests');
});

module.exports = router;