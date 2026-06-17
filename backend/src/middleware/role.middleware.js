const prisma = require('../prisma');

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Authentication required',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied. Required roles: ${roles.join(', ')}`,
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      console.error('ROLE CHECK ERROR:', error);
      return res.status(500).json({
        message: 'Server error during role check',
      });
    }
  };
};

const requireAdmin = requireRole(['ADMIN']);
const requireAdminOrHost = requireRole(['ADMIN', 'HOST']);
const requireHost = requireRole(['HOST']);

module.exports = {
  requireRole,
  requireAdmin,
  requireAdminOrHost,
  requireHost,
};