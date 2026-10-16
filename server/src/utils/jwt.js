const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'campusvoice_super_secure_jwt_secret_key_2026_xyz123',
    {
      expiresIn: '7d'
    }
  );
};

module.exports = { generateToken };
