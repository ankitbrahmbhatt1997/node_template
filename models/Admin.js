const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenSECRET = process.env.TOKEN_SECRET;

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true
    }
});

// Method for creating JWT token for a particular user
adminSchema.methods.createJWT = function() {
    const admin = this;
    const data = {
        id: admin._id,
        type: admin.type
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
adminSchema.pre("save", function(next) {
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

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;
