const { PrismaClient } = require("@prisma/client");

const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const logout = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);

    const refreshToken = cookies.jwt;

    const user = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        refreshToken: refreshToken,
      },
    });

    if (user === null) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie("jwt", { httpOnly: true });

    res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
  } catch (error) {
    res.status(RESPONSE.SUCCESSFUL.NO_CONTENT).json({ message: error.message });
  }
};

module.exports = { logout };
