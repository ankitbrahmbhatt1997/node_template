const dotenv = require("dotenv");
const result = dotenv.config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const preparePassport = require("./config/passport");
const passport = require("passport");
const hbs = require("hbs");
const path = require("path");

const publicPath = path.join(__dirname, "public");

if (result.error) {
    throw result.error;
}

// custom modules
const { logger } = require("./utils");

//Routes
const allRoutes = require("./routes");

const app = express();
// app.options("*", cors({ exposedHeaders: "Content-Range" }));
app.use(cors({ exposedHeaders: ["length"] }));

//setting the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//Using passport middleware
app.use(passport.initialize());
preparePassport();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    morgan("dev", {
        skip: () => app.get("env") === "test",
        stream: logger.stream
    })
);

app.use("/", allRoutes);

app.get("/", (req, res) => {
    res.send("Hi there");
});

app.use(express.static(publicPath));

module.exports = app;
