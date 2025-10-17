const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");

const { RESPONSE } = require("../util/response");
const {
  ECG_IMAGE_DESTINATION,
  USER_IMAGE_DESTINATION,
} = require("../util/global");

const prisma = new PrismaClient();

// Obtenir un profil et le nom d'utilisateur du compte associé (et non le profile)
const profileWithUsername = async (id, profileId) => {
  return await prisma.profile.findFirst({
    where: {
      userId: id,
      id: profileId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

// Création d'un profil
const createProfile = async (req, res) => {
  const { username, pseudonym, gender, dateOfBirth } = req.body;

  try {
    if (!username || !pseudonym || !gender || !dateOfBirth) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    try {
      const profile = await prisma.profile.create({
        data: {
          userId: req.id,
          username: username.toLowerCase(),
          pseudonym: pseudonym,
          gender: gender,
          dateOfBirth: new Date(dateOfBirth),
        },
      });

      return res.status(RESPONSE.SUCCESSFUL.CREATED).json({ ...profile });
    } catch (error) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Ce profile éxiste déjà." });
    }
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Mise à jour d'un profil
const updateProfile = async (req, res) => {
  const { id, username, pseudonym, gender, dateOfBirth } = req.body;

  try {
    if (!id || !username || !pseudonym || !gender || !dateOfBirth) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    try {
      const updatedProfile = await prisma.profile.update({
        where: {
          id: id,
        },
        data: {
          username: username,
          pseudonym: pseudonym,
          gender: gender,
          dateOfBirth: new Date(dateOfBirth),
        },
      });

      return res
        .status(RESPONSE.SUCCESSFUL.CREATED)
        .json({ ...updatedProfile });
    } catch (error) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: error });
    }
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Suppression d'un profil
const deleteProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });

    if (profile.username === profile.user.username) {
      return res
        .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
        .json({ message: "Impossible de supprimer le profil de base." });
    }

    await prisma.profile.delete({
      where: {
        id: id,
      },
    });

    if (profile.image) {
      const filePath = path.join(
        __dirname,
        "../" + USER_IMAGE_DESTINATION + profile.image
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de la photo de profil : ",
            err
          );
        }
      });
    }

    const folderPath = path.join(
      __dirname,
      "..",
      ECG_IMAGE_DESTINATION,
      String(req.id),
      String(id)
    );

    fs.rm(folderPath, { recursive: true, force: true });

    return res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Profil supprimé." });
  } catch (error) {
    console.log(error);
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error });
  }
};

// Récuperation des profiles
const getProfiles = async (req, res) => {
  try {
    try {
      const profiles = await prisma.profile.findMany({
        where: {
          userId: req.id,
        },
        orderBy: {
          id: "asc",
        },
      });

      return res.status(RESPONSE.SUCCESSFUL.OK).json([...profiles]);
    } catch (error) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Impossible de trouver les profiles." });
    }
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { createProfile, updateProfile, deleteProfile, getProfiles };
