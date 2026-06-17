const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('DECODED USER:', decoded);
      return next();
    } catch (error) {
      console.error('JWT VERIFY ERROR:', error.message);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }

  return res.status(401).json({ message: 'Authentication required' });
};

module.exports = protect;