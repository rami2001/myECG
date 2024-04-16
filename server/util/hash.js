const bcrypt = require("bcrypt");

// Fonction de hachage du mot de passe
const hash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Fonction de comparaison du hachage
const compare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hash, compare };
