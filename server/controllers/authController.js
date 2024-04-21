const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { compare } = require("../util/hash");
const { RESPONSE } = require("../util/response");
const {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
  ONE_DAY_IN_MILLISECONDS,
} = require("../util/global");

const prisma = new PrismaClient();

// Authentification
const auth = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id || !password) {
      res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
      return;
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
      res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Compte introuvable." });
      return;
    }

    if (!compare(password, user.password)) {
      res
        .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Mot de passe incorrect !" });
      return;
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
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_DAY_IN_MILLISECONDS,
    });

    res.status(RESPONSE.SUCCESSFUL.CREATED).json({ accessToken: accessToken });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { auth };
