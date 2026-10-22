const { query } = require('../db/pool');

/**
 * POST /api/contact
 * Receive message from contact form
 */
async function submitContactMessage(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Email is required.' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Subject is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Message content is required.' });
    }

    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : null,
        subject.trim(),
        message.trim(),
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Thank you for reaching out! Our team will contact you shortly.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/newsletter
 * Subscribe to newsletter
 */
async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ status: 'fail', message: 'Please provide a valid email address.' });
    }

    await query(
      `INSERT INTO newsletter_subscribers (email, is_subscribed, subscribed_at)
       VALUES ($1, true, NOW())
       ON CONFLICT (email) 
       DO UPDATE SET is_subscribed = true, subscribed_at = NOW()`,
      [cleanEmail]
    );

    res.status(200).json({
      status: 'success',
      message: 'Thank you for subscribing to Drishti newsletter!',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitContactMessage,
  subscribeNewsletter,
};
