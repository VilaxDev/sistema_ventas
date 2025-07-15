const mysql = require("mysql2");
require("dotenv").config();

// Configuración de la base de datos usando variables de entorno
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// Conectar a la base de datos
console.log("Pool de MySQL creado correctamente");

module.exports = db;
