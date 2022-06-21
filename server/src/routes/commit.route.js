const { CommitController } = require("../controllers/commit.controller")
const { Controller } = require("../controllers/controller")

const commitRoute = (app, db) => {
    const uc = new CommitController(db)
    const basicController = new Controller(db, "commit")

    app.get("/commit", (req, res) => basicController.getAll(req, res))
    app.post("/commit", (req, res) => uc.get(req, res))
    app.post("/commit/create", (req, res) => basicController.create(req, res))
    app.post("/commit/update", (req, res) => basicController.update(req, res))
    app.post("/commit/markAsRead", (req, res) => basicController.markAsRead(req, res))
    app.post("/commit/delete", (req, res) => basicController.deleteWithQuery(req, res))
}


const generateData = (db) => {
    let doc = {
        _id: 1,
        title: "Remove enableFlipOffscreenUnhideOrder",
        number: "24545",
        created_at: 1653301228000,
        commiter: "test2",
        repo: "repo1",
    }

    new Controller(db, "commit").createForTesting(doc)
}


module.exports = { commitRoute }
