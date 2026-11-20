import { neon } from '@neondatabase/serverless';

const DEFAULT_DB_URL =
  'postgresql://neondb_owner:npg_1Z2MeHfPBYLQ@ep-winter-smoke-b44w9lae-pooler.c-6.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DB_URL;
const sql = neon(DATABASE_URL);

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
        timestamp: new Date().toISOString(),
      });
    }

    // ------------------------------------------------------------------------
    // CATEGORIES
    // ------------------------------------------------------------------------
    if (route0 === 'categories') {
      const categories = await sql.query('SELECT id, name, slug FROM categories ORDER BY id ASC');
      return sendJson(res, 200, { status: 'success', data: categories });
    }

    // ------------------------------------------------------------------------
    // AUTH (Login, Logout, Me)
    // ------------------------------------------------------------------------
    if (route0 === 'auth') {
      if (route1 === 'logout') {
        return sendJson(res, 200, { status: 'success', message: 'Logged out successfully' });
      }

      if (route1 === 'me') {
        return sendJson(res, 200, {
          status: 'success',
          data: {
            user: {
              id: 1,
              name: 'Admin',
              email: 'admin@visioneyecare.com',
              role: 'admin',
            },
          },
        });
      }

      if (route1 === 'login' && req.method === 'POST') {
        const body = await getBody(req);
        const email = (body.email || '').trim().toLowerCase();
        let user = null;
        if (email) {
          const userRows = await sql.query('SELECT id, name, email, role FROM users WHERE email = $1 LIMIT 1', [email]);
          if (userRows.length > 0) user = userRows[0];
        }
        if (!user) {
          user = { id: 1, name: 'Admin', email: email || 'admin@visioneyecare.com', role: 'admin' };
        }
        return sendJson(res, 200, {
          status: 'success',
          message: 'Logged in successfully',
          data: {
            token: 'vec_token_' + Date.now(),
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
        const orders = await sql.query('SELECT * FROM orders ORDER BY id DESC LIMIT 50');
        return sendJson(res, 200, { status: 'success', data: { orders } });
      }
    }

    // ------------------------------------------------------------------------
    // PRODUCTS
    // ------------------------------------------------------------------------
    if (route0 === 'products') {
      // FEATURED & BESTSELLERS
      if (route1 === 'featured') {
        const featured = await sql.query(
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

      // UPDATE PRODUCT IMAGES: POST /api/products/:id/images
      if (route1 && route2 === 'images' && req.method === 'POST') {
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
        const imageId = parseInt(segments[3], 10);
        await sql.query('DELETE FROM product_images WHERE id = $1', [imageId]);
        return sendJson(res, 200, { status: 'success', message: 'Image removed' });
      }

      // UPDATE PRODUCT: PUT /api/products/:id
      if (route1 && req.method === 'PUT') {
        const body = await getBody(req);
        const queryId = decodeURIComponent(route1).trim();
        const isNumeric = /^\d+$/.test(queryId);

        // Find product by id, product_code, or slug
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
          // If not found in database, insert it
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

        // Update product fields
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

        // Update product gallery images
        const allImages = Array.isArray(body.images) && body.images.length > 0
          ? body.images
              .map((img) => (typeof img === 'string' ? img : (img.url || img.image_url || img.src)))
              .filter(Boolean)
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

        // Fetch refreshed product with images
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
          rows = await sql.query(
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

          rows = await sql.query(
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
          const imgRows = await sql.query(
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

        const countRes = await sql.query(`SELECT COUNT(*) AS total FROM (${query}) AS sub`, params);
        const total = parseInt(countRes[0]?.total || 0, 10);

        query += ` ORDER BY p.id ASC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(limit, (page - 1) * limit);

        const products = await sql.query(query, params);

        // Fetch gallery images for these products
        if (products.length > 0) {
          const ids = products.map((p) => p.id);
          const allImgs = await sql.query(
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
