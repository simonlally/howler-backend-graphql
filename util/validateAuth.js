const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const KEY = process.env.KEY;

module.exports = context => {
  // auth headers are in the context object
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      //verify that the token is still valid
      try {
        const user = jwt.verify(token, KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("invalid or expired token");
      }
    }
    throw new Error("auth token must be formatted correctly");
  }
  throw new Error("auth header not found");
};
