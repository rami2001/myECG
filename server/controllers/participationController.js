const { PrismaClient } = require("@prisma/client");

const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const participation = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
      select: {
        isParticipating: true,
      },
    });

    if (!user) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé." });
    }

    await prisma.user.update({
      where: {
        id: req.id,
      },
      data: {
        isParticipating: !user.isParticipating,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Changement effectué !" });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { participation };
