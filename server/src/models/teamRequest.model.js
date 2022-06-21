const mongoose = require("mongoose");

const TeamRequest = mongoose.model(
    "TeamRequest",
    new mongoose.Schema({
        _id: Number,
        to: Number,
        teamId: Number,
        status: String
    })
);

module.exports = TeamRequest