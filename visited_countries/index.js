const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/countries", (req, res) => {
  res.send("Hello World");
});
