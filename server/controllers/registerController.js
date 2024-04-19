const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");
const { RESPONSE } = require("../util/response");

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
      select: {
        email: true,
        username: true,
      },
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
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    if (await isExistingUser(email, username)) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Cet utilisateur éxiste déjà !" });
    }

    const hashedPassword = await hash(password);

    const { user, profile } = await createUserTransaction(
      email,
      username,
      hashedPassword,
      pseudonym
    );

    res
      .status(RESPONSE.SUCCESSFUL.CREATED)
      .json({ ...user, profile: [profile] });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { register, isExistingUser };
