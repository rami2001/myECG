const { PrismaClient } = require("@prisma/client");

const { AuthError } = require("./authController");
const { TokenError } = require("../middleware/verifyJWT");
const { hash } = require("../util/hash");

const prisma = new PrismaClient();

// Supression d'un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.status(201).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vérifier si un utilisateur éxiste déjà
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
      throw new AuthError("Champ(s) manquant(s) !");
    }

    if (await isExistingUser(id, email, username)) {
      throw new AuthError(
        "Cette adresse mail ou ce nom d'utilisateur sont déjà pris."
      );
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

    res.status(201).json({ message: "Informations mises à jour avec succès." });
  } catch (error) {
    if (error instanceof TokenError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { deleteUser, updateUser };
