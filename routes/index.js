const router = require("express").Router();
const userRoutes = require("../modules/user/userRoutes");

router.use("/user", userRoutes);

module.exports = router;
