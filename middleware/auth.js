// Read "Authorization: Bearer <token>", verify with jwt.verify and process.env.JWT_SECRET,
// set req.user = { id }, call next(). Respond 401 if missing/invalid.
module.exports = function authenticate(req, res, next) {
  // TODO
  next();
};
