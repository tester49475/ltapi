const { Controller } = require("./controller")
const { Utility } = require("./util")

class IssueController {

    constructor(db) {
        this.db = db
        this.collection = "issue"
        this.util = new Utility(db, this.collection)
        this.controller = new Controller(db, this.collection)
    }

    isExist = async (req, res) => {
        const key = req.body.key

        this.getByKey(key).then(
            doc => {
                res.status(200).send(doc)
            }
        )
    }


    get = async (req, res) => {
        try {
            let issues = await this.controller.getWithPipeline(req, res)

            const userController = new Controller(this.db, "user")
            const repoController = new Controller(this.db, "repo")

            for (let i = 0; i < issues.length; i++) {
                const owner = await userController.getOneWithExplicitQuery({ name: issues[i].owner })

                issues[i].owner = owner
                issues[i].repo = {
                    _id: 0,
                    name: "repo0",
                    created_at: 1653196084000,
                    ownerId: 0
                }
            }

            res.status(200).send(issues)
        }
        catch (err) {
            console.log(err)
        }
    }

    search = async (req, res) => {
        try {

            let issues = await this.controller.search(req, res)

            const userController = new Controller(this.db, "user")
            const repoController = new Controller(this.db, "repo")

            for (let i = 0; i < issues.length; i++) {
                const owner = await userController.getOneWithExplicitQuery({ name: issues[i].owner })

                issues[i].owner = owner
                issues[i].repo = {
                    _id: 0,
                    name: "repo0",
                    created_at: 1653196084000,
                    ownerId: 0
                }
            }

            res.status(200).send(issues)
        }
        catch (err) {
            console.log(err)
        }
    }

    getByKey = async (_key) => {
        try {
            const col = this.db.collection(this.collection)

            const doc = await col.findOne({ key: _key })

            return doc
        }
        catch (err) {
            console.log(err)
        }
    }

    getLast = async () => {
        try {
            const col = this.db.collection(this.collection)

            const cursor = await col.find({}).sort({ _id: -1 }).limit(1)

            const docs = await this.util.getDocFromQuery(cursor)

            return docs
        }
        catch (err) {
            console.log(err)
        }
    }

    create = async (obj) => {
        const last = await this.getLast()

        let newId

        if (this.util.isObjectEmpty(last)) {
            newId = 0
        }
        else {
            newId = last._id + 1
        }

        const doc = {
            _id: newId,
            owner: obj.owner,
            repo: obj.repo,
            title: obj.title,
            number: obj.number,
            label: obj.label,
            created_at: Date.now(),
            user: obj.user
        }

        this.util.addDoc(doc)
    }

    updateOwner = async () => {
        try {
            const col = this.db.collection(this.collection)

            await col.updateMany({ owner: "test0" }, { $set: { owner: "Sheila Stevens" } })

        } catch (err) {
            console.log(err.stack)
        }
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

    delete = async () => {
        try {
            this.db.collection(this.collection).remove({})
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = { IssueController }
