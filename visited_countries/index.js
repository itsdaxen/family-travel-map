const { Pool } = require("pg");
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

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "root",
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    const countries = result.rows.map((row) => row.country_code.toUpperCase());
    res.render("index.ejs", { countries });
  } catch (err) {
    console.error("Error loading countries:", err.message);
    res.status(500).send("Failed to load countries");
  }
});

app.post("/add", async (req, res) => {
  const newCountry = req.body.country?.toUpperCase();

  if (!newCountry || newCountry.length !== 2) {
    return res.status(400).send("Invalid country code");
  }

  try {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      newCountry,
    ]);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding country:", err.message);
    res.status(500).send("Database error");
  }
});
