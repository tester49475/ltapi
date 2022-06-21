const User = require("../models/user.model")
const { IssueController } = require("../controllers/issue.controller")
const { Controller } = require("../controllers/controller")

const issueRoute = (app, db) => {
    const uc = new IssueController(db)
    const basicController = new Controller(db, "issue")
    // basicController.addProperty()
    // uc.delete()
    // generateData(db)
    app.get("/issue", (req, res) => basicController.getAll(req, res))
    app.post("/issue", (req, res) => uc.get(req, res))
    app.post("/issue/create", (req, res) => basicController.create(req, res))
    app.post("/issue/update", (req, res) => basicController.update(req, res))
    app.post("/issue/markAsRead", (req, res) => basicController.markAsRead(req, res))
    app.post("/issue/delete", (req, res) => basicController.deleteWithQuery(req, res))
}


const generateData = (db) => {
    let user = User()

    user = {
        avatar_url: "https://avatars.githubusercontent.com/u/4126644?v=4"
    }

    let doc = {
        _id: 2,
        title: "autoFocus polyfill deviates from HTML autofocus global attribute spec",
        number: "23231",
        label: "Status: Confirmed",
        created_at: 1653196984000,
        owner: "test0",
        repo: "repo0",
    }

    new Controller(db, "issue").createForTesting(doc)
}


module.exports = { issueRoute }
