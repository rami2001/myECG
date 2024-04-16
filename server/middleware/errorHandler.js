const { logEvents } = require("./logEvents");

// Fonction de log des erreurs du serveurs
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name} : ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = { errorHandler };
