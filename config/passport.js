const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Admin = require("../models/Admin");
const User = require("../models/User");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

module.exports = () => {
    passport.use(
        new jwtStrategy(opts, async (payload, done) => {
            try {
                if (payload.type === "user") {
                    let user = await User.findById(payload.id);
                    let { _id, email, firstName, lastName, userId } = user;
                    return done(null, {
                        _id,
                        email,
                        firstName,
                        lastName,
                        userId
                    });
                } else if (payload.type === "admin") {
                    let admin = await Admin.findById(payload.id);
                    let { _id, email, type, permission } = admin;
                    return done(null, {
                        _id,
                        email,
                        type,
                        permission
                    });
                } else {
                    return done(null, false);
                }
            } catch (err) {
                console.log(err);
            }
        })
    );
};
