const { Utility } = require("./util")

class Controller {

    constructor(db, collection) {
        this.db = db
        this.collection = collection
        this.util = new Utility(db, this.collection)
    }

    isExist = async (req, res) => {
        const id = req.body.id

        this.getById(id).then(
            doc => {
                res.status(200).send(doc)
            }
        )
    }

    getById = async (id) => {
        try {
            const col = this.db.collection(this.collection)

            const doc = await col.findOne({ _id: id })

            return doc
        }
        catch (err) {
            console.log(err)
        }
    }

    getAll = async (req, res) => {
        try {
            const col = this.db.collection(this.collection)

            const cursor = await col.find({}).limit(20)

            this.util.getDocsFromQuery(cursor).then(
                docs => res.status(200).send(docs)
            )
        }
        catch (err) {
            console.log(err)
        }
    }

    get = async (req, res) => {
        try {
            const col = this.db.collection(this.collection)

            const query = req.body

            const cursor = await col.find(query)

            this.util.getDocsFromQuery(cursor).then(
                docs => res.status(200).send(docs)
            )
        }
        catch (err) {
            console.log(err)
        }
    }

    getAndRespondWithPipeline = async (req, res) => {
        try {
            console.log("\n**** Running ****")
            const query = req.body.query
            const field = req.body.field
            const searchStr = req.body.searchStr
            const sort = req.body.sort

            const col = this.db.collection(this.collection)

            if (field) col.createIndex(field)

            const pipeline = []
            console.log(req.body)
            if (searchStr) pipeline.push({ $match: { $text: { $search: searchStr } } })
            if (query) pipeline.push({ $match: query })
            if (sort) pipeline.push({ $sort: sort })

            // console.log(pipeline)

            const cursor = await col.aggregate(pipeline)

            // const cursor = await col.aggregate(
            //     [
            //         { $match: { $text: { $search: searchStr } } },
            //         { $match: query },
            //         { $sort: sort }
            //     ]
            // )

            const docs = await this.util.getDocsFromQuery(cursor)

            res.status(200).send(docs)
        }
        catch (err) {
            console.log(err)
        }
    }

    getWithPipeline = async (req, res) => {
        try {
            console.log("\n**** Running ****")
            const query = req.body.query
            const field = req.body.field
            const searchStr = req.body.searchStr
            const sort = req.body.sort

            const col = this.db.collection(this.collection)

            if (field) col.createIndex(field)

            const pipeline = []
            console.log(req.body)
            if (searchStr) pipeline.push({ $match: { $text: { $search: searchStr } } })
            if (query) pipeline.push({ $match: query })
            if (sort) pipeline.push({ $sort: sort })

            // console.log(pipeline)

            const cursor = await col.aggregate(pipeline)

            // const cursor = await col.aggregate(
            //     [
            //         { $match: { $text: { $search: searchStr } } },
            //         { $match: query },
            //         { $sort: sort }
            //     ]
            // )

            const docs = await this.util.getDocsFromQuery(cursor)

            return docs
        }
        catch (err) {
            console.log(err)
        }
    }

    getWithExplicitQuery = async (query) => {
        try {
            const col = this.db.collection(this.collection)

            const cursor = await col.find(query)

            return this.util.getDocsFromQuery(cursor)
        }
        catch (err) {
            console.log(err)
        }
    }

    getOne = async (req, res) => {
        try {
            const col = this.db.collection(this.collection)

            const query = req.body

            const cursor = await col.findOne(query)

            if (cursor != null) {
                res.status(200).send(cursor)
            }
            else {
                res.status(404).send()
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    getOneWithExplicitQuery = async (query) => {
        try {
            const col = this.db.collection(this.collection)

            const cursor = await col.findOne(query)

            return cursor
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

    search = async (req, res) => {
        try {
            const query = req.body.query
            const field = req.body.field
            const searchStr = req.body.searchStr

            const col = this.db.collection(this.collection)

            col.createIndex(field)

            const cursor = await col.aggregate(
                [
                    { $match: { $text: { $search: searchStr } } },
                    { $match: query },
                ]
            )

            const docs = await this.util.getDocsFromQuery(cursor)

            return docs
        }
        catch (err) {
            console.log(err)
        }
    }

    create = async (req, res) => {
        let obj = req.body

        const last = await this.getLast()

        let newId

        if (last == undefined) {
            newId = 0
        }
        else {
            newId = last._id + 1
        }

        obj._id = newId

        await this.util.addDoc(obj)

        res.status(200).send({ _id: newId })
    }

    createForTesting = async (obj) => {
        await this.util.addDoc(obj)
    }

    update = async (req, res) => {
        try {
            const obj = req.body

            await this.util.updateDoc(obj._id, obj)

            res.status(200).send({
                message: "Updated!"
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    markAsRead = async (req, res) => {
        try {
            const col = this.db.collection(this.collection)

            await col.updateOne({ _id: req.body.id }, { $set: { is_read: true } })

            res.status(200).send({ message: "Updated!" })
        }
        catch (err) {
            console.log(err)
        }
    }

    addProperty = async () => {
        try {
            const col = this.db.collection(this.collection)

            await col.updateMany({}, { $set: { is_read: false } }, { upsert: true })

        }
        catch (err) {
            console.log(err)
        }
    }

    deleteAll = async () => {
        try {
            this.db.collection(this.collection).deleteMany({})
        }
        catch (err) {
            console.log(err)
        }
    }

    deleteWithQuery = async (req, res) => {
        try {
            const query = req.body

            this.db.collection(this.collection).deleteOne(query)

            res.status(200).send({ message: "Deleted" })
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = { Controller }
