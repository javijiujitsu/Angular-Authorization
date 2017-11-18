const passport = require('passport');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');

passport.serializeUser((loggedInUser, cb) => {
   cb(null, loggedInUser._id);
 });

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
     return;
    }

    cb (null, userDocument);
  });
});
