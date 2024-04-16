const jwt = require("jsonwebtoken");
require("dotenv").config();

// Classe d'erreurs personnalisée
class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) throw new TokenError("Token invalide.");

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
    if (error) throw new TokenError("Token invalide.");
    req.id = decoded.id;
    next();
  });
};

module.exports = { verifyJWT, TokenError };
