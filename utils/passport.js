
const passport = require('passport');
const User = require('../models/user.model')
const mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    // const user = await User.findOne({email: profile?._json?.email});
    // if(user){
      
    // }
    // console.log(profile)
    User.create({ googleId: profile.id,
      name: profile?._json?.name,
      _id: new mongoose.Types.ObjectId(),
      email: profile?._json?.email }, function (err, user) {
      return cb(err, user);
    });
  }
));

module.exports = passport