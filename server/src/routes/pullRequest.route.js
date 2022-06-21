const { Controller } = require("../controllers/controller")
const { PullRequestController } = require("../controllers/pullRequest.controller")


const pullRequestRoute = (app, db) => {
    const uc = new PullRequestController(db)
    const basicController = new Controller(db, "pullRequest")

    app.get("/pullRequest", (req, res) => basicController.getAll(req, res))
    app.post("/pullRequest", (req, res) => uc.get(req, res))
    app.post("/pullRequest/create", (req, res) => basicController.create(req, res))
    app.post("/pullRequest/update", (req, res) => basicController.update(req, res))
    app.post("/pullRequest/markAsRead", (req, res) => basicController.markAsRead(req, res))
    app.post("/pullRequest/delete", (req, res) => basicController.deleteWithQuery(req, res))
}


const generateData = (db) => {
    let doc = {
        _id: 0,
        title: "refactor: replace deprecated String.prototype.substr()",
        body: "[String.prototype.substr()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr) is deprecated",
        state: "open",
        created_at: 1653301228000,
        user: "test0",
        repo: "repo0",
    }

    new Controller(db, "pullRequest").createForTesting(doc)
}


module.exports = { pullRequestRoute }