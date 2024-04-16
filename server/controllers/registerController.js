const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");

const prisma = new PrismaClient();

// Classe d'erreurs personnalisée
class RegisterError extends Error {
  constructor(message) {
    super(message);
    this.name = "RegisterError";
  }
}

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

  try {
    if (!email || !username || !password || !pseudonym) {
      throw new RegisterError("Champ(s) manquant(s) !");
    }

    if (await isExistingUser(email, username)) {
      throw new RegisterError("Cet utilisateur éxiste déjà !");
    }

    const hashedPassword = await hash(password);

    const { user, profile } = await createUserTransaction(
      email,
      username,
      hashedPassword,
      pseudonym
    );

    res.status(201).json({ ...user, profile: [profile] });
  } catch (error) {
    if (error instanceof RegisterError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { register, isExistingUser };
