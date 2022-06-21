const mongoose = require("mongoose");

const PullRequest = mongoose.model(
    "PullRequest",
    new mongoose.Schema({
        _id: Number,
        title: String,
        body: String,
        state: String,
        created_at: String,
        is_read: Boolean,
        user: String,
        repo: String
    })
);

module.exports = PullRequest