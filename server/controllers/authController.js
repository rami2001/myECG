const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { compare } = require("../util/hash");

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
      where: {
        OR: [{ email: id }, { username: id }],
      },
      include: {
        profiles: true,
      },
    });

    if (user === null) {
      throw new AuthError("Compte introuvable !");
    }

    if (!compare(password, user.password)) {
      throw new AuthError("Mot de passe incorrect !");
    }

    // Création des Tokens
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
      expiresIn: "30d",
    });

    // Un jour en millisecondes
    const ONE_DAY = 24 * 60 * 60 * 1000;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: ONE_DAY });
    res.status(201).json({accessToken : accessToken});
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { auth, AuthError };
