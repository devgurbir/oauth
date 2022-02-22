const express = require('express');
const router = express.Router();
const Post = require("../models/post.model")
const authenticated = require('../middlewares/authenticated');
const User = require('../models/user.model');

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({});
        if(!posts){
            return res.status(404).json({msg: "No posts found"})
        }
        return res.status(200).json({msg: "Success", posts})
    } catch (error) {
        return res.status(500).json({msg: "Something wen't wrong: ", error})
    }
})
// Create
router.post('/create', authenticated, async (req, res) => {
    console.log("REQ USER: ", req.user)
    try {
        const post = await Post.create({
            title: req.body.title,
            author_id: req.body.author_id
        });

        if(!post){
            return res.status(404).json({msg: "Something wen't wrong, post not created"})
        }
        return res.status(201).json({msg: "Success", post})

    } catch (error) {
        return res.status(500).json({msg: "Something wen't wrong: ", error})
    }
})


// Delete
router.delete('/delete', authenticated,  async (req, res) => {
    console.log(req.user)
    const post = await Post.findOne({_id: req.body.post_id});
    // Check if post belongs to a particular user ID
    if(post.author_id !== req.user.email){
        return res.status(500).json({msg: "You are not authorized to delete this"})
    }

    const result = await Post.findOneAndDelete({_id: req.body.post_id})
    if(!result){
        return res.status(404).json({msg: "Something wen't wrong, post not deleted"})
    }
    return res.status(200).json({success: true})
})


// Posts by user ID
router.get('/:user_id', authenticated, async (req, res) => {
    const user = await User.findById(req.params.user_id);
    if(!user){
        return res.status(404).json({msg: "user not found"});
    }

    const postsByUser = await Post.find({author_id: user.email})

    return res.status(200).json({user, postsByUser})

})

module.exports = router