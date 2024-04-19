const { PrismaClient } = require("@prisma/client");

const { hash } = require("../util/hash");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

// Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.NO_CONTENT)
      .json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Vérifier si un utilisateur existe déjà
const isExistingUser = async (id, email, username) => {
  return (
    (await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
      },
      where: {
        NOT: { id: id },
        OR: [{ email: email }, { username: username }],
      },
    })) !== null
  );
};

const updateUser = async (req, res) => {
  const { id, email, username, password, pseudonym } = req.body;

  try {
    if (!id || !email || !username || !password || !pseudonym) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Champ(s) manquant(s) !" });
    }

    if (await isExistingUser(id, email, username)) {
      return res.status(RESPONSE.CLIENT_ERROR.CONFLICT).json({
        message: "Cette adresse mail ou ce nom d'utilisateur sont déjà pris.",
      });
    }

    const hashedPassword = await hash(password);

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        pseudonym: pseudonym,
      },
    });

    res
      .status(RESPONSE.SUCCESSFUL.CREATED)
      .json({ message: "Informations mises à jour avec succès." });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { deleteUser, updateUser };
