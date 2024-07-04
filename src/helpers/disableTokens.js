let tokenBlacklist = [];

const addToBlacklist = (token) => {
  tokenBlacklist.push(token);
};

const isTokenBlacklisted = (token) => {
  return tokenBlacklist.includes(token);
};

module.exports = {
  addToBlacklist,
  isTokenBlacklisted,
};
