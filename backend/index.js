const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const { requireLogin, response, action_codes } = require("./standards");

const app = express();
 
app.use(
  cors({  
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("Session ID:", req?.session?.user?.id);
  console.log(
    "User in session:",
    req.session ? req.session.user : "No session"
  );
  next();
});
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventory",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL");
});
let lastID = 1;
app.post("/login",(req,res)=>{
  const {email,password} = req.body;
  id= ++lastID;
  req.session.user = {email:email,id:id}
  res.status(200).json({user:req.session.user})
})
app.post("/inventory",(req,res)=>{
  return requireLogin(req,res,()=>{
    db.query(`SELECT 
  product.id,
  product.Product_Name AS product,
  product.price,
  product.quantity,
  product.Category_id_fk AS class,
  category.Category_Name AS category
FROM product
JOIN category ON product.Category_id_fk = category.id;

`,(err,result)=>{
  console.log(result);
  
      return res.status(200).json({response:result})
    })
  });
})
app.post("/inventory/add", (req, res) => {
  return requireLogin(req, res, () => {
    const { product, price, quantity, class: categoryName } = req.body;

    db.query("SELECT id FROM category WHERE Category_Name = ?", [categoryName], (err, results) => {
      if (err) return res.status(500).json({ error: "Error checking category", details: err });

      const insertProduct = (categoryId) => {
        const sql = `
          INSERT INTO product (Product_Name, Price, Quantity, Category_id_fk, Product_Image, Created_at, Updated_at)
          VALUES (?, ?, ?, ?, '', NOW(), NOW())
        `;
        db.query(sql, [product, price, quantity, categoryId], (err, result) => {
          if (err) return res.status(500).json({ error: "Error inserting product", details: err });
          return res.status(200).json({ message: "Product added", productId: result.insertId });
        });
      };

      if (results.length > 0) insertProduct(results[0].id);
      else {
        db.query("INSERT INTO category (Category_Name) VALUES (?)", [categoryName], (err, result) => {
          if (err) return res.status(500).json({ error: "Error inserting category", details: err });
          insertProduct(result.insertId);
        });
      }
    });
  });
});

app.put("/inventory/edit/:id", (req, res) => {
  return requireLogin(req, res, () => {
    const { product, price, quantity, class: categoryName } = req.body;
    const productId = req.params.id;

    if (!product || !price || !quantity || !categoryName) {
      return res.status(400).json({ message: "All fields are required." });
    }
    db.query("SELECT id FROM category WHERE Category_Name = ?", [categoryName], (err, categoryResult) => {
      if (err) return res.status(500).json({ message: "Category lookup failed", error: err });

      const handleUpdate = (categoryId) => {
        const updateQuery = `
          UPDATE product 
          SET Product_Name = ?, Price = ?, Quantity = ?, Category_id_fk = ?, Updated_at = NOW()
          WHERE id = ?
        `;

        db.query(updateQuery, [product, price, quantity, categoryId, productId], (err, updateResult) => {
          if (err) return res.status(500).json({ message: "Update failed", error: err });

          if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "No product found with this ID" });
          }

          return res.status(200).json({ message: "Product updated successfully", affected: updateResult.affectedRows });
        });
      };

      if (categoryResult.length > 0) {
        handleUpdate(categoryResult[0].id);
      } else {
        db.query("INSERT INTO category (Category_Name) VALUES (?)", [categoryName], (err, insertCatResult) => {
          if (err) return res.status(500).json({ message: "Category creation failed", error: err });
          handleUpdate(insertCatResult.insertId);
        });
      }
    });
  });
});


app.delete("/inventory/delete/:id", (req, res) => {
  return requireLogin(req, res, () => {
    const { id } = req.params;
    db.query("DELETE FROM product WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Error deleting product", details: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json({ message: "Product deleted", deletedId: id });
    });
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
