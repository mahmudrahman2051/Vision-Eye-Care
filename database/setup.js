/**
 * Vision Eye Care — Database Setup Script
 * 
 * Runs schema.sql and seed.sql against the Neon PostgreSQL database,
 * then creates the admin user with a hashed password.
 * 
 * Usage: node database/setup.js
 */

const path = require('path');
const fs = require('fs');

// Resolve modules from server/node_modules
const serverDir = path.join(__dirname, '..', 'server');
const dotenv = require(path.join(serverDir, 'node_modules', 'dotenv'));
const pg = require(path.join(serverDir, 'node_modules', 'pg'));
const bcrypt = require(path.join(serverDir, 'node_modules', 'bcryptjs'));

// Load env from server/.env
dotenv.config({ path: path.join(serverDir, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();

  try {
    console.log('\n🔧 Vision Eye Care — Database Setup\n');

    // 1. Drop existing tables
    console.log('📋 Step 1: Dropping existing tables ...');
    await client.query(`
      DROP TABLE IF EXISTS order_status_history CASCADE;
      DROP TABLE IF EXISTS coupon_usages CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS addresses CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS wishlist_items CASCADE;
      DROP TABLE IF EXISTS product_tags CASCADE;
      DROP TABLE IF EXISTS tags CASCADE;
      DROP TABLE IF EXISTS product_images CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS subcategories CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS coupons CASCADE;
      DROP TABLE IF EXISTS contact_messages CASCADE;
      DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
    `);
    console.log('   ✅ Tables dropped.\n');

    // 2. Run schema.sql (creates only)
    console.log('📋 Step 2: Running schema.sql ...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSQL);
    console.log('   ✅ Schema created successfully.\n');

    // 2. Run seed.sql
    console.log('🌱 Step 2: Running seed.sql ...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await client.query('BEGIN');
    await client.query(seedSQL);
    await client.query('COMMIT');
    console.log('   ✅ Seed data inserted successfully.\n');

    // 3. Create admin user
    console.log('👤 Step 3: Creating admin user ...');
    const adminPassword = 'Admin@123';
    const hash = await bcrypt.hash(adminPassword, 10);

    await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin', 'admin@visioneyecare.com', '+8801700000000', hash, 'admin']
    );
    console.log('   ✅ Admin user created.');
    console.log('      Email:    admin@visioneyecare.com');
    console.log('      Password: Admin@123');
    console.log('      ⚠️  Change this password before production!\n');

    // 4. Create a sample customer
    console.log('👤 Step 4: Creating sample customer ...');
    const custHash = await bcrypt.hash('Customer@123', 10);
    await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['Rahim Ahmed', 'rahim@example.com', '+8801711111111', custHash, 'customer']
    );
    console.log('   ✅ Sample customer created.');
    console.log('      Email:    rahim@example.com');
    console.log('      Password: Customer@123\n');

    // 5. Verify counts
    console.log('📊 Step 5: Verification ...');
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM users'),
      client.query('SELECT COUNT(*) FROM categories'),
      client.query('SELECT COUNT(*) FROM subcategories'),
      client.query('SELECT COUNT(*) FROM products'),
      client.query('SELECT COUNT(*) FROM tags'),
      client.query('SELECT COUNT(*) FROM product_tags'),
      client.query('SELECT COUNT(*) FROM coupons'),
    ]);

    console.log(`   Users:         ${counts[0].rows[0].count}`);
    console.log(`   Categories:    ${counts[1].rows[0].count}`);
    console.log(`   Subcategories: ${counts[2].rows[0].count}`);
    console.log(`   Products:      ${counts[3].rows[0].count}`);
    console.log(`   Tags:          ${counts[4].rows[0].count}`);
    console.log(`   Product Tags:  ${counts[5].rows[0].count}`);
    console.log(`   Coupons:       ${counts[6].rows[0].count}`);

    // 6. Test a join query
    console.log('\n🔗 Step 6: Testing relationships ...');
    const joinTest = await client.query(`
      SELECT p.name AS product, c.name AS category, s.name AS subcategory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LIMIT 5
    `);
    joinTest.rows.forEach((row) => {
      console.log(`   ${row.product} → ${row.category} → ${row.subcategory || 'N/A'}`);
    });

    console.log('\n✅ Database setup complete!\n');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
