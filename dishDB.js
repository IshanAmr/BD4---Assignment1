const sqlite3 = require('sqlite3').verbose();

// Create an in-memory SQLite database
const db = new sqlite3.Database('./dish_database.sqlite', (err) => {
  if (err) {
      console.error(err.message);
  }
  console.log('Connected to the dish database.');
});

const dishInitDB = () => {
  db.serialize(() => {
      // Create table
      db.run('DROP TABLE IF EXISTS dishes');
      db.run(`
        CREATE TABLE IF NOT EXISTS dishes (
          id INTEGER PRIMARY KEY,
          name TEXT,
          price INTEGER,
          rating REAL,
          isVeg TEXT
        )
      `);
      
      const dishes = [
        {
          'id': 1,
          'name': 'Paneer Butter Masala',
          'price': 300,
          'rating': 4.5,
          'isVeg': 'true'
        },
        {
          'id': 2,
          'name': 'Chicken Alfredo Pasta',
          'price': 500,
          'rating': 4.7,
          'isVeg': 'false'
        },
        {
          'id': 3,
          'name': 'Veg Hakka Noodles',
          'price': 250,
          'rating': 4.3,
          'isVeg': 'true'
        }
      ]

      const stmt = db.prepare(`INSERT INTO dishes (id, name, price, rating, isVeg) VALUES (?, ?, ?, ?, ?)`);
      dishes.forEach(dish => {
        stmt.run(dish.id, dish.name, dish.price, dish.rating, dish.isVeg);
      });
      stmt.finalize();

      console.log('Dishes table created and data inserted.');
  });
};

const dishCloseDB = () => {
  db.close((err) => {
      if (err) {
          console.error(err.message);
      }
      console.log('Closed the dishes database connection.');
  });
};

// Export the in-memory database
module.exports = { dishInitDB, dishCloseDB };