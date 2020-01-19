const User = require("../../models/User");
const { getNextSequence } = require("../../utils");
const { isEmpty } = require("../../utils/index");
const Counter = require("../../models/Counter");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * User service for creating a new User
 *
 * @function
 *
 * @param {string} email Email address of the User
 *
 * @param {string} password Password Provided by the user
 *
 * @param {string} fullName Fullname of the user
 *
 * @return userdata with JWT token
 * */

async function createNewUser({ email, password, fullName, authType }) {
    let counter = await Counter.findOne({
        name: "user"
    });

    // Initializing the user Counter
    if (isEmpty(counter)) {
        let initialCounter = new Counter({
            name: "user"
        });
        await initialCounter.save();
    }

    // Creating a new user collection
    let newUser = new User({
        email,
        fullName,
        password,
        userId: await getNextSequence("user"),
        authType,
        type: "user"
    });
    let savedUser = await newUser.save();

    // Uncomment for live app

    // let confirmationToken = new Token({
    //     userId: savedUser._id,
    //     token: crypto.randomBytes(16).toString("hex"),
    //     tokenType: "verification"
    // });

    // let savedToken = await confirmationToken.save();

    // sendMail(savedToken.token, savedUser.email, "verify");

    let jwtToken = await newUser.createJWT();

    return {
        fullName: savedUser.fullName,
        email: savedUser.email,
        userId: savedUser.userId,
        token: jwtToken
    };
}

//<--------------------------------------------------------------------------------------------------------------------------------------->

/**
 * User service for signing in a user
 *
 * @function
 *
 * @param {string} email Email address of the User
 *
 * @param {string} password Password Provided by the user
 *
 * @return userdata with JWT token
 * */

async function signInUser({ email }) {
    let user = await User.findOne({ email });
    let token = await user.createJWT();
    let responseUser = {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email
    };
    return {
        token,
        ...responseUser
    };
}

//<--------------------------------------------------------------------------------------------------------------------------------------->

/**
 * User service for creating a new user using google
 *
 * @function
 *
 * @param {string} idToken Token provided by the client for validation from google servers
 *
 * @param {string} authType authorization type eg.. google ,facebook
 *
 * @return userdata with JWT token
 * */

async function registerWithGoogle({ idToken, authType }) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    let { email, given_name, family_name } = payload;
    let data = await createNewUser({
        email,
        fullName: `${given_name} ${family_name}`,
        authType
    });
    return {
        ...data
    };
}

//<--------------------------------------------------------------------------------------------------------------------------------------->

/**
 * User service for google signin
 *
 * @function
 *
 * @param {string} idToken Token provided by the client for validation from google servers
 *
 * @param {string} authType authorization type eg.. google ,facebook
 *
 * @return userdata with JWT token
 * */

async function loginWithGoogle({ idToken, authType }) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    let { email } = payload;
    let data = await signInUser({
        email,
        authType
    });
    return {
        ...data
    };
}

module.exports = {
    createNewUser,
    loginWithGoogle,
    registerWithGoogle,
    signInUser
};
