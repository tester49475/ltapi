const { Controller } = require("./controller")
const { Utility } = require("./util")

class CommitController {

    constructor(db) {
        this.db = db
        this.collection = "commit"
        this.util = new Utility(db, this.collection)
        this.controller = new Controller(db, this.collection)
    }
    fix = async () => {
        try {
            const col = this.db.collection(this.collection)

            await col.updateMany({}, {
                $set: { repo: "repo_0" },
            })

        } catch (err) {
            console.log(err.stack)
        }
    }
    get = async (req, res) => {
        try {
            let commits = await this.controller.getWithPipeline(req, res)

            const userController = new Controller(this.db, "user")
            const repoController = new Controller(this.db, "repo")

            for (let i = 0; i < commits.length; i++) {

                const commiter = await userController.getOneWithExplicitQuery({ name: commits[i].commiter })

                commits[i].commiter = commiter
                commits[i].repo = {
                    _id: 0,
                    name: "repo0",
                    created_at: 1653196094000,
                    ownerId: 0
                }
            }

            res.status(200).send(commits)
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = { CommitController }
