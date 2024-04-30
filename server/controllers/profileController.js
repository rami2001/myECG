const { PrismaClient } = require("@prisma/client");

const { RESPONSE } = require("../util/response");

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
  const { id, username, pseudonym, gender, dateOfBirth } = req.body;

  try {
    if (!id || !username || !pseudonym || !gender || !dateOfBirth) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    try {
      const profile = await prisma.profile.create({
        data: {
          userId: id,
          username: username,
          pseudonym: pseudonym,
          gender: gender,
          dateOfBirth: new Date(dateOfBirth),
        },
      });

      return res.status(RESPONSE.SUCCESSFUL.CREATED).json({ profile });
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

      return res.status(RESPONSE.SUCCESSFUL.CREATED).json({ updatedProfile });
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

    // Supprimer le profil s'il n'y a pas d'erreur
    await prisma.profile.delete({
      where: {
        id: id,
      },
    });

    return res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Profil supprimé." });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error });
  }
};

module.exports = { createProfile, updateProfile, deleteProfile };
