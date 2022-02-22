const mongoose = require('mongoose');
const User = require("../models/user.model");
const {newToken} = require("../utils/token")

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password -__v").lean();
        if(!users){
            return res.status(404).send({status: "failed", msg: "No users found"})
        }

        res.status(200).send({status: "success", data: users})
    } catch (err) {
        return res.status(500).send({status: "failed", msg: "something went wrong: " + err })
    }
}

const signUp = async (req, res) => {
    try {
        const user = await User.create({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        })

        if(!user){
            return res.status(400).send({msg: "User not created"})
        }

        console.log(user)

        const token = newToken(user)

        console.log(token)

        res.status(201).send({status: "Successful", user: user, token: token})

    } catch (err) {
        return res.status(500).send({status: "failed", msg: "something went wrong: " + err })
    }

    
}

const signIn = async (req, res) => {
    let user;
    try {
        // Do a find with the email
        user = await User.findOne({email: req.body.email});
        // Check if user exists (if not, return error)
        if(!user){
            return res.status(400).send({status: "failed", msg: "Invalid email/password"})
        }
    } catch (err) {
        return res.status(500).send({status: "failed", msg: "something went wrong: " + err })
    }
    
    // If it does, check if passwords match - Use the method checkPass set on userSchema, which
    //  -- utilizes bcrypt.compare
    try {
        const isMatch = await user.checkPassword(req.body.password)
        console.log("isMatch: ", isMatch);
    // if passwords don't match, return error.
        if(!isMatch){
            return res.status(400).send({status: "failed", msg: "Invalid email/password"}) 
        }
    } catch (error) {
        return res.status(500).send({status: "failed", msg: "something went wrong: " + err })
    }

    // generate token and send it as response
    const token = newToken(user);
    res.status(200).send({status: "success", data: user, token: token})
}

module.exports = {getUsers, signUp, signIn}