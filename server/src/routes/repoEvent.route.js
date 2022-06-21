const { Controller } = require("../controllers/controller")

const repoEventRoute = (app, db) => {
    const uc = new Controller(db, "repoEvent")
    // uc.delete()
    // generateData(db)

    app.get("/repoEvent", (req, res) => uc.get(req, res))
}


const generateData = (db) => {
    let doc = {
        _id: 0,
        type: "ForkEvent",
        created_at: 1653301228000,
        actor: "test0",
        org: "test0",
        repo: "repo0",
    }
    
    new Controller(db, "repoEvent").createForTesting(doc)
}


module.exports = { repoEventRoute }