let tokenBlacklist: string[] = [];

export const addToBlacklist = (token: string) => {
  tokenBlacklist.push(token);
};

export const isTokenBlacklisted = (token: string) => {
  return tokenBlacklist.includes(token);
};
