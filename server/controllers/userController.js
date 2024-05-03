const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

// Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.id,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Modification d'un utilisateur
const updateUser = async (req, res) => {
  const { email, username, gender, dateOfBirth } = req.body;

  try {
    try {
      await prisma.$transaction(async (prisma) => {
        const baseProfile = await prisma.profile.findFirst({
          select: {
            id: true,
          },
          where: {
            username: oldUsername,
            userId: req.id,
          },
        });

        await prisma.profile.update({
          where: {
            id: baseProfile.id,
          },
          data: {
            username,
            gender,
            dateOfBirth,
          },
        });

        await prisma.user.update({
          where: {
            id: req.id,
          },
          data: {
            email,
            username,
            gender,
            dateOfBirth,
          },
        });
      });

      res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
    } catch (error) {
      console.log(error);
      return res.status(RESPONSE.CLIENT_ERROR.CONFLICT).json({
        message: "Cette adresse mail ou ce nom d'utilisateur sont déjà pris.",
      });
    }
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      select: {
        username: true,
        pseudonym: true,
        dateOfBirth: true,
        gender: true,
        email: true,
      },
      where: {
        id: req.id,
      },
    });

    return res.status(RESPONSE.SUCCESSFUL.OK).json({ ...user });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { deleteUser, updateUser, getUser };
