const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = require("./database/database");
const setupRoutes = require("./routes/routes");

// Configuración del motor de plantillas
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// Rutas principales
app.get("/", (req, res) => {
  res.redirect("/productos");
});

setupRoutes(app, db);

// API endpoint para obtener precio de producto
app.get("/api/productos/:id/precio", (req, res) => {
  const query = "SELECT precio, stock FROM productos WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error del servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
