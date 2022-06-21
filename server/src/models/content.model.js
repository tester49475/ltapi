const mongoose = require("mongoose");

const Content = mongoose.model(
    "Content",
    new mongoose.Schema({
        _id: Number,
        name: String,
        repoId: Number
    })
);

module.exports = Content