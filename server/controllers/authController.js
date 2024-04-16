const { PrismaClient } = require("@prisma/client");

const { compare } = require("../util/hash");

const prisma = new PrismaClient();

// Classe d'erreurs personnalisée
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

// Authentification
const auth = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id || !password) {
      throw new AuthError("Champs manquant !");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: id }, { username: id }],
      },
      include: {
        profiles: true,
      },
    });

    if (user === null) {
      throw new AuthError("Compte introuvable !");
    }

    if (!compare(password, user.password)) {
      throw new AuthError("Mot de passe incorrect !");
    }

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { auth };
