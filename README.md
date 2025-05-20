# 🌍 Family Travel Map

A fullstack CRUD application built with **Node.js**, **Express**, **PostgreSQL**, and **vanilla JavaScript** that allows users to track visited countries per user, visualize them on an interactive SVG world map, and personalize user tabs with dynamic colors.

---

## ✨ Features

- ✅ Add new users with a custom name and color
- ✅ Select visited countries (with auto-normalized names)
- ✅ Live update of selected countries on an SVG map
- ✅ Personalized user tab styling via HSL colors
- ✅ Smooth modal animations, overlays, and transitions
- ✅ Delete users dynamically (with confirmation prompt)
- ✅ Clean RESTful backend architecture (GET, POST, DELETE)
- ✅ Persistent PostgreSQL database integration

---

## 📸 Preview

![Preview Screenshot](https://i.imgur.com/BCQONSO.png)

---

## 🧠 Tech Stack

| Layer          | Tech                                 |
|----------------|--------------------------------------|
| Frontend       | HTML, CSS, Vanilla JavaScript        |
| Styling        | Custom CSS (no framework), HSL vars  |
| Template Engine| EJS                                  |
| Backend        | Node.js + Express.js                 |
| Database       | PostgreSQL                           |
| Tooling        | `pg` (node-postgres), Fetch API      |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/travel-tracker.git
cd travel-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Create a PostgreSQL database named `world` and run the following schema:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_color VARCHAR(50)
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2),
  user_id INTEGER REFERENCES users(id),
  UNIQUE (country_code, user_id)
);

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2),
  country_name VARCHAR(100)
);
```

> 🗂️ Import `countries.csv` into the `countries` table for full country support.

### 4. Run the server

```bash
node index.js
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 💡 Concepts Practiced

- DOM manipulation and event delegation
- CSS transitions and HSL-based dynamic theming
- Color normalization from Hex → HSL
- RESTful route handling in Express
- EJS templating + client-side state sync
- PostgreSQL queries using parameterized statements

---

## 🤝 Credits

Built by **Daxen (Farzam Daghighi)** as part of a personal learning project, in alignment with course practice designed by **Angela Yu**.

---

## 📜 License

MIT — free to use, adapt, or fork for learning and portfolio purposes.
