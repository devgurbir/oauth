const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connect = require('./config/db')
const userRouter = require('./routes/user.route')
const postRouter = require('./routes/post.route')
const {signUp, signIn} = require("./controllers/user.controller");
const protect = require('./middlewares/protect');
const passport = require('./utils/passport');

const authRouter = require("./routes/auth.route")
const MongoStore = require("connect-mongo")
const session = require('express-session')
const app = express();
app.use(express.json())
app.use(cors());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: "mongodb://localhost:27017/users"
  })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

app.use("/users", protect, userRouter)

app.post("/signup", signUp)

app.get('/signin', signIn)

app.use("/auth", authRouter)

app.use('/posts', postRouter)

const start = async () => {
    await connect();

    app.listen("5000", () => {
        console.log("Listening to port 5000")
    })
}

module.exports = start