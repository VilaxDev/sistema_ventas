const mysql = require("mysql2");
const { URL } = require("url");
require("dotenv").config();

// Parseamos la DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

const dbConfig = {
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 20,
  idleTimeout: 30000,
  connectTimeout: 2000,
};

// Solo agregamos SSL si está activado por entorno
if (process.env.DB_USE_SSL === "true") {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database (pool)");
    connection.release();
  }
});

module.exports = db;
