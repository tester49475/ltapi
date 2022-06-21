const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.web = require("./web.model");
db.discussion = require("./discussion.model");


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;