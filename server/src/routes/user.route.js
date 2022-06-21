const { Controller } = require("../controllers/controller")
const { UserController } = require("../controllers/user.controller")
const User = require("../models/user.model")

const userRoute = (app, db) => {
    const uc = new Controller(db, "user")
    const basicController = new Controller(db, "user")
    // uc.delete()
    // generateData(db)
    app.post("/user/create", (req, res) => basicController.create(req, res))
    app.post("/user/login", (req, res) => uc.getOne(req, res))
    app.post("/user", (req, res) => basicController.getAndRespondWithPipeline(req, res))
    app.post("/user/update", (req, res) => basicController.update(req, res))
    app.post("/user/delete", (req, res) => basicController.deleteWithQuery(req, res))
}

const generateData = (db) => {
    let user = new User()

    user = {
        _id: 0,
        email: "test0@gmail.com",
        password: "test0",
        name: "test0",
        avatar_url: "https://avatars.githubusercontent.com/u/4126644?v=4"
    }

    new UserController(db).create(user)
}

module.exports = { userRoute }
