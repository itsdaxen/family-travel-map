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
    const users = (await db.query("SELECT id, name, user_color FROM users"))
      .rows;
    console.log(users);

    const visitedCountries = (
      await db.query("SELECT country_code, user_id FROM visited_countries")
    ).rows;
    console.log(visitedCountries);

    res.render("index.ejs", {
      countries: visitedCountries,
      users,
      user: req.query.user,
      success: req.query.success,
      error: req.query.error,
    });
  } catch (err) {
    console.error("Error loading countries:", err.message);
    res.render("index.ejs", {
      countries: [],
      users: null,
      user: null,
      success: false,
      error: true,
    });
  }
});

app.post("/add", async (req, res) => {
  let newCountry = req.body.country;
  let activeUserID = req.body.activeUserID;
  try {
    console.log("id is:" + activeUserID);
    const newCountryMultiPart = newCountry.trim().split(/\s+/);
    newCountry =
      newCountryMultiPart.length > 1
        ? newCountryMultiPart
            .map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase())
            .join(" ")
        : newCountry[0].toUpperCase() + newCountry.slice(1).toLowerCase();

    console.log(newCountry);

    newCountry = await db.query(
      "SELECT country_code FROM countries WHERE country_name ILIKE $1",
      [`%${newCountry}%`]
    );
    newCountry = newCountry.rows[0].country_code;
    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [newCountry, activeUserID]
    );
    res.redirect(`/?success=true&user=${activeUserID}`);
  } catch (err) {
    console.error("Error adding country:", err.message);
    res.redirect(`/?error=true&user=${activeUserID}`);
  }
});

app.post("/addNewUser", async (req, res) => {
  const { newUserName, newUserColorHSL } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (name, user_color) VALUES ($1, $2) RETURNING id",
      [newUserName, newUserColorHSL]
    );
    const activeUserID = result.rows[0].id;
    res.redirect(`/?success=true&user=${activeUserID}`);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.redirect("/?error=true");
  }
});

app.delete("/removeUser/:id", async (req, res) => {
  const userID = req.params.id;
  console.log(userID);
  try {
    await db.query("DELETE FROM visited_countries WHERE user_id = $1", [
      userID,
    ]);
    await db.query("DELETE FROM users WHERE id = $1", [userID]);
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete user." });
  }
});
