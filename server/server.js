const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Importation des fonctions utiles
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
import corsOptions from "./config/corsOptions";

// Importation des routes
const userRoute = require("./routes/userRoute");

// Initialisation du serveur
const app = express();

const PORT = process.env.PORT || 3500;

// Configuration du serveur
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(logger);

// Implementation des routes
app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use("/user", userRoute);

app.all("*", (req, res) => {
  res.status(400).send("Ressource introuvable !");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur lancé avec succès sur le port ${PORT}`);
});
