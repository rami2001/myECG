const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const logout = async (req, res) => {
  const cookies = req.cookies;

  try {
    if (!cookies?.jwt) return res.sendStatus(204);

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
      return res.sendStatus(204);
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

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logout };
