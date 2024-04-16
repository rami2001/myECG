const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Importation des fonctions utiles
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");

// Importation des routes
const registerRoute = require("./routes/registerRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

// Initialisation du serveur
const app = express();
const PORT = process.env.PORT || 3500;

// Configuration du serveur
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Implémentation des Logs
app.use(logger);
app.use(errorHandler);

// Implémentation des routes
app.use("/register", registerRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);

app.all("*", (req, res) => {
  res.status(400).send("Ressource introuvable !");
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé avec succès sur le port ${PORT}`);
});
