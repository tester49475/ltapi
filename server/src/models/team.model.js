const mongoose = require("mongoose");

const Team = mongoose.model(
    "Team",
    new mongoose.Schema({
        _id: Number,
        name: String,
        created_at: String,
        leaderId: Number,
        memberIds: Arrays 
    })
);

module.exports = Team