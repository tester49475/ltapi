const mongoose = require("mongoose");
require("dotenv").config();


const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}
@cluster0.j3qvr.mongodb.net/bisp?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const conn = mongoose
    .connect(uri, connectionParams)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error connecting to the database", err);
    });

module.exports = conn;
