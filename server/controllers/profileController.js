const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Classe d'erreurs personnalisée
class ProfileError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProfileError";
  }
}

// Vérifier si un profil éxiste déjà
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
  const { id, username, pseudonym } = req.body;

  try {
    if (!id || !username || !pseudonym) {
      throw new ProfileError("Champ(s) manquant(s) !");
    }

    if (await isExistingProfile(id, username)) {
      throw new ProfileError("Ce profil éxiste déjà.");
    }

    await prisma.profile.create({
      data: {
        userId: id,
        username: username,
        pseudonym: pseudonym,
      },
    });

    res.status(201).json({ message: "Profil ajouté avec succès." });
  } catch (error) {
    if (error instanceof ProfileError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Mise à jour d'un profile
const updateProfile = async (req, res) => {
  const { id, profileId, username, pseudonym } = req.body;

  try {
    if (!id || !profileId || !username || !pseudonym) {
      throw new ProfileError("Champ(s) manquant(s) !");
    }

    if (await isExistingProfile(id, username)) {
      throw new ProfileError("Ce profil éxiste déjà.");
    }

    await prisma.profile.update({
      where: {
        userId: id,
        id: profileId,
      },
      data: {
        username,
        pseudonym,
      },
    });

    res.status(201).json({ message: "Profil mis à jour avec succès." });
  } catch (error) {
    if (error instanceof ProfileError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Suppresion d'un profil
const deleteProfile = async (req, res) => {
  const { id, profileId } = req.body;

  try {
    const existingProfile = await profileWithUsername(id, profileId);

    if (!existingProfile) {
      throw new ProfileError("Ce profil n'existe pas.");
    }

    if (existingProfile.user.username === existingProfile.username) {
      throw new ProfileError("Impossible de supprimer le profil de base.");
    }

    // Supprimer le profil s'il n'y a pas d'erreur
    await prisma.profile.delete({
      where: {
        userId: id,
        id: profileId,
      },
    });

    res.status(201).json({ message: "Profil supprimé." });
  } catch (error) {
    if (error instanceof ProfileError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { createProfile, updateProfile, deleteProfile };
