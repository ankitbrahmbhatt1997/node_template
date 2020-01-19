// util function for getting the latest count
const Counter = require("../models/Counter");
async function getNextSequence(name) {
    let result = await Counter.findOneAndUpdate(
        {
            name
        },
        {
            $inc: {
                count: 1
            }
        },
        {
            new: true
        }
    );

    return result.count;
}

module.exports = getNextSequence;
