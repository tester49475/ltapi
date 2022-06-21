const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionString = process.env.ATLAS_URI;

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
});

async function getDb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("ltapi");
    }
    catch (err) {
        console.log(err.stack);
    }
    // finally {
    //     await client.close();
    // }
}

module.exports = { getDb }
