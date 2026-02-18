const bodyParser = require('body-parser')
const express = require('express')
const port = 4050

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")

let users = []

let id = 1

app.get('/', (req, res) => {
    res.render("index", { users })
})

app.listen(port, () => {
    console.log(`server start on ${port}`)
})