const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_DURATION } = require("../util/global");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

// Obtention d'un nouveau Token d'accès
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res
      .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
      .json({ message: "Cookies introuvables." });
  }

  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (user === null) {
      return res
        .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
        .json({ message: "Accès interdit." });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || decoded.id !== user.id) {
          return res
            .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
            .json({ message: "Mauvais Token." });
        }

        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_DURATION }
        );

        res.status(RESPONSE.SUCCESSFUL.CREATED).json({ accessToken });
      }
    );
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { refresh };
