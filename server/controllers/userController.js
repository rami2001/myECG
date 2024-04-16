const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Transaction qui permet de créer un utilisateur et son profile à la fois
const createUserTransaction = async (email, username, password, pseudonym) => {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
        pseudonym: pseudonym,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        username: username,
        pseudonym: pseudonym,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return { user, profile };
  });
};

// Vérifier si un utilisateur éxiste déjà
const existingUser = async (email, username) => {
  return (
    (await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    })) !== null
  );
};

// Création d'un utilisateur (inscription)
const createUser = async (req, res) => {
  const { email, username, password, pseudonym } = req.body;

  if (await existingUser(email, username)) {
    throw new Error("Cet utilisateur éxiste déjà !");
  }

  try {
    const { user, profile } = await createUserTransaction(
      email,
      username,
      password,
      pseudonym
    );

    res.status(201).json({ ...user, profile: [profile] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supression d'un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.status(204).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, deleteUser };
