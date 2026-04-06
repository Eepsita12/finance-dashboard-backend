const VALID_ROLES = ['viewer', 'analyst', 'admin'];

/**
 * Factory function that returns a middleware enforcing one of the allowed roles.
 * @param {...string} allowedRoles - Roles that are permitted to access the route.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (!role) {
      return res.status(400).json({
        error: 'Missing x-user-role header. Please specify a role (viewer, analyst, admin).',
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: `Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}.`,
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: `Forbidden. Role "${role}" does not have access to this resource.`,
        required: allowedRoles,
      });
    }

    // Attach role to request so controllers can use it if needed
    req.userRole = role;
    next();
  };
}

module.exports = { requireRole };
