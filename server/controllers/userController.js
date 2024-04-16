const { PrismaClient } = require("@prisma/client");

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

const updateUser = (req, res) => {
  // TODO
};

module.exports = { deleteUser, updateUser };
