const { GridFSBucket } = require('mongodb')
const fs = require('fs')

class FileUtils {
    constructor(db) {
        this.bucket = new GridFSBucket(db)
    }

    upload = (fileName) => {
        fs.createReadStream("./src/controllers/user.controller.js").
            pipe(
                this.bucket.openUploadStream('testFile')
            )
    }

    download = () => {
        this.bucket.openDownloadStreamByName('testFile').
            pipe(fs.createWriteStream('./outputFile'))
    }
}

module.exports = { FileUtils }