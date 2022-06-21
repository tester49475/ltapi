const express = require("express")
const bodyParser = require("body-parser")
var compression = require("compression")
var helmet = require("helmet")
const cors = require("cors")

const { getDb } = require("./src/db/conn")


const { commitRoute } = require("./src/routes/commit.route")
const { issueRoute } = require("./src/routes/issue.route")
const { pullRequestRoute } = require("./src/routes/pullRequest.route")
const { repoEventRoute } = require("./src/routes/repoEvent.route")
const { userRoute } = require("./src/routes/user.route")
const { repoRoute } = require("./src/routes/repo.route")
const { teamRoute } = require("./src/routes/team.route")
const { teamRequestRoute } = require("./src/routes/teamRequest.route")
const { FileUtils } = require("./src/controllers/fileUtils")


const app = express()

app.use(compression())
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const run = (db) => {
    const PORT = process.env.PORT || 8080

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`)
    })

    commitRoute(app, db)
    issueRoute(app, db)
    pullRequestRoute(app, db)
    repoEventRoute(app, db)
    userRoute(app, db)
    repoRoute(app, db)
    teamRoute(app, db)
    teamRequestRoute(app, db)
}


getDb()
    .then(db => run(db))
    .catch(err => console.log(err))
