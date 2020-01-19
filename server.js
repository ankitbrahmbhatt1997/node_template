const app = require("./app");
const mongoose = require("./config/mongoose");
const { logger } = require("./utils");
let port = process.env.PORT;

let server = app.listen(port, () => {
    logger.info(`server started at port ${port}`);
});

server.on("close", () => {
    mongoose.connection.close();
    console.log("mongo connection closed");
});
