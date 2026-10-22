-- ============================================
-- Migration: Add product_code column to products and order_items
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS product_code VARCHAR(50) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_code VARCHAR(50);
