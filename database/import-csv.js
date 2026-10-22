/**
 * Vision Eye Care — Database CSV Product Importer
 * 
 * Imports or updates all products from asstes/Vision_Eye_Care_Produst List.csv
 * into the Neon PostgreSQL products table.
 * 
 * Usage: node database/import-csv.js
 */

const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', 'server');
let dotenv, pg;

try {
  dotenv = require(path.join(serverDir, 'node_modules', 'dotenv'));
  pg = require(path.join(serverDir, 'node_modules', 'pg'));
} catch (e) {
  try {
    dotenv = require('dotenv');
    pg = require('pg');
  } catch (err) {
    console.error('❌ Missing dependencies. Please run "npm install" inside the server directory.');
    process.exit(1);
  }
}

dotenv.config({ path: path.join(serverDir, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const realProductsPath = path.join(serverDir, 'data', 'realProducts.json');
if (!fs.existsSync(realProductsPath)) {
  console.error('❌ realProducts.json not found! Run update-seed.js first.');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(realProductsPath, 'utf-8'));

async function importProducts() {
  if (!process.env.DATABASE_URL) {
    console.log('\n⚠️  DATABASE_URL environment variable is not set.');
    console.log('   The real products have been pre-compiled into:');
    console.log('   - asstes/Vision_Eye_Care_Produst List.csv (with Product Code column)');
    console.log('   - database/schema.sql (with product_code column and index)');
    console.log('   - database/seed.sql (108 real products SQL seed)');
    console.log('   - client/src/data/realProducts.js (client catalog)');
    console.log('   - server/data/realProducts.json (server catalog)');
    console.log('\n   To sync directly with live Neon PostgreSQL, add DATABASE_URL to server/.env and re-run this script.\n');
    return;
  }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    console.log('\n🚀 Starting product sync to database...\n');

    // Ensure product_code column exists
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS product_code VARCHAR(50) UNIQUE;
      CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
    `);
    console.log('✅ Ensured product_code column and index exist in DB.');

    // Clear old mock products (products with sku starting with VEC-)
    const delRes = await client.query(`DELETE FROM products WHERE sku LIKE 'VEC-%' OR product_code IS NULL`);
    console.log(`🧹 Removed ${delRes.rowCount} old mock products from database.`);

    let inserted = 0;
    let updated = 0;

    for (const p of products) {
      const res = await client.query(
        `INSERT INTO products (
          name, product_code, slug, sku, description, short_description,
          price, compare_price, stock, low_stock_threshold, category_id, subcategory_id,
          brand, frame_material, frame_shape, frame_color, gender, size,
          status, featured, bestseller, new_arrival
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        )
        ON CONFLICT (product_code) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          sku = EXCLUDED.sku,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          price = EXCLUDED.price,
          compare_price = EXCLUDED.compare_price,
          stock = EXCLUDED.stock,
          brand = EXCLUDED.brand,
          gender = EXCLUDED.gender,
          size = EXCLUDED.size,
          category_id = EXCLUDED.category_id,
          updated_at = NOW()
        RETURNING (xmax = 0) AS is_insert;`,
        [
          p.name, p.product_code, p.slug, p.sku, p.description, p.short_description,
          p.price, p.compare_price, p.stock, p.low_stock_threshold, p.category_id, null,
          p.brand, p.frame_material, p.frame_shape, p.frame_color, p.gender, p.size,
          p.status, p.featured, p.bestseller, p.new_arrival
        ]
      );

      if (res.rows[0].is_insert) {
        inserted++;
      } else {
        updated++;
      }
    }

    console.log(`\n🎉 Product sync complete!`);
    console.log(`   - Total processed: ${products.length}`);
    console.log(`   - Newly inserted:  ${inserted}`);
    console.log(`   - Updated:         ${updated}\n`);
  } catch (err) {
    console.error('❌ Database sync failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

importProducts();
