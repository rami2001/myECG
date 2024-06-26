const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Importation des fonctions utiles
const { logger } = require("./middleware/logEvents");
const { credentials } = require("./middleware/credentials");
const { errorHandler } = require("./middleware/errorHandler");
const { verifyJWT } = require("./middleware/verifyJWT");
const { corsOptions } = require("./config/corsOptions");

// Importation des routes publiques
const registerRoute = require("./routes/registerRoute");
const authRoute = require("./routes/authRoute");
const refreshRoute = require("./routes/refreshRoute");
const logoutRoute = require("./routes/logoutRoute");

// Importation des routes privées
const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");

// Pour les tests
const adminRoute = require("./routes/adminRoute");

// Initialisation du serveur
const app = express();
const PORT = process.env.PORT || 3500;

// Configuration du serveur
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

// Implémentation des Logs
app.use(logger);
app.use(errorHandler);

// Pour les tests
app.use("/admin", adminRoute);

// Implémentation des routes publiques (sans tokens)
app.use("/register", registerRoute);
app.use("/auth", authRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

// Implémentation des routes privées (avec tokens)
// Nécessite l'ajout du middleware de vérification des tokens d'accès
app.use(verifyJWT);
app.use("/user", userRoute);
app.use("/profile", profileRoute);

app.all("*", (req, res) => {
  res.status(400).send("Ressource introuvable !");
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé avec succès.`);
});
