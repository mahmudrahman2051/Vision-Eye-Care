const fs = require('fs');
const path = require('path');
const { query } = require('../db/pool');

const DATA_FILE = path.join(__dirname, '..', 'data', 'homepage_blocks.json');

const DEFAULT_BLOCKS = {
  heroBanners: [
    {
      id: 1,
      src: '/hero_banner_1.png',
      alt: 'Premium Eyewear Collection',
      title: 'Bespoke Titanium & Japanese Acetate',
      subtitle: 'Engineered for uncompromising visual clarity',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
    },
    {
      id: 2,
      src: '/hero_banner_2.png',
      alt: 'Designer Sunglasses',
      title: 'Polarized Architectural Sunglasses',
      subtitle: '100% UV400 Protection with anti-reflective back-coating',
      ctaText: 'Shop Sunglasses',
      ctaLink: '/shop?category=sunglasses',
    },
    {
      id: 3,
      src: '/hero_banner_3.png',
      alt: 'Fashionable Frames',
      title: 'Featherlight Everyday Frames',
      subtitle: 'Custom CNC Lens Milling crafted in Dhaka',
      ctaText: 'Book Home Trial',
      ctaLink: '/contact',
    },
  ],
  heroInterval: 5000,
  categoryPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Special Eyewear Offer',
    link: '/shop?sort=featured',
  },
  lowerPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Exclusive Seasonal Drop',
    link: '/shop?sort=popular',
  },
  featuredCollections: [
    {
      id: 'computer-glasses',
      title: 'Computer Glasses',
      tagline: 'Zero Power Blu-Cut',
      badge: 'MUST HAVE',
      dotColor: 'bg-emerald-500',
      link: '/shop?search=computer',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'polarized-shades',
      title: 'Polarized Shades',
      tagline: '100% UV Protection',
      badge: 'POPULAR',
      dotColor: 'bg-amber-500',
      link: '/shop?category=sunglasses',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'progressive-lenses',
      title: 'Progressive Vision',
      tagline: 'Multi-Focal Comfort',
      badge: 'PREMIUM',
      dotColor: 'bg-indigo-500',
      link: '/shop?category=eyeglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'acetate-frames',
      title: 'Acetate Frames',
      tagline: 'Italian Handcrafted',
      badge: 'TRENDING',
      dotColor: 'bg-rose-500',
      link: '/shop?search=acetate',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'contact-lenses',
      title: 'Contact Lenses',
      tagline: 'Daily & Monthly',
      badge: 'ESSENTIAL',
      dotColor: 'bg-sky-500',
      link: '/shop?search=Contact+Lenses',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'kids-eyewear',
      title: 'Kids Eyewear',
      tagline: 'Flexible & Safe',
      badge: 'NEW',
      dotColor: 'bg-violet-500',
      link: '/shop?gender=kids',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    },
  ],
};

function readLocalBlocks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...DEFAULT_BLOCKS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('⚠️ Failed reading homepage blocks file:', err.message);
  }
  return DEFAULT_BLOCKS;
}

function writeLocalBlocks(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Failed writing homepage blocks file:', err.message);
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
 * GET /api/banners or /api/admin/banners
 */
async function getBanners(req, res, next) {
  try {
    await ensureTable();
    try {
      const result = await query(
        `SELECT value FROM site_settings WHERE key = 'homepage_blocks' LIMIT 1`
      );
      if (result && result.rows && result.rows.length > 0) {
        return res.json({
          status: 'success',
          data: { ...DEFAULT_BLOCKS, ...result.rows[0].value },
        });
      }
    } catch (dbErr) {
      // Fall through to local file
    }

    const localData = readLocalBlocks();
    return res.json({
      status: 'success',
      data: localData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/banners
 */
async function updateBanners(req, res, next) {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ status: 'error', message: 'Invalid payload' });
    }

    const current = readLocalBlocks();
    const updated = {
      ...current,
      ...payload,
      heroBanners: Array.isArray(payload.heroBanners) ? payload.heroBanners : current.heroBanners,
      featuredCollections: Array.isArray(payload.featuredCollections) ? payload.featuredCollections : current.featuredCollections,
      categoryPromoBanner: payload.categoryPromoBanner || current.categoryPromoBanner,
      lowerPromoBanner: payload.lowerPromoBanner || current.lowerPromoBanner,
      heroInterval: Number(payload.heroInterval) >= 2000 ? Number(payload.heroInterval) : current.heroInterval,
    };

    writeLocalBlocks(updated);

    try {
      await ensureTable();
      await query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ('homepage_blocks', $1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()`,
        [JSON.stringify(updated)]
      );
    } catch (dbErr) {
      console.warn('⚠️ DB update failed for homepage blocks, saved locally:', dbErr.message);
    }

    return res.json({
      status: 'success',
      message: 'Homepage banners and blocks updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBanners,
  updateBanners,
};
