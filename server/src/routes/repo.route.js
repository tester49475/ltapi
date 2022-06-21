const { Controller } = require("../controllers/controller")
const { UserController } = require("../controllers/user.controller")

const repoRoute = (app, db) => {
    const uc = new Controller(db, "repo")
    const basicController = new Controller(db, "repo")
   
    app.post("/repo/create", (req, res) => basicController.create(req, res))
    app.get("/repo", (req, res) => basicController.getAll(req, res))
}

module.exports = { repoRoute }
