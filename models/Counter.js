const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCounterSchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true, default: 0 }
});

const UserCounter = mongoose.model("counters", userCounterSchema);
module.exports = UserCounter;
