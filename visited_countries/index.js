const express = require("express");
const app = express();
const port = 3000;

// Add body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

let countries = ["fi", "se", "de", "fr", "it", "es", "pt", "pl", "cz"];
let total = countries.length;
countries = countries.map((country) => country.toUpperCase());

function addCountry(country) {
  countries.push(country.toUpperCase());
  total = countries.length;
}

app.get("/", (req, res) => {
  res.render("index.ejs", { countries, total });
});

app.post("/add", (req, res) => {
  addCountry(req.body.country.toUpperCase());
  res.redirect("/");
});
