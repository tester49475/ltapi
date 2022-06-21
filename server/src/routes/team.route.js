const { Controller } = require("../controllers/controller")
const { UserController } = require("../controllers/user.controller")

const teamRoute = (app, db) => {
    const uc = new Controller(db, "team")
    const basicController = new Controller(db, "team")
   
    app.post("/team/create", (req, res) => basicController.create(req, res))
    // app.get("/teama", (req, res) => basicController.getAll(req, res))
    app.post("/team", (req, res) => basicController.getOne(req, res))
    app.post("/team/update", (req, res) => basicController.update(req, res))
    app.post("/team/delete", (req, res) => basicController.deleteWithQuery(req, res))
}

module.exports = { teamRoute }
