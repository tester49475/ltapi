const mongoose = require("mongoose");

const RepoEvent = mongoose.model(
    "RepoEvent",
    new mongoose.Schema({
        _id: Number,
        type: String,
        created_at: String,
        is_read: Boolean,
        actor: String,
        org: String,
        repo: String
    })
);

module.exports = RepoEvent