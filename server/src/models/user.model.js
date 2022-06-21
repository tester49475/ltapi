const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        _id: Number,
        email: String,
        password: String,
        name: String,
        avatar_url: String,
        teamIds: Array
    })
);

module.exports = User