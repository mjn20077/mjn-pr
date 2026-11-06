const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dab_secret";

// ===============================
// DATABASE CONNECTION
// ===============================

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dab_enterprise",
  waitForConnections: true,
  connectionLimit: 10,
});

// ===============================
// AUTH MIDDLEWARE
// ===============================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, JWT_SECRET);

    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ===============================
// CREATE FIRST USER
// ===============================

app.post("/api/users", async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [user_name]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(user_name,password) VALUES (?,?)",
      [user_name, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
  try {
    const { user_name, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_name=?",
      [user_name]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.user_name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===============================
// STOCK IN
// ===============================

// CREATE
app.post("/api/stockin", verifyToken, async (req, res) => {
  try {
    const {
      item_name,
      description,
      quantity_in,
      total_quantity_in,
      supplier_name,
      stockin_date,
    } = req.body;

    await db.query(
      `INSERT INTO stockin
      (item_name,description,quantity_in,total_quantity_in,supplier_name,stockin_date)
      VALUES (?,?,?,?,?,?)`,
      [
        item_name,
        description,
        quantity_in,
        total_quantity_in,
        supplier_name,
        stockin_date,
      ]
    );

    res.json({
      success: true,
      message: "Stock In added",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
app.get("/api/stockin", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM stockin ORDER BY stockin_id DESC"
  );

  res.json(rows);
});

// GET ONE
app.get("/api/stockin/:id", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM stockin WHERE stockin_id=?",
    [req.params.id]
  );

  res.json(rows[0]);
});

// UPDATE
app.put("/api/stockin/:id", verifyToken, async (req, res) => {
  const {
    item_name,
    description,
    quantity_in,
    total_quantity_in,
    supplier_name,
    stockin_date,
  } = req.body;

  await db.query(
    `UPDATE stockin SET
    item_name=?,
    description=?,
    quantity_in=?,
    total_quantity_in=?,
    supplier_name=?,
    stockin_date=?
    WHERE stockin_id=?`,
    [
      item_name,
      description,
      quantity_in,
      total_quantity_in,
      supplier_name,
      stockin_date,
      req.params.id,
    ]
  );

  res.json({
    success: true,
    message: "Updated successfully",
  });
});

// DELETE
app.delete("/api/stockin/:id", verifyToken, async (req, res) => {
  await db.query(
    "DELETE FROM stockin WHERE stockin_id=?",
    [req.params.id]
  );

  res.json({
    success: true,
    message: "Deleted successfully",
  });
});

// ===============================
// STOCK OUT
// ===============================

// CREATE
app.post("/api/stockout", verifyToken, async (req, res) => {
  try {
    const {
      item_name,
      quantity_out,
      total_quantity_out,
      stockout_date,
    } = req.body;

    const [stockIn] = await db.query(
      `SELECT COALESCE(SUM(quantity_in),0) totalIn
       FROM stockin
       WHERE item_name=?`,
      [item_name]
    );

    const [stockOut] = await db.query(
      `SELECT COALESCE(SUM(quantity_out),0) totalOut
       FROM stockout
       WHERE item_name=?`,
      [item_name]
    );

    const available =
      stockIn[0].totalIn - stockOut[0].totalOut;

    if (quantity_out > available) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    await db.query(
      `INSERT INTO stockout
      (item_name,quantity_out,total_quantity_out,stockout_date)
      VALUES (?,?,?,?)`,
      [
        item_name,
        quantity_out,
        total_quantity_out,
        stockout_date,
      ]
    );

    res.json({
      success: true,
      message: "Stock Out added",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
app.get("/api/stockout", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM stockout ORDER BY stockout_id DESC"
  );

  res.json(rows);
});

// UPDATE
app.put("/api/stockout/:id", verifyToken, async (req, res) => {
  const {
    item_name,
    quantity_out,
    total_quantity_out,
    stockout_date,
  } = req.body;

  await db.query(
    `UPDATE stockout SET
    item_name=?,
    quantity_out=?,
    total_quantity_out=?,
    stockout_date=?
    WHERE stockout_id=?`,
    [
      item_name,
      quantity_out,
      total_quantity_out,
      stockout_date,
      req.params.id,
    ]
  );

  res.json({
    success: true,
    message: "Updated successfully",
  });
});

// DELETE
app.delete("/api/stockout/:id", verifyToken, async (req, res) => {
  await db.query(
    "DELETE FROM stockout WHERE stockout_id=?",
    [req.params.id]
  );

  res.json({
    success: true,
    message: "Deleted successfully",
  });
});

// ===============================
// REPORTS
// ===============================

// CURRENT STOCK REPORT
app.get(
  "/api/reports/current-stock",
  verifyToken,
  async (req, res) => {
    const [rows] = await db.query(`
      SELECT
      si.item_name,
      COALESCE(SUM(si.quantity_in),0) total_in,
      COALESCE(SUM(so.quantity_out),0) total_out,
      COALESCE(SUM(si.quantity_in),0)
      -
      COALESCE(SUM(so.quantity_out),0)
      AS balance
      FROM stockin si
      LEFT JOIN stockout so
      ON si.item_name = so.item_name
      GROUP BY si.item_name
    `);

    res.json(rows);
  }
);

// DAILY REPORT
app.get(
  "/api/reports/daily",
  verifyToken,
  async (req, res) => {
    const [stockIn] = await db.query(
      "SELECT * FROM stockin WHERE stockin_date = CURDATE()"
    );

    const [stockOut] = await db.query(
      "SELECT * FROM stockout WHERE stockout_date = CURDATE()"
    );

    res.json({
      stockIn,
      stockOut,
    });
  }
);

// MONTHLY REPORT
app.get(
  "/api/reports/monthly",
  verifyToken,
  async (req, res) => {
    const [stockIn] = await db.query(`
      SELECT * FROM stockin
      WHERE MONTH(stockin_date)=MONTH(CURDATE())
      AND YEAR(stockin_date)=YEAR(CURDATE())
    `);

    const [stockOut] = await db.query(`
      SELECT * FROM stockout
      WHERE MONTH(stockout_date)=MONTH(CURDATE())
      AND YEAR(stockout_date)=YEAR(CURDATE())
    `);

    res.json({
      stockIn,
      stockOut,
    });
  }
);

// DASHBOARD
app.get(
  "/api/reports/dashboard",
  verifyToken,
  async (req, res) => {
    const [users] = await db.query(
      "SELECT COUNT(*) totalUsers FROM users"
    );

    const [stockIn] = await db.query(
      "SELECT COALESCE(SUM(quantity_in),0) totalIn FROM stockin"
    );

    const [stockOut] = await db.query(
      "SELECT COALESCE(SUM(quantity_out),0) totalOut FROM stockout"
    );

    res.json({
      totalUsers: users[0].totalUsers,
      totalStockIn: stockIn[0].totalIn,
      totalStockOut: stockOut[0].totalOut,
      currentBalance:
        stockIn[0].totalIn - stockOut[0].totalOut,
    });
  }
);

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`My DAB Entreprise ltd project is running on port ${PORT}`);
});