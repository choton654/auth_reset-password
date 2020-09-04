const expressJwt = require('express-jwt');
const User = require('../model/Users');

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
  algorithms: ['HS256'],
});

exports.adminMiddleware = (req, res, next) => {
  console.log('admin middleware', req.user);
  User.findById({ _id: req.User._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource. Access denied',
      });
    }

    req.profile = user;
    next();
  });
};
