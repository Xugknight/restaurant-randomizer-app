const User = require('../models/user');
const Favorite = require('../models/favorite');

module.exports = async function (req, res, next) {
  req.user = req.session.userId ? await User.findById(req.session.userId) : null;
  res.locals.user = req.user;

  if (req.user) {
    const favorites = await Favorite.find({ user: req.user._id });
    res.locals.favoriteIds = favorites.map((favorite) => favorite.restaurant.toString());
  } else {
    res.locals.favoriteIds = [];
  }

  next();
};