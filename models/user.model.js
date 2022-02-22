const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, required: true},
    email: {type: String, require: true},
    password: {type: String},
    name: {type: String, require: true},
    googleId: {type: String}
})

userSchema.pre("save", function(next){
    if(!this.isModified('password')) return next();
    if(!this.password) return next();
    bcrypt.hash(this.password, 8, (err, hash) => {
        if(err) return next(err);

        this.password = hash;
        next();
    })
})

userSchema.methods.checkPassword = function(password) {
    const hashedPassword = this.password;
    return new Promise( (resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, res) => {
            if(err) return reject(err)
            resolve(res)
        } )
    })
}

const User = mongoose.model("User", userSchema)



module.exports = User