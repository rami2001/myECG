const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

// Transaction qui permet de créer un utilisateur et son profile à la fois
const createUserTransaction = async (
  email,
  username,
  password,
  pseudonym,
  gender,
  dateOfBirth
) => {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
        pseudonym: pseudonym,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        username: username,
        pseudonym: pseudonym,
        gender: gender,
        dateOfBirth: new Date(dateOfBirth),
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

// Vérifie si un utilisateur éxiste déjà
const checkIfIsExistingUser = async (req, res) => {
  const { email, username } = req.body;

  try {
    if (!email || !username) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    if (await isExistingUser(email, username)) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Cet utilisateur éxiste déjà !" });
    }

    res.sendStatus(RESPONSE.SUCCESSFUL.OK);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Création d'un utilisateur (inscription)
const register = async (req, res) => {
  const { email, username, password, pseudonym, dateOfBirth, gender } =
    req.body;

  try {
    if (!email || !username || !password || !gender || !dateOfBirth) {
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

    await createUserTransaction(
      email,
      username,
      hashedPassword,
      pseudonym,
      gender,
      dateOfBirth
    );

    res.sendStatus(RESPONSE.SUCCESSFUL.CREATED);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { register, checkIfIsExistingUser };
