class Utility {
    constructor(db, collection) {
        this.db = db
        this.collection = collection
    }

    addDoc = async (obj) => {
        try {
            const col = this.db.collection(this.collection)

            await col.insertOne(obj)

        } catch (err) {
            console.log(err.stack)
        }
    }

    updateDoc = async (id, obj) => {
        try {
            const col = this.db.collection(this.collection)

            await col.updateOne({ _id: id }, { $set: obj }, { upsert: true })

        } catch (err) {
            console.log(err.stack)
        }
    }

    // updateWithQuery = async (id, obj) => {
    //     try {
    //         const col = this.db.collection(this.collection)

    //         await col.updateOne({ _id: id }, { $set: obj }, { upsert: true })

    //     } catch (err) {
    //         console.log(err.stack)
    //     }
    // }

    getDocFromQuery = async (cursor) => {
        let doc

        await cursor.forEach(item => doc = item)

        return doc
    }

    getDocsFromQuery = async (cursor) => {
        let docs = []

        await cursor.forEach(item => docs.push(item))

        return docs
    }

    // getDocsFromQuery = async (cursor) => {
    //     // if ((await cursor.count()) === 0) {
    //     //     console.log("No documents found!")
    //     // }

    //     let docs = {}
    //     let index = 0

    //     await cursor.forEach(item => {
    //         docs[index] = item
    //         index++
    //     })

    //     return docs
    // }

    getLastIndex = async (req, res) => {
        try {
            const query = req.query

            const col = this.db.collection(query.collection)

            const indexer = await col.findOne({ "_id": "index" })

            res.status(200).send(indexer)
        }
        catch (err) {
            console.log(err)
        }
    }

    isObjectEmpty = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }
}

module.exports = { Utility }
