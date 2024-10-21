const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { dishInitDB } = require('./dishDB');
const { restrauntInitDB } = require('./restrauntDB');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

dishInitDB();
const dishDB = new sqlite3.Database('./dish_database.sqlite');

restrauntInitDB();
const restrauntDB = new sqlite3.Database('./restraunt_database.sqlite');


const getAllDishes = async () => {
    return new Promise((resolve, reject)=> {
      dishDB.all('SELECT * FROM dishes', [], (err, data)=> {
            if(err) return reject(err);

            resolve({ dishes : data });
        })
    })
}

app.get("/dishes", async (req, res) => {
     try {
        const results = await getAllDishes();
        if(results.dishes.length === 0) return res.status(404).json({ message : `No dishes found.`});

        res.status(200).json(results);
     } catch (error) {
         return res.status(500).json({ error : error.message });
     }
})

const getAllRestraunts = async () => {
    return new Promise((resolve, reject) => {
      restrauntDB.all('SELECT * FROM restraunts', [], (err, data)=> {
           if(err) return reject(err);

           resolve({ restraunts : data });
        })
    })
}

app.get("/restaurants", async (req, res) => {
  try {
    const results = await getAllRestraunts();
    if(results.restraunts.length === 0) return res.status(404).json({ message : `No restraunts found.`});

    res.status(200).json(results);
 } catch (error) {
     return res.status(500).json({ error : error.message });
 }   
})

const fetchRestrauntsById = async (id) => {
    return new Promise((resolve, reject) => {
      restrauntDB.all("SELECT * FROM restraunts WHERE id = ?", [id], (err, data) => {
          if(err) return reject(err);

          resolve({ restraunts : data });
      })
    })
}

app.get("/restaurants/details/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const results = await fetchRestrauntsById(id);
      if(results.restraunts.length === 0) return res.status(404).json({ message : `No restraunt with the id ${id} found.`});

      res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ error : error.message });
    }
})

const fetchDishesyId = async (id) => {
  return new Promise((resolve, reject) => {
    dishDB.all("SELECT * FROM dishes WHERE id = ?", [id], (err, data) => {
        if(err) return reject(err);

        resolve({ dishes : data });
    })
  })
}

app.get("/dishes/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await fetchDishesyId(id);
    if(results.dishes.length === 0) return res.status(404).json({ message : `No dishes with the id ${id} found.`});

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error : error.message });
  }
})

const fetchRestrauntSortedByRating = async () => {
    return new Promise((resolve, reject) => {
        restrauntDB.all("SELECT * FROM restraunts ORDER BY rating", [], (err, data)=> {
            if(err) return reject(err);

            resolve({ restraunts : data });
        })
    })
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
    try {
        const results = await fetchRestrauntSortedByRating();
        if(results.restraunts.length === 0) return res.status(404).json({ message : `No restraunt found.`});

        res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error : error.message });
    }
})

const fetchDishesSortedByPrice = async () => {
  return new Promise((resolve, reject) => {
    dishDB.all("SELECT * FROM dishes ORDER BY price", [], (err, data)=> {
        if(err) return reject(err);

        resolve({ dishes : data });
    })
})    
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
      const results = await fetchDishesSortedByPrice();
      if(results.dishes.length === 0) return res.status(404).json({ message : `No dish found.`});

      res.status(200).json(results);
  } catch (error) {
      return res.status(500).json({ error : error.message });
  }
})

const getRestrauntByFilter = async (isVeg, hasOutdoorSeating, isLuxury) => {
  return new Promise((resolve, reject) => {
    restrauntDB.all("SELECT * FROM restraunts WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?", [isVeg, hasOutdoorSeating, isLuxury], (err, data)=> {
        if(err) return reject(err);

        resolve({ restraunts : data });
    })
}) 
}

app.get("/restaurants/filter", async (req, res) => {
  try {
      let isVeg = req.query.isVeg;
      let hasOutdoorSeating = req.query.hasOutdoorSeating;
      let isLuxury = req.query.isLuxury;
      const results = await getRestrauntByFilter(isVeg, hasOutdoorSeating, isLuxury);
      if(results.restraunts.length === 0) return res.status(404).json({ message : `No restraunt found.`});

      res.status(200).json(results);
  } catch (error) {
      return res.status(500).json({ error : error.message });
  }
})

const getDishesByFilter = async (isVeg) => {
  return new Promise((resolve, reject) => {
    dishDB.all("SELECT * FROM dishes WHERE isVeg = ?", [isVeg], (err, data)=> {
        if(err) return reject(err);

        resolve({ dishes : data });
    })
})    
}

app.get("/dishes/filter", async (req, res) => {
  try {
      const isVeg = req.query.isVeg;
      const results = await getDishesByFilter(isVeg);
      if(results.dishes.length === 0) return res.status(404).json({ message : `No dish found.`});

      res.status(200).json(results);
  } catch (error) {
      return res.status(500).json({ error : error.message });
  }
})

const fetchRestrauntByCuisine = async (cuisine) => {
    return new Promise((resolve, reject) => {
        restrauntDB.all("SELECT * FROM restraunts WHERE cuisine = ?", [cuisine], (err, data) => {
          if(err) return reject(err);

          resolve({ restraunts : data });
        })
    })
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
    try {
       let cuisine = req.params.cuisine;
       let results = await fetchRestrauntByCuisine(cuisine);
       if(results.restraunts.length === 0) return res.status(404).json({ message : `No restraunt found.`});
       res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ error : error.message });
    }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
