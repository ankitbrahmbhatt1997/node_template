const mongoose = require("mongoose");
const { logger } = require("../utils");

mongoose.Promise = global.Promise;

const options = {
    dbName: "db_name",
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
};

if (!process.env.MONGODB_URI_LOCAL) {
    logger.error("Please set MONGO_URI");
    process.exit(-1);
}

mongoose.connect(`${process.env.MONGODB_URI_LOCAL}`, options);

mongoose.connection.on("connected", () => {
    logger.info("Connected to MongoDB");
});

mongoose.connection.on("error", err => {
    logger.error("MongoDB connection error:", err);
    process.exit(-1);
});

mongoose.connection.on("disconnected", () => {
    logger.error("MongoDB disconnected");
});

module.exports = mongoose;
