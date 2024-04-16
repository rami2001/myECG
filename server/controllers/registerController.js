const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");

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
const register = async (req, res) => {
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

module.exports = { register };
