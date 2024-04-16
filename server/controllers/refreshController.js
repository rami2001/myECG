const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { AuthError } = require("./authController");
const { ACCESS_TOKEN_DURATION } = require("../util/global");

const prisma = new PrismaClient();

// Classe d'erreurs personnalisée
class RefreshError extends Error {
  constructor(message) {
    super(message);
    this.name = "RefreshError";
  }
}

// Obtention d'un nouveau Token d'accès
const refresh = async (req, res) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.jwt) {
      throw new RefreshError("Cookies introuvables.");
    }

    const refreshToken = cookies.jwt;

    const user = await prisma.user.findFirst({
      select: {
        refreshToken,
      },
      where: {
        refreshToken: refreshToken,
      },
    });

    if (user === null) throw new AuthError("Accès interdit.");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || decoded.id !== user.id)
          throw new AuthError("Mauvais Token.");
      }
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_DURATION }
    );

    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(403).json({ message: error.message });
    } else if (error instanceof RefreshError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { refresh };
