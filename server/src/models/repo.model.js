const mongoose = require("mongoose");

const Repo = mongoose.model(
    "Repo",
    new mongoose.Schema({
        _id: Number,
        name: String,
        created_at: String,
        ownerId: Number,
    })
);

module.exports = Repo