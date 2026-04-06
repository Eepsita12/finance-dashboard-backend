const { v4: uuidv4 } = require('uuid');
const { users } = require('../data/store');
const { getMissingFields } = require('../utils/validate');

const VALID_ROLES = ['viewer', 'analyst', 'admin'];
const VALID_STATUSES = ['active', 'inactive'];

//POST USERS
function createUser(req, res) {
  const { name, role, status } = req.body;


  const missing = getMissingFields(req.body, ['name', 'role']);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }


  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}.`,
    });
  }


  const userStatus = status || 'active';
  if (!VALID_STATUSES.includes(userStatus)) {
    return res.status(400).json({
      error: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    role,
    status: userStatus,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return res.status(201).json({ message: 'User created successfully.', user: newUser });
}

//GET USERS
function listUsers(req, res) {
  return res.status(200).json({ total: users.length, users });
}

module.exports = { createUser, listUsers };
