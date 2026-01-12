// Importerar nödvändiga moduler, express samt sqlite3

const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// Sparar servern på port 3000
const port = 3000;

// Skapar express-applikationen och sätter upp middleware för att hantera JSON och statiska filer
const app = express();
app.use(express.json());
app.use(express.static("public"));

// Initialiserar databasen
const db = new sqlite3.Database("./cars.db");

// Startar servern
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Skapar tabellen "cars" om den inte redan finns
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS cars (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Brand TEXT NOT NULL,
        Color TEXT NOT NULL)`
  );
});

// Definierar API-endpoints för CRUD-operationer på "cars"
app.get("/cars", (req, res) => {
  db.all("SELECT * FROM cars", [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching cars");
    } else {
      res.json(rows);
    }
  });
});

// Definierar POST-endpoint för att lägga till en ny bil
app.post("/cars", (req, res) => {
  const { brand, color } = req.body;

  db.run(
    "INSERT INTO cars (Brand, Color) VALUES (?, ?)",
    [brand, color],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error inserting into cars");
      }
      // skicka tillbaka nya bilen så frontend kan lägga till den i listan
      res.json({ ID: this.lastID, Brand: brand, Color: color });
    }
  );
});

// Definierar DELETE-endpoint för att ta bort en bil baserat på dess ID
app.delete("/cars/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM cars WHERE ID = ?", [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting from cars");
    } else {
      res.json({ message: "Car deleted successfully" });
    }
  });
});

// Definierar PUT-endpoint för att uppdatera en bil baserat på dess ID
app.put("/cars/:id", (req, res) => {
  const id = req.params.id;
  const { brand, color } = req.body;

  db.run(
    "UPDATE cars SET Brand = ?, Color = ? WHERE ID = ?",
    [brand, color, id],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating cars");
      } else {
        res.json({ message: "Car updated successfully" });
      }
    }
  );
});
