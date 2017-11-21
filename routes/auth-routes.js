const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');

const router = express.Router();

//Sign up post

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }
//if user exist
  User.findOne({ username: username }, '_id', (err, foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: 'The username already exists' });
        return;
      }

   const salt     = bcrypt.genSaltSync(10);
   const hashPass = bcrypt.hashSync(password, salt);

   const theUser = new User({
      username: username,
      password: hashPass
    });
    theUser.save((err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }
        req.login(theUser, (err) => {
          theUser.password = undefined;
        res.status(200).json(req.user);
      });
    });
  });
});


//Log in Post

router.post('/login', (req, res, next) => {
   const username = req.body.username;
   const password = req.body.password;

   // see id the username is a valid username

  User.findOne({ username: username }, (err, foundUser) => {

    if (!foundUser) {
      res.status(400).json({ message: 'Incorrect username'});
      return;
    }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    res.status(400).json({ message: 'Incorrect password'});
    return;
  }

   req.login(foundUser, (err) => {
     foundUser.password = undefined;
      res.status(200).json(foundUser);
   });

});

});

// Logout

router.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Logout Success' });
});

router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }// Checking if loged in or not

  res.status(403).json({ message: 'Unauthorized' });
});

router.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  } // If loged in, show the secret info. Otherwise show unauthorized

  res.status(403).json({ message: 'Unauthorized' });
});



module.exports = router;
