const mysql = require("mysql2");
const { URL } = require("url");
require("dotenv").config();

// Parseamos la DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: false, // importante para conexiones en la nube
  },
  waitForConnections: true,
  connectionLimit: 20,
  idleTimeout: 30000,
  connectTimeout: 2000,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database (pool)");
    connection.release();
  }
});

module.exports = db;
