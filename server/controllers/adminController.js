const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      profiles: true,
    },
  });
  res.status(200).json(users);
};

module.exports = { getUsers };
