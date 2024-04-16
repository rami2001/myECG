const { PrismaClient } = require("@prisma/client");

const { compare } = require("../util/hash");

const prisma = new PrismaClient();

// Authentification
const auth = async (req, res) => {
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

    if (!compare(password, user.password)) {
      throw new Error("Mot de passe incorrect !");
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { auth };
