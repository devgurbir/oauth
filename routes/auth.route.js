const express = require('express')
const router = express.Router()
const passport = require("passport")
const {newToken} = require("../utils/token")

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    const token = newToken(req.user)
    res.status(200).json({success: true, token})
    res.redirect('/');
  });

module.exports = router