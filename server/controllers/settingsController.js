const fs = require('fs');
const path = require('path');
const { query } = require('../db/pool');

const DATA_FILE = path.join(__dirname, '..', 'data', 'store_settings.json');

const DEFAULT_SETTINGS = {
  storeName: 'Vision Eye Care',
  tagline: 'VISION EYE CARE Atelier Bangladesh',
  hotlinePhone: '+880 9612-888999',
  whatsappNumber: '+880 1711-000000',
  supportEmail: 'care@VISION EYE CARE.com.bd',
  showroomAddress: 'House 45, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  businessHours: 'Sat - Thu: 10:00 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeShippingThreshold: 5000,
  currency: 'BDT',
  currencySymbol: '৳',
  socialLinks: {
    facebook: 'https://facebook.com/visioneyecare',
    instagram: 'https://instagram.com/visioneyecare',
    whatsapp: 'https://wa.me/8801711000000',
    youtube: 'https://youtube.com/@visioneyecare',
    tiktok: 'https://tiktok.com/@visioneyecare',
  },
};

function readLocalSettings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('⚠️ Failed reading store settings file:', err.message);
  }
  return DEFAULT_SETTINGS;
}

function writeLocalSettings(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Failed writing store settings file:', err.message);
  }
}

async function ensureTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } catch (err) {
    // Non-fatal fallback
  }
}

/**
 * GET /api/settings or /api/admin/settings
 */
async function getSettings(req, res, next) {
  try {
    await ensureTable();
    try {
      const result = await query(
        `SELECT value FROM site_settings WHERE key = 'store_settings' LIMIT 1`
      );
      if (result && result.rows && result.rows.length > 0) {
        return res.json({
          status: 'success',
          data: { ...DEFAULT_SETTINGS, ...result.rows[0].value },
        });
      }
    } catch (dbErr) {
      // Fall through to local file
    }

    const localData = readLocalSettings();
    return res.json({
      status: 'success',
      data: localData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/settings
 */
async function updateSettings(req, res, next) {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ status: 'error', message: 'Invalid payload' });
    }

    const current = readLocalSettings();
    const updated = {
      ...current,
      ...payload,
      insideDhakaFee: Number(payload.insideDhakaFee) >= 0 ? Number(payload.insideDhakaFee) : current.insideDhakaFee,
      outsideDhakaFee: Number(payload.outsideDhakaFee) >= 0 ? Number(payload.outsideDhakaFee) : current.outsideDhakaFee,
      freeShippingThreshold: Number(payload.freeShippingThreshold) >= 0 ? Number(payload.freeShippingThreshold) : current.freeShippingThreshold,
      socialLinks: {
        ...current.socialLinks,
        ...(payload.socialLinks || {}),
      },
    };

    writeLocalSettings(updated);

    try {
      await ensureTable();
      await query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ('store_settings', $1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()`,
        [JSON.stringify(updated)]
      );
    } catch (dbErr) {
      console.warn('⚠️ DB update failed for store settings, saved locally:', dbErr.message);
    }

    return res.json({
      status: 'success',
      message: 'Store settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
};
