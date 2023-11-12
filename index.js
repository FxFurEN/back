const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(
  express.urlencoded(),
  cors({
    origin: 'http://localhost:8080'
  })
);

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12300',
  port: 5432
});

client.connect(() => console.log('DB is connected'));


app.get("/loadTodo", (req, res) => {
  client.query('SELECT * FROM task', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const todos = result.rows.map(row => ({
        id: row.id,
        text: row.name,
        completed: row.done,
      }));
      res.send(todos);
    }
  });
});


app.post("/addTodo", (req, res) => {
  const body = req.body;
  client.query('INSERT INTO task(name, done) VALUES ($1, $2) RETURNING *', [body.text, false], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.rows[0]);
    }
  });
});


app.patch("/toggleTodo/:id", (req, res) => {
  const id = req.params.id;

  client.query('UPDATE task SET done = NOT done WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.rows[0]);
    }
  });
});


app.delete("/removeTodo/:id", (req, res) => {
  const id = req.params.id;
  client.query('DELETE FROM task WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.listen(3300, () => {
  console.log("Server started on port 3300");
});
