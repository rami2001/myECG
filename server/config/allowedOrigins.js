require("dotenv").config();

// Liste d'origines de requêtes permises
const allowedOrigins = [process.env.CLIENT, process.env.SERVER];

module.exports = { allowedOrigins };
