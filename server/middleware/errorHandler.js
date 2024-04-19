const { logEvents } = require("./logEvents");
const { RESPONSE } = require("../util/response");

// Fonction de log des erreurs du serveurs
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name} : ${err.message}`, "errLog.txt");
  console.error(err.stack);

  res.status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR).send(err.message);
};

module.exports = { errorHandler };
