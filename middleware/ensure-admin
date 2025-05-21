module.exports = function (req, res, next) {
    if (req.user && req.user.isAdmin) return next();
    res.send('You Cannot Do That');
};