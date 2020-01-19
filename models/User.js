const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenSECRET = process.env.TOKEN_SECRET;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    authType: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

// Method for creating JWT token for a particular user
userSchema.methods.createJWT = function() {
    const user = this;
    const data = {
        id: user.id,
        userId: user.userid,
        type: "user"
    };
    return new Promise((resolve, reject) => {
        jwt.sign(data, tokenSECRET, (err, token) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(`Bearer ${token}`);
            }
        });
    });
};

// Hashing password before saving
userSchema.pre("save", function(next) {
    let user = this;

    if (!user.password || !user.isModified("password")) return next();

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log("Password succesfully hashed");
                user.password = hash;
                next();
            }
        });
    });
});

const User = mongoose.model("users", userSchema);

module.exports = User;
