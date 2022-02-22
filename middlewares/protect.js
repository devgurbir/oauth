const { verifyToken } = require("../utils/token");

const protect = async (req, res, next) => {
    // Check if token is present
    let token = req.headers.authorization?.split("Bearer ")[1];
    if(!token){
        return res.status(400).send({msg: "Invalid token / token not present"});
    }
    console.log(token)
    // Since token is present, verify it.
    try {
        const payload = await verifyToken(token);
        console.log(payload)
        next()
    } catch (err) {
        return res.status(500).send({msg: "Something went wrong: ", err});
    }   
}

module.exports = protect