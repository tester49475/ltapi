const mongoose = require("mongoose");

const Issue = mongoose.model(
    "Issue",
    new mongoose.Schema({
        _id: Number,
        title: String,
        number: String,
        label: String,
        created_at: String,
        is_read: Boolean,
        owner: String,
        repo: String,
    })
);

module.exports = Issue