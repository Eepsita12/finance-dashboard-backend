const { v4: uuidv4 } = require('uuid');
const { records } = require('../data/store');
const { getMissingFields } = require('../utils/validate');

const VALID_TYPES = ['income', 'expense'];

//POST RECORDS
function createRecord(req, res) {
  const { amount, type, category, date, note } = req.body;

  const missing = getMissingFields(req.body, ['amount', 'type', 'category', 'date']);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number.' });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Invalid type "${type}". Must be one of: ${VALID_TYPES.join(', ')}.`,
    });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use ISO 8601, e.g. 2025-01-15.' });
  }

  const newRecord = {
    id: uuidv4(),
    amount: parsedAmount,
    type,
    category: category.trim(),
    date: new Date(date).toISOString().split('T')[0],
    note: note ? note.trim() : '',
    createdAt: new Date().toISOString(),
  };

  records.push(newRecord);
  return res.status(201).json({ message: 'Record created successfully.', record: newRecord });
}

//GET RECORDS
function listRecords(req, res) {
  const { type, category } = req.query;

  let result = [...records];

  if (type) {
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        error: `Invalid type filter "${type}". Must be one of: ${VALID_TYPES.join(', ')}.`,
      });
    }
    result = result.filter((r) => r.type === type);
  }

  if (category) {
    result = result.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  return res.status(200).json({ total: result.length, records: result });
}

//DELETE RECORDS BY ID
function deleteRecord(req, res) {
  const { id } = req.params;
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Record with id "${id}" not found.` });
  }

  const [deleted] = records.splice(index, 1);
  return res.status(200).json({ message: 'Record deleted successfully.', record: deleted });
}

module.exports = { createRecord, listRecords, deleteRecord };
