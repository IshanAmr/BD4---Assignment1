const sqlite3 = require('sqlite3').verbose();

// Create an in-memory SQLite database
const db = new sqlite3.Database('./restraunt_database.sqlite', (err) => {
  if (err) {
      console.error(err.message);
  }
  console.log('Connected to the restraunt database.');
});

const restrauntInitDB = () => {
  db.serialize(() => {
      // Create table
      db.run('DROP TABLE IF EXISTS restraunts');
      db.run(`
        CREATE TABLE IF NOT EXISTS restraunts (
          id INTEGER PRIMARY KEY,
          name TEXT,
          cuisine TEXT,
          isVeg TEXT,
          rating REAL,
          priceForTwo INTEGER,
          location TEXT,
          hasOutdoorSeating TEXT,
          isLuxury TEXT
        )
      `);
      
      const restraunts = [
        {
          'id': 1,
          'name': 'Spice Kitchen',
          'cuisine': 'Indian',
          'isVeg': 'true',
          'rating': 4.5,
          'priceForTwo': 1500,
          'location': 'MG Road',
          'hasOutdoorSeating': 'true',
          'isLuxury': 'false'
        },
        {
          'id': 2,
          'name': 'Olive Bistro',
          'cuisine': 'Italian',
          'isVeg': 'false',
          'rating': 4.2,
          'priceForTwo': 2000,
          'location': 'Jubilee Hills',
          'hasOutdoorSeating': 'false',
          'isLuxury': 'true'
        },
        {
          'id': 3,
          'name': 'Green Leaf',
          'cuisine': 'Chinese',
          'isVeg': 'true',
          'rating': 4.0,
          'priceForTwo': 1000,
          'location': 'Banjara Hills',
          'hasOutdoorSeating': 'false',
          'isLuxury': 'false'
        }
      ]
      const stmt = db.prepare(`INSERT INTO restraunts (id, name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      restraunts.forEach(restraunt => {
        stmt.run(restraunt.id, restraunt.name, restraunt.cuisine, restraunt.isVeg, restraunt.rating, restraunt.priceForTwo, restraunt.location, restraunt.hasOutdoorSeating, restraunt.isLuxury);
      });
      stmt.finalize();

      console.log('Restraunts table created and data inserted.');
  });

  db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the restraunts database connection.');
});
};

// Export the in-memory database
module.exports = { restrauntInitDB };