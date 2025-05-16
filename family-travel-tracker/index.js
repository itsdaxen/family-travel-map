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
  password: "postgres",
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    const countries = result.rows.map((row) => row.country_code.toUpperCase());
    res.render("index.ejs", {
      countries,
      success: req.query.success,
      error: req.query.error,
    });
  } catch (err) {
    console.error("Error loading countries:", err.message);
    res.render("index.ejs", {
      countries: [],
      success: false,
      error: true,
    });
  }
});

app.post("/add", async (req, res) => {
  let newCountry = req.body.country;
  try {
    const newCountryMultiPart = newCountry.trim().split(/\s+/);
    newCountry =
      newCountryMultiPart.length > 1
        ? newCountryMultiPart
            .map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase())
            .join(" ")
        : newCountry[0].toUpperCase() + newCountry.slice(1).toLowerCase();

    console.log(newCountry);

    newCountry = await db.query(
      "Select country_code from countries WHERE country_name ILIKE $1",
      [`%${newCountry}%`]
    );
    newCountry = newCountry.rows[0].country_code;
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      newCountry,
    ]);
    res.redirect("/?success=true");
  } catch (err) {
    console.error("Error adding country:", err.message);
    res.redirect("/?error=true");
  }
});
