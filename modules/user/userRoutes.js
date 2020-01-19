const router = require("express").Router();

const {
    createNewUserController,
    signInUserController
} = require("./userControllers");

const passport = require("passport");

//<------------------------------------------ROUTES---------------------------------------------------------->

// @route     POST /user/register
// @fnc       Register a User
// @access    Public

router.post("/register", createNewUserController);

// @route     POST /user/signin
// @fnc       Loggin in  a new User
// @access    Public

router.post("/signin", signInUserController);

module.exports = router;
