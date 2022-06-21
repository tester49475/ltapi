const mongoose = require("mongoose");

const File = mongoose.model(
    "File",
    new mongoose.Schema({
        _id: Number,
        name: String,
        url: String,
        contentId: Number
    })
);

module.exports = File