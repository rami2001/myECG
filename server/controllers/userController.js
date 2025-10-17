const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");
const { RESPONSE } = require("../util/response");

const fs = require("fs").promises;
const path = require("path");

const {
  ECG_IMAGE_DESTINATION,
  USER_IMAGE_DESTINATION,
} = require("../util/global");

const prisma = new PrismaClient();

// Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: { userId: req.id },
      select: { image: true },
    });

    for (const profile of profiles) {
      if (profile.image) {
        const imagePath = path.join(
          __dirname,
          "..",
          USER_IMAGE_DESTINATION,
          profile.image
        );
        try {
          if (await fs.access(imagePath)) {
            await fs.unlink(imagePath);
          }
        } catch (err) {
          console.error(`Error deleting image ${imagePath}:`, err);
        }
      }
    }

    await prisma.user.delete({
      where: {
        id: req.id,
      },
    });

    const folderPath = path.join(
      __dirname,
      "..",
      ECG_IMAGE_DESTINATION,
      String(req.id)
    );

    fs.rm(folderPath, { recursive: true, force: true });

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
            userId: req.id,
          },
          orderBy: {
            id: "asc",
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

const updatePassword = async (req, res) => {
  const { password } = req.body;

  try {
    await prisma.user.update({
      where: {
        id: req.id,
      },
      data: {
        password: hash(password),
      },
    });

    res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Informations utiles sur l'utilisateur
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      select: {
        username: true,
        pseudonym: true,
        dateOfBirth: true,
        gender: true,
        isParticipating: true,
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

const getSats = async (req, res) => {
  try {
    const userId = req.id;

    const [profileCount, ecgCount] = await prisma.$transaction([
      prisma.profile.count({
        where: { userId },
      }),
      prisma.ecg.count({
        where: {
          profile: {
            userId,
          },
        },
      }),
    ]);

    return res.status(RESPONSE.SUCCESSFUL.OK).json({
      profileCount,
      ecgCount,
    });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { deleteUser, updateUser, getUser, getSats, updatePassword };
