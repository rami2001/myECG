const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Fonction de hashage du mot de passe
const hash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

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
const isExistingUser = async (email, username) => {
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

  if (!email || !username || !password || !pseudonym) {
    throw new Error("Champs manquant !");
  }

  if (await isExistingUser(email, username)) {
    throw new Error("Cet utilisateur éxiste déjà !");
  }

  const hashedPassword = await hash(password);

  try {
    const { user, profile } = await createUserTransaction(
      email,
      username,
      hashedPassword,
      pseudonym
    );

    res.status(201).json({ ...user, profile: [profile] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authentification
const getUser = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    throw new Error("Champs manquant !");
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: id }, { username: id }],
      },
      include: {
        profiles: true,
      },
    });

    if (user === null) {
      throw new Error("Compte introuvable !");
    }

    const matchingPasswords = await bcrypt.compare(password, user.password);

    if (!matchingPasswords) {
      throw new Error("Mot de passe incorrect !");
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUser };
