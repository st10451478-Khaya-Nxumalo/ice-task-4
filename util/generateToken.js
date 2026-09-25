import jwt from 'jsonwebtoken';

// Token payload includes user ID and role, as required. `exp` is embedded
// automatically by the `expiresIn` option (JWTs always carry an expiry claim).
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

export default generateToken;
