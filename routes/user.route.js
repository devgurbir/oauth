const {getUsers, signUp, signIn} = require("../controllers/user.controller")
const express = require('express');

const router = express.Router();

router.get("/", getUsers)



module.exports = router;