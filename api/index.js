import { neon } from '@neondatabase/serverless';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
    responseLimit: '15mb',
  },
};

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL;

const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Safe SQL query helper that never crashes cold-start reads
async function safeQuery(queryString, params = []) {
  if (!sql) return [];
  try {
    return await sql.query(queryString, params);
  } catch (err) {
    console.error('SQL Query Error:', err.message);
    return [];
  }
}

// Dynamic password verification helper (Zero top-level dependencies)
async function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  try {
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default?.default || bcryptModule.default || bcryptModule;
    if (typeof bcrypt.compare === 'function') {
      return await bcrypt.compare(password, hash);
    }
  } catch (err) {
    console.error('Password verification error:', err);
  }
  return false;
}

// Default Ticker Settings (Factory Fallback)
const DEFAULT_MAIN_TICKER = {
  enabled: true,
  speed: 28,
  direction: 'left',
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  accentColor: '#FFFFFF',
  pauseOnHover: true,
  separator: '✦',
  messages: [
    {
      id: '1',
      text: 'Complimentary Nationwide Express Delivery on all orders over ৳5,000',
      badge: 'FREE SHIPPING',
      link: '/shop',
    },
    {
      id: '2',
      text: 'Custom Japanese CNC Lens Milling & Precision Anti-Reflective Coating in Dhaka',
      badge: 'PRECISION LAB',
      link: '/about',
    },
    {
      id: '3',
      text: 'Experience 100+ Designer Frames in the comfort of your home across Dhaka',
      badge: 'HOME TRIAL',
      link: '/contact',
    },
    {
      id: '4',
      text: '1-Year International Warranty on All Titanium & Handcrafted Acetate Frames',
      badge: 'WARRANTY',
      link: '/faq',
    },
  ],
};

const DEFAULT_COUPON_TICKER = {
  enabled: true,
  speed: 24,
  direction: 'left',
  pauseOnHover: true,
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  accentColor: '#FFFFFF',
  separator: '✦',
  promptText: '[Click to Copy]',
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Eyeglasses', slug: 'eyeglasses' },
  { id: 2, name: 'Sunglasses', slug: 'sunglasses' },
  { id: 3, name: 'Contact Lenses', slug: 'contact-lenses' },
  { id: 4, name: 'Eyeglass Cases', slug: 'eyeglass-cases' },
  { id: 5, name: 'Cleaning Solutions', slug: 'cleaning-solutions' },
];

// Helper to send json
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Helper to safely parse incoming request body
async function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  let pathname = url.pathname.replace(/^\/api/, '');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  const segments = pathname.split('/').filter(Boolean);

  const route0 = segments[0] || '';
  const route1 = segments[1] || '';
  const route2 = segments[2] || '';

  try {
    // ------------------------------------------------------------------------
    // HEALTH CHECK
    // ------------------------------------------------------------------------
    if (route0 === 'health') {
      return sendJson(res, 200, {
        status: 'success',
        message: 'Vision Eye Care Neon Serverless API Online',
        database_connected: Boolean(sql),
        timestamp: new Date().toISOString(),
      });
    }

    // ------------------------------------------------------------------------
    // MARQUEE TICKER (Public & General Endpoints)
    // ------------------------------------------------------------------------
    if (route0 === 'ticker') {
      // GET /api/ticker/coupon - Coupon Marquee Ticker Settings
      if (route1 === 'coupon') {
        if (req.method === 'GET') {
          let data = DEFAULT_COUPON_TICKER;
          const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'coupon_ticker' LIMIT 1");
          if (rows.length > 0 && rows[0].value) {
            try {
              data = JSON.parse(rows[0].value);
            } catch {}
          }
          return sendJson(res, 200, { status: 'success', data });
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          await sql.query(
            `INSERT INTO site_settings (key, value, category, label, updated_at)
             VALUES ('coupon_ticker', $1, 'marquee', 'Coupon Marquee Ticker Settings', NOW())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
            [JSON.stringify(body)]
          );
          return sendJson(res, 200, {
            status: 'success',
            message: 'Coupon ticker settings saved successfully in database!',
            data: body,
          });
        }
      }

      // GET /api/ticker - Main Announcement Marquee Ticker Settings
      if (!route1 && req.method === 'GET') {
        let data = DEFAULT_MAIN_TICKER;
        const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'marquee_ticker' LIMIT 1");
        if (rows.length > 0 && rows[0].value) {
          try {
            data = JSON.parse(rows[0].value);
          } catch {}
        }
        return sendJson(res, 200, { status: 'success', data });
      }

      // PUT /api/ticker - Main Announcement Marquee Ticker Update
      if (!route1 && (req.method === 'PUT' || req.method === 'POST')) {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const body = await getBody(req);
        await sql.query(
          `INSERT INTO site_settings (key, value, category, label, updated_at)
           VALUES ('marquee_ticker', $1, 'marquee', 'Marquee Announcement Ticker Settings', NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [JSON.stringify(body)]
        );
        return sendJson(res, 200, {
          status: 'success',
          message: 'Main announcement ticker saved successfully in database!',
          data: body,
        });
      }
    }

    // ------------------------------------------------------------------------
    // COUPONS (Public & Validation)
    // ------------------------------------------------------------------------
    if (route0 === 'coupons') {
      // POST /api/coupons/validate - Validate coupon code
      if (route1 === 'validate' && req.method === 'POST') {
        const body = await getBody(req);
        const code = (body.code || '').trim().toUpperCase();
        const amount = parseFloat(body.amount || 0);

        if (!sql) {
          return sendJson(res, 200, {
            status: 'success',
            data: { code, discount_amount: 0, description: 'Offline mode' },
          });
        }

        const rows = await safeQuery('SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1', [code]);
        if (rows.length === 0) {
          return sendJson(res, 400, {
            status: 'fail',
            message: `Coupon code "${code}" is invalid or does not exist.`,
          });
        }

        const coupon = rows[0];
        if (!coupon.is_active) {
          return sendJson(res, 400, {
            status: 'fail',
            message: `Coupon code "${code}" is currently inactive.`,
          });
        }

        const minOrder = parseFloat(coupon.min_order_amount || 0);
        if (minOrder > 0 && amount < minOrder) {
          return sendJson(res, 400, {
            status: 'fail',
            message: `Minimum order amount of ৳${minOrder.toLocaleString()} required for code "${coupon.code}". (Cart total: ৳${amount.toLocaleString()})`,
          });
        }

        let discount_amount = 0;
        const val = parseFloat(coupon.discount_value || 0);
        if (coupon.discount_type === 'percentage') {
          discount_amount = Math.round((amount * val) / 100);
          const maxDiscount = parseFloat(coupon.max_discount || 0);
          if (maxDiscount > 0 && discount_amount > maxDiscount) {
            discount_amount = maxDiscount;
          }
        } else {
          discount_amount = Math.min(val, amount);
        }

        return sendJson(res, 200, {
          status: 'success',
          data: {
            code: coupon.code,
            discount_amount,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            description: coupon.description,
            min_order_amount: coupon.min_order_amount,
          },
        });
      }

      // GET /api/coupons - List active coupons for public tickers and cart
      if (req.method === 'GET') {
        const coupons = await safeQuery('SELECT * FROM coupons WHERE is_active = true ORDER BY id ASC');
        return sendJson(res, 200, { status: 'success', data: coupons });
      }
    }

    // ------------------------------------------------------------------------
    // BANNERS (Public & Homepage)
    // ------------------------------------------------------------------------
    if (route0 === 'banners') {
      if (req.method === 'GET') {
        const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'banners_config' LIMIT 1");
        if (rows.length > 0 && rows[0].value) {
          try {
            return sendJson(res, 200, { status: 'success', data: JSON.parse(rows[0].value) });
          } catch {}
        }
        // Fallback to active banners from banners table
        const bannerRows = await safeQuery('SELECT * FROM banners WHERE is_active = true ORDER BY sort_order ASC');
        return sendJson(res, 200, {
          status: 'success',
          data: {
            heroBanners: bannerRows.filter((b) => b.section === 'hero').map((b) => ({
              id: b.id,
              src: b.image_url,
              title: b.title,
              subtitle: b.subtitle,
              badge: b.badge,
              ctaText: b.cta_text,
              ctaLink: b.cta_link,
            })),
            promoBanners: bannerRows.filter((b) => b.section !== 'hero').map((b) => ({
              id: b.id,
              image: b.image_url,
              title: b.title,
              link: b.cta_link,
              enabled: b.is_active,
            })),
          },
        });
      }
    }

    // ------------------------------------------------------------------------
    // ADMIN ENDPOINTS
    // ------------------------------------------------------------------------
    if (route0 === 'admin') {
      // ADMIN MAIN ANNOUNCEMENT TICKER: GET & PUT /api/admin/ticker
      if (route1 === 'ticker') {
        if (req.method === 'GET') {
          let data = DEFAULT_MAIN_TICKER;
          const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'marquee_ticker' LIMIT 1");
          if (rows.length > 0 && rows[0].value) {
            try {
              data = JSON.parse(rows[0].value);
            } catch {}
          }
          return sendJson(res, 200, { status: 'success', data });
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          await sql.query(
            `INSERT INTO site_settings (key, value, category, label, updated_at)
             VALUES ('marquee_ticker', $1, 'marquee', 'Marquee Announcement Ticker Settings', NOW())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
            [JSON.stringify(body)]
          );
          return sendJson(res, 200, {
            status: 'success',
            message: 'Main announcement ticker saved successfully in database!',
            data: body,
          });
        }
      }

      // ADMIN COUPON TICKER: GET & PUT /api/admin/coupon-ticker
      if (route1 === 'coupon-ticker') {
        if (req.method === 'GET') {
          let data = DEFAULT_COUPON_TICKER;
          const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'coupon_ticker' LIMIT 1");
          if (rows.length > 0 && rows[0].value) {
            try {
              data = JSON.parse(rows[0].value);
            } catch {}
          }
          return sendJson(res, 200, { status: 'success', data });
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          await sql.query(
            `INSERT INTO site_settings (key, value, category, label, updated_at)
             VALUES ('coupon_ticker', $1, 'marquee', 'Coupon Marquee Ticker Settings', NOW())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
            [JSON.stringify(body)]
          );
          return sendJson(res, 200, {
            status: 'success',
            message: 'Coupon ticker settings saved successfully in database!',
            data: body,
          });
        }
      }

      // ADMIN HOMEPAGE BANNERS: GET & PUT /api/admin/banners
      if (route1 === 'banners') {
        if (req.method === 'GET') {
          const rows = await safeQuery("SELECT value FROM site_settings WHERE key = 'banners_config' LIMIT 1");
          let data = null;
          if (rows.length > 0 && rows[0].value) {
            try {
              data = JSON.parse(rows[0].value);
            } catch {}
          }
          return sendJson(res, 200, { status: 'success', data });
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          await sql.query(
            `INSERT INTO site_settings (key, value, category, label, updated_at)
             VALUES ('banners_config', $1, 'banners', 'Homepage Banners Configuration', NOW())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
            [JSON.stringify(body)]
          );
          return sendJson(res, 200, {
            status: 'success',
            message: 'Banners updated successfully in database!',
            data: body,
          });
        }
      }

      // ADMIN COUPONS: /api/admin/coupons
      if (route1 === 'coupons') {
        // GET /api/admin/coupons - List all coupons
        if (!route2 && req.method === 'GET') {
          const coupons = await safeQuery('SELECT * FROM coupons ORDER BY id ASC');
          return sendJson(res, 200, { status: 'success', data: coupons });
        }

        // POST /api/admin/coupons - Create coupon
        if (!route2 && req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          const rows = await sql.query(
            `INSERT INTO coupons (
              code, description, discount_type, discount_value, min_order_amount,
              max_discount, usage_limit, used_count, is_active, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, NOW(), NOW())
            RETURNING *`,
            [
              (body.code || '').trim().toUpperCase(),
              body.description || '',
              body.discount_type || 'percentage',
              parseFloat(body.discount_value || 0),
              parseFloat(body.min_order_amount || 0),
              body.max_discount ? parseFloat(body.max_discount) : null,
              body.usage_limit ? parseInt(body.usage_limit, 10) : null,
              body.is_active !== undefined ? Boolean(body.is_active) : true,
            ]
          );
          return sendJson(res, 201, {
            status: 'success',
            message: 'Coupon created successfully in database!',
            data: rows[0],
          });
        }

        // PUT /api/admin/coupons/:id - Update coupon
        if (route2 && req.method === 'PUT') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const couponId = parseInt(route2, 10);
          const body = await getBody(req);
          const rows = await sql.query(
            `UPDATE coupons SET
              code = COALESCE($1, code),
              description = COALESCE($2, description),
              discount_type = COALESCE($3, discount_type),
              discount_value = COALESCE($4, discount_value),
              min_order_amount = COALESCE($5, min_order_amount),
              max_discount = $6,
              usage_limit = $7,
              is_active = COALESCE($8, is_active),
              updated_at = NOW()
             WHERE id = $9 RETURNING *`,
            [
              body.code ? body.code.trim().toUpperCase() : null,
              body.description !== undefined ? body.description : null,
              body.discount_type || null,
              body.discount_value !== undefined ? parseFloat(body.discount_value) : null,
              body.min_order_amount !== undefined ? parseFloat(body.min_order_amount) : null,
              body.max_discount !== undefined ? (body.max_discount ? parseFloat(body.max_discount) : null) : null,
              body.usage_limit !== undefined ? (body.usage_limit ? parseInt(body.usage_limit, 10) : null) : null,
              body.is_active !== undefined ? Boolean(body.is_active) : null,
              couponId,
            ]
          );
          return sendJson(res, 200, {
            status: 'success',
            message: 'Coupon updated successfully in database!',
            data: rows[0],
          });
        }

        // DELETE /api/admin/coupons/:id - Delete coupon
        if (route2 && req.method === 'DELETE') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const couponId = parseInt(route2, 10);
          await sql.query('DELETE FROM coupons WHERE id = $1', [couponId]);
          return sendJson(res, 200, {
            status: 'success',
            message: 'Coupon deleted successfully from database!',
          });
        }
      }

      // ADMIN DASHBOARD: GET /api/admin/dashboard
      if (route1 === 'dashboard') {
        const orderCountRes = await safeQuery('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders');
        const pendingCountRes = await safeQuery("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'");
        const productCountRes = await safeQuery('SELECT COUNT(*) as count FROM products');
        const recentOrders = await safeQuery('SELECT * FROM orders ORDER BY id DESC LIMIT 5');

        return sendJson(res, 200, {
          status: 'success',
          data: {
            metrics: {
              totalOrders: parseInt(orderCountRes[0]?.count || 0, 10),
              totalRevenue: parseFloat(orderCountRes[0]?.revenue || 0),
              pendingOrders: parseInt(pendingCountRes[0]?.count || 0, 10),
              totalProducts: parseInt(productCountRes[0]?.count || 0, 10),
            },
            recentOrders,
          },
        });
      }

      // ADMIN ORDERS: GET /api/admin/orders
      if (route1 === 'orders') {
        const orders = await safeQuery('SELECT * FROM orders ORDER BY id DESC LIMIT 100');
        return sendJson(res, 200, {
          status: 'success',
          data: {
            orders,
            pagination: {
              total: orders.length,
              page: 1,
              limit: 100,
              total_pages: 1,
            },
          },
        });
      }

      // ADMIN STORE SETTINGS: GET & PUT /api/admin/settings
      if (route1 === 'settings') {
        if (req.method === 'GET') {
          const rows = await safeQuery('SELECT key, value FROM site_settings');
          const settingsMap = {};
          for (const row of rows) {
            try {
              settingsMap[row.key] = JSON.parse(row.value);
            } catch {
              settingsMap[row.key] = row.value;
            }
          }
          return sendJson(res, 200, { status: 'success', data: settingsMap });
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
          const body = await getBody(req);
          if (typeof body === 'object' && body !== null) {
            for (const [key, val] of Object.entries(body)) {
              const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
              await sql.query(
                `INSERT INTO site_settings (key, value, category, label, updated_at)
                 VALUES ($1, $2, 'store', $1, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
                [key, valStr]
              );
            }
          }
          return sendJson(res, 200, {
            status: 'success',
            message: 'Store settings saved successfully in database!',
            data: body,
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // SETTINGS (Public Store Settings: GET /api/settings)
    // ------------------------------------------------------------------------
    if (route0 === 'settings') {
      if (req.method === 'GET') {
        const rows = await safeQuery('SELECT key, value FROM site_settings');
        const settingsMap = {};
        for (const row of rows) {
          try {
            settingsMap[row.key] = JSON.parse(row.value);
          } catch {
            settingsMap[row.key] = row.value;
          }
        }
        return sendJson(res, 200, { status: 'success', data: settingsMap });
      }
    }

    // ------------------------------------------------------------------------
    // CATEGORIES
    // ------------------------------------------------------------------------
    if (route0 === 'categories') {
      const rows = await safeQuery('SELECT id, name, slug FROM categories ORDER BY id ASC');
      return sendJson(res, 200, { status: 'success', data: rows.length > 0 ? rows : DEFAULT_CATEGORIES });
    }

    // ------------------------------------------------------------------------
    // AUTH (Login, Logout, Me)
    // ------------------------------------------------------------------------
    if (route0 === 'auth') {
      if (route1 === 'logout') {
        return sendJson(res, 200, { status: 'success', message: 'Logged out successfully' });
      }

      if (route1 === 'me') {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (token && token.startsWith('vec_token_')) {
          const parts = token.split('_');
          const userId = parseInt(parts[2], 10);
          if (userId) {
            const userRows = await safeQuery(
              'SELECT id, name, email, phone, role, is_active FROM users WHERE id = $1 LIMIT 1',
              [userId]
            );
            if (userRows.length > 0 && userRows[0].is_active) {
              return sendJson(res, 200, {
                status: 'success',
                user: userRows[0],
                data: { user: userRows[0] },
              });
            }
          }
        }

        return sendJson(res, 401, { status: 'fail', message: 'Not authenticated' });
      }

      if (route1 === 'login' && req.method === 'POST') {
        const body = await getBody(req);
        const email = (body.email || '').trim().toLowerCase();
        const password = body.password || '';

        if (!email || !password) {
          return sendJson(res, 400, {
            status: 'fail',
            message: 'Please provide both email and password.',
          });
        }

        if (!sql) {
          return sendJson(res, 503, {
            status: 'fail',
            message:
              'Database connection is not yet configured. Please set the DATABASE_URL environment variable in your Vercel Project Settings.',
          });
        }

        const userRows = await safeQuery(
          'SELECT id, name, email, phone, role, password_hash, is_active FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
          [email]
        );

        if (userRows.length === 0) {
          return sendJson(res, 401, {
            status: 'fail',
            message: 'Invalid email or password.',
          });
        }

        const user = userRows[0];

        if (!user.is_active) {
          return sendJson(res, 403, {
            status: 'fail',
            message: 'Your account is deactivated. Please contact support.',
          });
        }

        const isPasswordValid = await verifyPassword(password, user.password_hash);

        if (!isPasswordValid) {
          return sendJson(res, 401, {
            status: 'fail',
            message: 'Invalid email or password.',
          });
        }

        delete user.password_hash;
        const token = `vec_token_${user.id}_${Date.now()}`;

        return sendJson(res, 200, {
          status: 'success',
          message: 'Logged in successfully!',
          token,
          user,
          data: {
            token,
            user,
          },
        });
      }
    }

    // ------------------------------------------------------------------------
    // CART & WISHLIST
    // ------------------------------------------------------------------------
    if (route0 === 'cart' || route0 === 'wishlist') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { status: 'success', data: { items: [] } });
      }
      return sendJson(res, 200, { status: 'success', message: 'Action recorded' });
    }

    // ------------------------------------------------------------------------
    // ORDERS
    // ------------------------------------------------------------------------
    if (route0 === 'orders') {
      if (req.method === 'POST') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const body = await getBody(req);
        const orderNumber = 'VEC-' + Math.floor(100000 + Math.random() * 900000);
        const subtotal = parseFloat(body.subtotal || body.total_amount || 0);
        const shippingFee = parseFloat(body.shipping_fee || 0);
        const discount = parseFloat(body.discount || 0);
        const total = parseFloat(body.total || body.total_amount || (subtotal + shippingFee - discount));
        const shippingName = body.shipping_name || body.customer_name || 'Guest Customer';
        const shippingPhone = body.shipping_phone || body.phone || 'N/A';
        const shippingAddress = body.shipping_address || body.address || 'Standard Delivery';
        const shippingCity = body.shipping_city || body.city || 'Dhaka';
        const paymentMethod = body.payment_method || 'cod';

        const orderRows = await sql.query(
          `INSERT INTO orders (
            order_number, subtotal, discount, shipping_fee, total, 
            payment_method, shipping_name, shipping_phone, shipping_address, shipping_city,
            order_status, payment_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'pending')
          RETURNING *`,
          [
            orderNumber,
            subtotal,
            discount,
            shippingFee,
            total,
            paymentMethod,
            shippingName,
            shippingPhone,
            shippingAddress,
            shippingCity,
          ]
        );

        const newOrder = orderRows[0];

        // Insert items if present
        if (Array.isArray(body.items) && body.items.length > 0) {
          for (const item of body.items) {
            await sql.query(
              `INSERT INTO order_items (
                order_id, product_id, product_name, price, quantity, subtotal, image_url
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                newOrder.id,
                item.product_id || item.id || null,
                item.name || item.product_name || 'Optical Item',
                parseFloat(item.price || 0),
                parseInt(item.quantity || 1, 10),
                parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10),
                item.image || item.image_url || item.primary_image || null,
              ]
            );
          }
        }

        return sendJson(res, 201, {
          status: 'success',
          message: 'Order placed successfully!',
          data: newOrder,
        });
      }

      if (req.method === 'GET') {
        const orders = await safeQuery('SELECT * FROM orders ORDER BY id DESC LIMIT 50');
        return sendJson(res, 200, { status: 'success', data: { orders } });
      }
    }

    // ------------------------------------------------------------------------
    // PRODUCTS
    // ------------------------------------------------------------------------
    if (route0 === 'products') {
      // FEATURED & BESTSELLERS
      if (route1 === 'featured') {
        const featured = await safeQuery(
          `SELECT p.*,
            (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image
           FROM products p
           ORDER BY p.id ASC LIMIT 8`
        );
        return sendJson(res, 200, {
          status: 'success',
          data: { featured, bestsellers: featured },
        });
      }

      // CREATE PRODUCT: POST /api/products
      if (!route1 && req.method === 'POST') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const body = await getBody(req);
        const insertRes = await sql.query(
          `INSERT INTO products (
            name, slug, product_code, sku, price, compare_price, stock, brand,
            frame_material, frame_shape, frame_color, size, gender,
            short_description, description, featured, bestseller, new_arrival, category_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING *`,
          [
            body.name || 'Untitled Optical Product',
            body.slug || `product-${Date.now()}`,
            body.product_code || `MRM-${Date.now()}`,
            body.sku || body.product_code || String(Date.now()),
            parseFloat(body.price || 0),
            body.compare_price ? parseFloat(body.compare_price) : null,
            parseInt(body.stock || 1, 10),
            body.brand || 'Vision Eye Care',
            body.frame_material || null,
            body.frame_shape || null,
            body.frame_color || null,
            body.size || 'Standard',
            body.gender || 'unisex',
            body.short_description || null,
            body.description || null,
            Boolean(body.featured),
            Boolean(body.bestseller),
            body.new_arrival !== undefined ? Boolean(body.new_arrival) : true,
            body.category_id ? parseInt(body.category_id, 10) : null,
          ]
        );
        const targetId = insertRes[0].id;

        const allImages = Array.isArray(body.images) && body.images.length > 0
          ? body.images.map((img) => (typeof img === 'string' ? img : (img.url || img.image_url || img.src))).filter(Boolean)
          : Array.isArray(body.image_urls) && body.image_urls.length > 0
          ? body.image_urls
          : (body.primary_image || body.image_url ? [body.primary_image || body.image_url] : []);

        if (allImages.length > 0) {
          for (let i = 0; i < allImages.length; i++) {
            await sql.query(
              `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
               VALUES ($1, $2, $3, $4)`,
              [targetId, allImages[i], i === 0, i]
            );
          }
        }

        return sendJson(res, 201, {
          status: 'success',
          message: 'Product created successfully in database!',
          data: insertRes[0],
        });
      }

      // UPDATE PRODUCT IMAGES: POST /api/products/:id/images
      if (route1 && route2 === 'images' && req.method === 'POST') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const productId = parseInt(route1, 10);
        const body = await getBody(req);
        const imageUrl = body.image_url || body.url || body.dataUrl || '';
        if (imageUrl) {
          const isPrimary = Boolean(body.is_primary);
          if (isPrimary) {
            await sql.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
          }
          const imgRow = await sql.query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
             VALUES ($1, $2, $3, 0) RETURNING *`,
            [productId, imageUrl, isPrimary]
          );
          return sendJson(res, 200, { status: 'success', data: imgRow[0] });
        }
      }

      // DELETE PRODUCT IMAGE: DELETE /api/products/:id/images/:imageId
      if (route1 && route2 === 'images' && segments[3] && req.method === 'DELETE') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const imageId = parseInt(segments[3], 10);
        await sql.query('DELETE FROM product_images WHERE id = $1', [imageId]);
        return sendJson(res, 200, { status: 'success', message: 'Image removed' });
      }

      // UPDATE PRODUCT: PUT /api/products/:id
      if (route1 && req.method === 'PUT') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const body = await getBody(req);
        const queryId = decodeURIComponent(route1).trim();
        const isNumeric = /^\d+$/.test(queryId);

        let existing = [];
        if (isNumeric) {
          existing = await sql.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [parseInt(queryId, 10)]);
        }
        if (existing.length === 0) {
          const codeMatch = queryId.match(/^(mrm-\d+)/i);
          const extractedCode = codeMatch ? codeMatch[1].toUpperCase() : '';
          const cleanSlug = queryId.replace(/^mrm-\d+-?/i, '');

          existing = await sql.query(
            `SELECT * FROM products 
             WHERE product_code ILIKE $1 
                OR slug ILIKE $1 
                OR sku ILIKE $1
                OR (CASE WHEN $2 <> '' THEN (product_code ILIKE $2 OR sku ILIKE $2) ELSE false END)
                OR (CASE WHEN $3 <> '' THEN (slug ILIKE '%' || $3 || '%') ELSE false END)
             LIMIT 1`,
            [queryId, extractedCode, cleanSlug]
          );
        }

        let targetId = existing.length > 0 ? existing[0].id : (isNumeric ? parseInt(queryId, 10) : null);

        if (!targetId) {
          const insertRes = await sql.query(
            `INSERT INTO products (name, slug, product_code, sku, price, stock, brand)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
              body.name || `Product ${queryId}`,
              body.slug || `product-${queryId}`,
              body.product_code || (isNumeric ? `MRM-${String(queryId).padStart(3, '0')}` : queryId),
              body.sku || body.product_code || String(queryId),
              parseFloat(body.price || 0),
              parseInt(body.stock || 1, 10),
              body.brand || 'Vision Eye Care',
            ]
          );
          targetId = insertRes[0].id;
        }

        await sql.query(
          `UPDATE products SET
            name = COALESCE($1, name),
            price = COALESCE($2, price),
            compare_price = $3,
            stock = COALESCE($4, stock),
            brand = COALESCE($5, brand),
            frame_material = COALESCE($6, frame_material),
            frame_shape = COALESCE($7, frame_shape),
            frame_color = COALESCE($8, frame_color),
            size = COALESCE($9, size),
            gender = COALESCE($10, gender),
            short_description = COALESCE($11, short_description),
            description = COALESCE($12, description),
            product_code = COALESCE($13, product_code),
            sku = COALESCE($14, sku),
            featured = COALESCE($15, featured),
            bestseller = COALESCE($16, bestseller),
            new_arrival = COALESCE($17, new_arrival)
           WHERE id = $18`,
          [
            body.name || null,
            body.price !== undefined ? parseFloat(body.price) : null,
            body.compare_price ? parseFloat(body.compare_price) : null,
            body.stock !== undefined ? parseInt(body.stock, 10) : null,
            body.brand || null,
            body.frame_material || null,
            body.frame_shape || null,
            body.frame_color || null,
            body.size || null,
            body.gender || null,
            body.short_description || null,
            body.description || null,
            body.product_code || null,
            body.sku || null,
            body.featured !== undefined ? Boolean(body.featured) : null,
            body.bestseller !== undefined ? Boolean(body.bestseller) : null,
            body.new_arrival !== undefined ? Boolean(body.new_arrival) : null,
            targetId,
          ]
        );

        const allImages = Array.isArray(body.images) && body.images.length > 0
          ? body.images.map((img) => (typeof img === 'string' ? img : (img.url || img.image_url || img.src))).filter(Boolean)
          : Array.isArray(body.image_urls) && body.image_urls.length > 0
          ? body.image_urls
          : (body.primary_image || body.image_url ? [body.primary_image || body.image_url] : []);

        if (allImages.length > 0) {
          await sql.query('DELETE FROM product_images WHERE product_id = $1', [targetId]);
          for (let i = 0; i < allImages.length; i++) {
            await sql.query(
              `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
               VALUES ($1, $2, $3, $4)`,
              [targetId, allImages[i], i === 0, i]
            );
          }
        }

        const updatedRow = await sql.query('SELECT * FROM products WHERE id = $1', [targetId]);
        const imgRows = await sql.query(
          'SELECT id, image_url, is_primary, sort_order FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
          [targetId]
        );

        const primaryImg = imgRows.find((i) => i.is_primary)?.image_url || imgRows[0]?.image_url || null;

        return sendJson(res, 200, {
          status: 'success',
          message: 'Product updated successfully in database!',
          data: {
            ...updatedRow[0],
            primary_image: primaryImg,
            image_url: primaryImg,
            images: imgRows.map((img, idx) => ({
              id: img.id,
              url: img.image_url,
              image_url: img.image_url,
              is_primary: img.is_primary || idx === 0,
            })),
          },
        });
      }

      // DELETE PRODUCT: DELETE /api/products/:id
      if (route1 && req.method === 'DELETE') {
        if (!sql) return sendJson(res, 503, { status: 'fail', message: 'DATABASE_URL is not configured.' });
        const id = parseInt(route1, 10);
        await sql.query('DELETE FROM product_images WHERE product_id = $1', [id]);
        await sql.query('DELETE FROM products WHERE id = $1', [id]);
        return sendJson(res, 200, { status: 'success', message: 'Product deleted' });
      }

      // GET SINGLE PRODUCT: GET /api/products/:idOrSlug
      if (route1 && req.method === 'GET') {
        const queryId = decodeURIComponent(route1).trim();
        const isNumeric = /^\d+$/.test(queryId);

        let rows = [];
        if (isNumeric) {
          rows = await safeQuery(
            `SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = $1 LIMIT 1`,
            [parseInt(queryId, 10)]
          );
        }

        if (rows.length === 0) {
          const codeMatch = queryId.match(/^(mrm-\d+)/i);
          const extractedCode = codeMatch ? codeMatch[1].toUpperCase() : '';
          const cleanSlug = queryId.replace(/^mrm-\d+-?/i, '');

          rows = await safeQuery(
            `SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.product_code ILIKE $1 
                OR p.slug ILIKE $1 
                OR p.sku ILIKE $1
                OR (CASE WHEN $2 <> '' THEN (p.product_code ILIKE $2 OR p.sku ILIKE $2) ELSE false END)
                OR (CASE WHEN $3 <> '' THEN (p.slug ILIKE '%' || $3 || '%') ELSE false END)
             LIMIT 1`,
            [queryId, extractedCode, cleanSlug]
          );
        }

        if (rows.length > 0) {
          const product = rows[0];
          const imgRows = await safeQuery(
            'SELECT id, image_url, is_primary, sort_order FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
            [product.id]
          );

          const primaryImg = imgRows.find((i) => i.is_primary)?.image_url || imgRows[0]?.image_url || null;

          return sendJson(res, 200, {
            status: 'success',
            data: {
              ...product,
              primary_image: primaryImg,
              image_url: primaryImg,
              images: imgRows.map((img, idx) => ({
                id: img.id,
                url: img.image_url,
                image_url: img.image_url,
                is_primary: img.is_primary || idx === 0,
              })),
            },
          });
        }

        return sendJson(res, 404, { status: 'fail', message: 'Product not found' });
      }

      // GET PRODUCTS LIST: GET /api/products
      if (req.method === 'GET') {
        const search = url.searchParams.get('search') || '';
        const brand = url.searchParams.get('brand') || '';
        const category = url.searchParams.get('category') || '';
        const featured = url.searchParams.get('featured');
        const bestseller = url.searchParams.get('bestseller');
        const newArrival = url.searchParams.get('new_arrival');
        const page = parseInt(url.searchParams.get('page'), 10) || 1;
        const limit = parseInt(url.searchParams.get('limit'), 10) || 15;

        let query = `
          SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE 1=1
        `;
        const params = [];
        let idx = 1;

        if (search) {
          query += ` AND (p.name ILIKE $${idx} OR p.product_code ILIKE $${idx} OR p.sku ILIKE $${idx} OR p.brand ILIKE $${idx})`;
          params.push(`%${search}%`);
          idx++;
        }

        if (brand) {
          query += ` AND p.brand = $${idx}`;
          params.push(brand);
          idx++;
        }

        if (category) {
          query += ` AND (p.category_id::text = $${idx} OR c.slug = $${idx})`;
          params.push(category);
          idx++;
        }

        if (featured === 'true' || featured === true) {
          query += ' AND p.featured = true';
        }
        if (bestseller === 'true' || bestseller === true) {
          query += ' AND p.bestseller = true';
        }
        if (newArrival === 'true' || newArrival === true) {
          query += ' AND p.new_arrival = true';
        }

        const countRes = await safeQuery(`SELECT COUNT(*) AS total FROM (${query}) AS sub`, params);
        const total = parseInt(countRes[0]?.total || 0, 10);

        query += ` ORDER BY p.id ASC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(limit, (page - 1) * limit);

        const products = await safeQuery(query, params);

        if (products.length > 0) {
          const ids = products.map((p) => p.id);
          const allImgs = await safeQuery(
            'SELECT id, product_id, image_url, is_primary, sort_order FROM product_images WHERE product_id = ANY($1::int[]) ORDER BY sort_order ASC, id ASC',
            [ids]
          );

          products.forEach((p) => {
            const pImgs = allImgs.filter((i) => i.product_id === p.id);
            p.images = pImgs.map((img, iIdx) => ({
              id: img.id,
              url: img.image_url,
              image_url: img.image_url,
              is_primary: img.is_primary || iIdx === 0,
            }));
            if (!p.primary_image && p.images.length > 0) {
              p.primary_image = p.images[0].url;
            }
          });
        }

        return sendJson(res, 200, {
          status: 'success',
          data: {
            products,
            pagination: {
              current_page: page,
              total_pages: Math.ceil(total / limit) || 1,
              total_products: total,
              limit,
            },
          },
        });
      }
    }

    // Default route fallback
    return sendJson(res, 404, { status: 'fail', message: `Route not found: ${pathname}` });
  } catch (error) {
    console.error('API Error:', error);
    return sendJson(res, 500, { status: 'error', message: error.message || 'Server error' });
  }
}
