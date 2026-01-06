const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database('./cars.db');

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS cars (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Brand TEXT NOT NULL,
        Color TEXT NOT NULL)`
    );
});

app.get('/cars', (req, res) => {
    db.all(
        'SELECT * FROM cars', [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching cars');
        } else {
            res.json(rows);
        }
    })
})

app.post('/cars', (req, res) => {
    const {brand, color} = req.body;

    db.run(
        'INSERT INTO cars VALUES (?, ?)', [brandrand, color], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error inserting into cars');
        } else {
            res.json({message: 'Car added successfully'});
        }
    })
})

app.delete('/cars/:id', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM cars WHERE ID = ?', [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting from cars');
        } else {
            res.json({message: 'Car deleted successfully'});
        }
    })
})

app.put('/cars', (req, res) => {
    const {id, brand, color} = req.body;

    db.run(
        'UPDATE cars SET Brand = ?, Color = ? WHERE ID = ?', [brand, color, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating cars')
        } else {
            res.json({message: 'Car updated successfully'});
        }
    })
})
//db.run('INSERT INTO cars (Brand, Color) VALUES (?, ?)', ['Volvo', 'Red']);