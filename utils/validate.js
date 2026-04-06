/**
 * Validation utilities for request body fields.
 */

/**
 * Returns an array of missing field names from an object.
 * @param {Object} body - The request body
 * @param {string[]} requiredFields - List of required field names
 * @returns {string[]} - Names of missing fields
 */
function getMissingFields(body, requiredFields) {
  return requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );
}

module.exports = { getMissingFields };
