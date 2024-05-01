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
    await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
        pseudonym: pseudonym,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender,
      },
    });

    await prisma.profile.create({
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
  });
};

// Création d'un utilisateur (inscription)
const register = async (req, res) => {
  const { email, username, password, dateOfBirth, gender } = req.body;
  try {
    if (!email || !username || !password || !gender || !dateOfBirth) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    const hashedPassword = await hash(password);

    try {
      await createUserTransaction(
        email,
        username,
        hashedPassword,
        gender,
        dateOfBirth
      );
    } catch (error) {
      return res
        .status(RESPONSE.CLIENT_ERROR.CONFLICT)
        .json({ message: "Ce compte éxiste déjà." });
    }

    return res.sendStatus(RESPONSE.SUCCESSFUL.CREATED);
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { register };
