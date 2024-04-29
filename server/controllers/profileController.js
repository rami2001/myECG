const { PrismaClient } = require("@prisma/client");

const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

// Vérifier si un profil existe déjà
const isExistingProfile = async (id, username) => {
  return (
    (await prisma.profile.findFirst({
      where: {
        AND: {
          userId: id,
          username: username,
        },
      },
    })) !== null
  );
};

const getProfileByUsername = async (id, username) => {
  return await prisma.profile.findFirst({
    where: {
      AND: {
        userId: id,
        username: username,
      },
    },
  });
};

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

// Obtention de tous les profils associés à un utilisateur
const getProfiles = async (req, res) => {
  const { id } = req.params;

  try {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: id,
      },
    });

    if (!profiles || profiles.length === 0) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Aucun profil trouvé pour cet utilisateur." });
    }

    res.status(RESPONSE.SUCCESSFUL.OK).json(profiles);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Création d'un profil
const createProfile = async (req, res) => {
  const { id, username, pseudonym, gender, dateOfBirth } = req.body;

  try {
    if (!id || !username || !pseudonym) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    if (await isExistingProfile(id, username)) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Ce profil existe déjà." });
    }

    const profile = await prisma.profile.create({
      data: {
        userId: id,
        username: username,
        pseudonym: pseudonym,
        gender: gender,
        dateOfBirth: dateOfBirth,
      },
    });

    res.status(RESPONSE.SUCCESSFUL.CREATED).json({ profile });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Mise à jour d'un profil
const updateProfile = async (req, res) => {
  const { id, profileId, username, pseudonym, gender, dateOfBirth } = req.body;

  try {
    if (
      !id ||
      !profileId ||
      !username ||
      !pseudonym ||
      !gender ||
      !dateOfBirth
    ) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    const profile = await getProfileByUsername(id, username);

    if (profile.id !== profileId) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Ce profil existe déjà." });
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        username,
        pseudonym,
        gender,
        dateOfBirth,
      },
    });

    res.status(RESPONSE.SUCCESSFUL.CREATED).json({ updatedProfile });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Suppression d'un profil
const deleteProfile = async (req, res) => {
  const { id, profileId } = req.body;

  try {
    const existingProfile = await profileWithUsername(id, profileId);

    if (!existingProfile) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Ce profil n'existe pas." });
    }

    if (existingProfile.user.username === existingProfile.username) {
      return res
        .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
        .json({ message: "Impossible de supprimer le profil de base." });
    }

    // Supprimer le profil s'il n'y a pas d'erreur
    await prisma.profile.delete({
      where: {
        userId: id,
        id: profileId,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Profil supprimé." });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { getProfiles, createProfile, updateProfile, deleteProfile };
