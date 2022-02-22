const User = require("../models/user.model");
const { verifyToken } = require("../utils/token");

const authenticated = async (req, res, next) => {
    // Check if token is present
    let token = req.headers.authorization?.split("Bearer ")[1];
    if(!token){
        return res.status(400).send({msg: "Invalid token / token not present"});
    }
    console.log(token)
    // Since token is present, verify it.
    try {
        const payload = await verifyToken(token);
        console.log("payload: " , payload)
        const user = await User.findById(payload.id)
        if(!user) return res.status(401).send({status: "failure", msg: "User does not exist"})

        req.user = user;
        
        next()
    } catch (err) {
        return res.status(500).send({msg: "Something went wrong: ", err});
    }   
}

module.exports = authenticated