const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { compare } = require("../util/hash");
const {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
  ONE_DAY_IN_MILLISECONDS,
} = require("../util/global");

const prisma = new PrismaClient();

// Classe d'erreurs personnalisée
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

// Authentification
const auth = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id || !password) {
      throw new AuthError("Champs manquant !");
    }

    const user = await prisma.user.findFirst({
      select: {
        id: true,
        password: true,
      },
      where: {
        OR: [{ email: id }, { username: id }],
      },
    });

    if (user === null) {
      throw new AuthError("Compte introuvable !");
    }

    if (!compare(password, user.password)) {
      throw new AuthError("Mot de passe incorrect !");
    }

    // Création des Tokens
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_DURATION,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_DURATION,
      }
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: ONE_DAY_IN_MILLISECONDS,
    });

    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { auth, AuthError };
