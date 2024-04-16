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

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) throw new TokenError("Token invalide.");
      req.id = decoded.id;
      next();
    });
  } catch (error) {
    if (error instanceof TokenError) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { verifyJWT, TokenError };
