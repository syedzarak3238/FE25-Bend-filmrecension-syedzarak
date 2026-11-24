// Small helpers used by several routes.

// Returns a positive integer, or null if the value is not a valid id.
function parseId(value) {
  if (!/^\d+$/.test(String(value))) return null;
  const id = Number(value);
  return id > 0 ? id : null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { parseId, isValidEmail };