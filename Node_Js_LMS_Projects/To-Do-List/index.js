const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

let todos = [];

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Todo App</title>

      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h2>Todo List</h2>

        <form method="POST" action="/add" class="form">
          <input type="text" name="task" required />
          <button class="add">Add</button>
        </form>
        <h3>Tasks To Do</h3>
        <ul>
          ${todos.map((t, i) => `
            <li class="task">
              ${t}
              <a class="delete" href="/delete/${i}">Delete</a>
            </li>
          `).join("")}
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  todos.push(req.body.task);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  todos.splice(req.params.id, 1);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
