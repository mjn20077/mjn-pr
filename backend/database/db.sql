
-- =========================================
-- DAB ENTERPRISE LTD
-- INVENTORY MANAGEMENT SYSTEM
-- =========================================

-- Create database
CREATE DATABASE IF NOT EXISTS dab_enterprise;

-- Select database
USE dab_enterprise;


-- =========================================
-- 1. USERS TABLE
-- =========================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. STOCK IN TABLE
-- =========================================

CREATE TABLE stockin (
    stockin_id INT AUTO_INCREMENT PRIMARY KEY,

    item_name VARCHAR(150) NOT NULL,

    description TEXT,

    quantity_in INT NOT NULL,

    total_quantity_in INT NOT NULL,

    supplier_name VARCHAR(150),

    stockin_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 3. STOCK OUT TABLE
-- =========================================

CREATE TABLE stockout (
    stockout_id INT AUTO_INCREMENT PRIMARY KEY,

    item_name VARCHAR(150) NOT NULL,

    quantity_out INT NOT NULL,

    total_quantity_out INT NOT NULL,

    stockout_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 4. INDEXES
-- =========================================

CREATE INDEX idx_stockin_item
ON stockin(item_name);

CREATE INDEX idx_stockin_date
ON stockin(stockin_date);

CREATE INDEX idx_stockout_item
ON stockout(item_name);

CREATE INDEX idx_stockout_date
ON stockout(stockout_date);


-- =========================================
-- 5. CHECK DATABASE TABLES
-- =========================================

SHOW TABLES;

-- Check table structures
DESCRIBE users;
DESCRIBE stockin;
DESCRIBE stockout;
