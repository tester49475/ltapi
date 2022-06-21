const { Controller } = require("./controller")
const { Utility } = require("./util")

class PullRequestController {

    constructor(db) {
        this.db = db
        this.collection = "pullRequest"
        this.util = new Utility(db, this.collection)
        this.controller = new Controller(db, this.collection)
    }

    get = async (req, res) => {
        try {
            let docs = await this.controller.getWithPipeline(req, res)

            const userController = new Controller(this.db, "user")
            const repoController = new Controller(this.db, "repo")

            for (let i = 0; i < docs.length; i++) {
                const user = await userController.getOneWithExplicitQuery({ name: docs[i].user })

                docs[i].user = user
                docs[i].repo = {
                    _id: 0,
                    name: "repo0",
                    created_at: 1653196094000,
                    ownerId: 0
                }
            }

            res.status(200).send(docs)
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = { PullRequestController }
