const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const path = require("path");

// Fonction de création des logs
const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "ddMMyyyy\thh:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fs.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fs.promises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// Fonction de log des reqêtes du serveur
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

module.exports = { logger, logEvents };
