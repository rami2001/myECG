const jwt = require("jsonwebtoken");
require("dotenv").config();

const { RESPONSE } = require("../util/response");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
      .json({ message: "Token invalide." });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
          .json({ message: "Token invalide." });
      }
      req.id = decoded.id;
      next();
    });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { verifyJWT };
