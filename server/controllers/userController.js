const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');

/**
 * GET /api/users/profile
 * Get current user profile details
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/profile
 * Update user full_name and phone
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { full_name, phone } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Full name is required.' });
    }

    const result = await query(
      `UPDATE users 
       SET name = $1, phone = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, updated_at`,
      [full_name.trim(), phone ? phone.trim() : null, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/password
 * Change user password
 */
async function updatePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password and new password are required.',
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'New password must be at least 6 characters long.',
      });
    }

    // Fetch user hash
    const userRes = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    const isValid = await bcrypt.compare(current_password, userRes.rows[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ status: 'fail', message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully!',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/addresses
 * Get all addresses saved by current user
 */
async function getAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users/addresses
 * Add a new shipping address
 */
async function addAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      label = 'Home',
      full_name,
      phone,
      address,
      city,
      area,
      postal_code,
      country = 'Bangladesh',
      is_default = false,
    } = req.body;

    if (!full_name || !phone || !address || !city) {
      return res.status(400).json({
        status: 'fail',
        message: 'Recipient name, phone, address, and city are required.',
      });
    }

    // If setting as default, unset others first
    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    // If first address, auto make default
    const countRes = await query(
      'SELECT COUNT(*) FROM addresses WHERE user_id = $1',
      [userId]
    );
    const shouldBeDefault = is_default || parseInt(countRes.rows[0].count, 10) === 0;

    const result = await query(
      `INSERT INTO addresses (
        user_id, label, full_name, phone, address, city, area, postal_code, country, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userId,
        label,
        full_name.trim(),
        phone.trim(),
        address.trim(),
        city.trim(),
        area ? area.trim() : null,
        postal_code ? postal_code.trim() : null,
        country,
        shouldBeDefault,
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/addresses/:id
 * Update an existing address
 */
async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const {
      label,
      full_name,
      phone,
      address,
      city,
      area,
      postal_code,
      country = 'Bangladesh',
      is_default,
    } = req.body;

    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const result = await query(
      `UPDATE addresses 
       SET label = COALESCE($1, label),
           full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           city = COALESCE($5, city),
           area = COALESCE($6, area),
           postal_code = COALESCE($7, postal_code),
           country = COALESCE($8, country),
           is_default = COALESCE($9, is_default),
           updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        label,
        full_name,
        phone,
        address,
        city,
        area,
        postal_code,
        country,
        is_default,
        addressId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Address not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/users/addresses/:id
 * Delete an address
 */
async function deleteAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      [addressId, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
