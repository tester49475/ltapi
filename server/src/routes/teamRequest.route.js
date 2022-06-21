const { Controller } = require("../controllers/controller")

const teamRequestRoute = (app, db) => {
    const basicController = new Controller(db, "teamRequest")

    app.post("/teamRequest/create", (req, res) => basicController.create(req, res))
    app.get("/teamRequest", (req, res) => basicController.getAll(req, res))
    app.post("/teamRequest", (req, res) => basicController.get(req, res))
    app.post("/teamRequest/update", (req, res) => basicController.update(req, res))
}

module.exports = { teamRequestRoute }
