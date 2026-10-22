const fs = require('fs');
const path = require('path');
const { query } = require('../db/pool');

const DATA_FILE = path.join(__dirname, '..', 'data', 'ticker_settings.json');

const DEFAULT_SETTINGS = {
  enabled: true,
  speed: 28,
  direction: 'left',
  backgroundColor: '#1A1A1A',
  textColor: '#FAF7F2',
  accentColor: '#8B7355',
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

/**
 * Read settings from local JSON file fallback
 */
function readLocalSettings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('⚠️ Failed to read local ticker settings:', err.message);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Write settings to local JSON file
 */
function writeLocalSettings(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Failed to write local ticker settings:', err.message);
  }
}

/**
 * Ensure the site_settings table exists in database
 */
let tableChecked = false;
async function ensureSettingsTable() {
  if (tableChecked) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    tableChecked = true;
  } catch (err) {
    // If DB is unreachable or readonly, log and continue with file fallback
    console.warn('⚠️ Unable to ensure site_settings table, using file fallback:', err.message);
  }
}

/**
 * GET /api/ticker or /api/admin/ticker
 * Retrieve current ticker settings
 */
async function getTickerSettings(req, res, next) {
  try {
    await ensureSettingsTable();

    try {
      const result = await query(
        `SELECT value FROM site_settings WHERE key = 'marquee_ticker' LIMIT 1`
      );

      if (result && result.rows && result.rows.length > 0) {
        const dbSettings = result.rows[0].value;
        return res.json({
          status: 'success',
          data: { ...DEFAULT_SETTINGS, ...dbSettings },
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ DB query failed for ticker settings, falling back to local file:', dbErr.message);
    }

    const localSettings = readLocalSettings();
    return res.json({
      status: 'success',
      data: localSettings,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/ticker
 * Update ticker settings (Admin only)
 */
async function updateTickerSettings(req, res, next) {
  try {
    const payload = req.body;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid ticker settings payload',
      });
    }

    // Merge with existing settings
    const current = readLocalSettings();
    const updated = {
      ...current,
      enabled: typeof payload.enabled === 'boolean' ? payload.enabled : current.enabled,
      speed: Number(payload.speed) || current.speed || 28,
      direction: payload.direction === 'right' ? 'right' : 'left',
      backgroundColor: payload.backgroundColor || current.backgroundColor || '#1A1A1A',
      textColor: payload.textColor || current.textColor || '#FAF7F2',
      accentColor: payload.accentColor || current.accentColor || '#8B7355',
      pauseOnHover: typeof payload.pauseOnHover === 'boolean' ? payload.pauseOnHover : true,
      separator: payload.separator || '✦',
      messages: Array.isArray(payload.messages) ? payload.messages : current.messages,
    };

    // 1. Save to local fallback file
    writeLocalSettings(updated);

    // 2. Save to database if possible
    try {
      await ensureSettingsTable();
      await query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ('marquee_ticker', $1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()`,
        [JSON.stringify(updated)]
      );
    } catch (dbErr) {
      console.warn('⚠️ DB persist failed for ticker settings, saved locally:', dbErr.message);
    }

    return res.json({
      status: 'success',
      message: 'Marquee ticker settings saved successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTickerSettings,
  updateTickerSettings,
};
