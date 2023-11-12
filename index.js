const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { Client } = require('pg')

const app = express()
app.use(bodyParser.json());
app.use(
  express.urlencoded(),
  cors({
    origin: 'http://localhost:8080'
  })
  )

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '12300',
    port: 5432,
})


client.connect(() => (console.log('Bd is connected')))

  
app.get("/test", (req, res) => {
    //res.send("Hello World")
    client.query('SELECT * FROM task', (err, result) => {
        res.send(result.rows)
        client.end()
      })
})

app.post("/test", (req, res) => {
    const body = req.body
    res.send(`Hello ${body.name} with id ${body.id}`)
})



app.listen(3300, () => {
    console.log("Sever started on port 3300")
})


