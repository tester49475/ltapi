const mongoose = require("mongoose");

const Commit = mongoose.model(
    "Commit",
    new mongoose.Schema({
        _id: Number,
        title: String,
        number: String,
        created_at: String,
        is_read: Boolean,
        commiter: String,
        repo: String
    })
);

module.exports = Commit