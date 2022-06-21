const { Utility } = require("./util")

class UserController {

    constructor(db) {
        this.db = db
        this.collection = "user"
        this.util = new Utility(db, this.collection)
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
            const OWNER = req.query.owner
            const REPO = req.query.repo

            const col = this.db.collection(this.collection)

            const cursor = await col.find({ owner: OWNER, repo: REPO })

            this.util.getDocsFromQuery(cursor).then(
                docs => res.status(200).send(docs)
            )
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
        this.util.addDoc(obj)
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

module.exports = { UserController }
